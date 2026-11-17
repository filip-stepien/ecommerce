import { useQuery } from '@tanstack/react-query';
import { toRequestError } from '@/api/error';
import { getCustomerOrders } from '@/api/generated';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toCustomerOrder } from '@/features/orders/lib/customerOrder';
import { debug_readOrders } from '@/features/orders/lib/debug_orders';
import { env } from '@/lib/env';

export const customerOrdersKey = ['customer-orders'] as const;

export function useCustomerOrders() {
    const { isAuthenticated, userId } = useAuth();
    const query = useQuery({
        queryKey: [...customerOrdersKey, userId],
        queryFn: ({ signal }) =>
            env.isDebug ? Promise.resolve(debug_readOrders()) : getCustomerOrders({ signal }),
        select: orders => orders.map(toCustomerOrder),
        enabled: isAuthenticated,
        retry: false
    });

    return {
        orders: query.data ?? [],
        isLoading: query.isLoading,
        error: toRequestError(query.error)
    };
}
