import { useQuery } from '@tanstack/react-query';
import { ApiError, toRequestError } from '@/api/error';
import { getCustomerOrder } from '@/api/generated';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { customerOrdersKey } from '@/features/orders/hooks/useCustomerOrders';
import { toCustomerOrder } from '@/features/orders/lib/customerOrder';
import { debug_readOrders } from '@/features/orders/lib/debug_orders';
import { env } from '@/lib/env';

function isValidOrderNumber(number: string | undefined): number is string {
    return (
        !!number &&
        /^\d+$/.test(number) &&
        Number.isSafeInteger(Number(number)) &&
        Number(number) > 0
    );
}

export function useCustomerOrder(number: string | undefined) {
    const { isAuthenticated, userId } = useAuth();
    const validNumber = isValidOrderNumber(number);
    const query = useQuery({
        queryKey: [...customerOrdersKey, userId, number],
        queryFn: async ({ signal }) => {
            if (!env.isDebug) return getCustomerOrder(Number(number), { signal });

            const order = debug_readOrders().find(order => String(order.id) === number);
            if (!order) throw new ApiError(404, null);

            return order;
        },
        select: toCustomerOrder,
        enabled: isAuthenticated && validNumber,
        retry: false
    });

    return {
        order: query.data,
        isLoading: query.isLoading,
        notFound: !validNumber || (query.error instanceof ApiError && query.error.status === 404),
        error: toRequestError(query.error)
    };
}
