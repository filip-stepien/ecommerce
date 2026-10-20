import { useQuery } from '@tanstack/react-query';
import { ApiError, toRequestError } from '@/api/error';
import { getCustomerOrder, getCustomerOrders } from '@/api/generated';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toCustomerOrder } from './model';
import { env } from '@/lib/env';
import { readDebugOrders } from './debugOrders';

export const customerOrdersKey = ['customer-orders'] as const;

export function useCustomerOrders() {
    const { isAuthenticated, userId } = useAuth();
    const query = useQuery({
        queryKey: [...customerOrdersKey, userId],
        queryFn: ({ signal }) =>
            env.isDebug ? Promise.resolve(readDebugOrders()) : getCustomerOrders({ signal }),
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

export function useCustomerOrder(number: string | undefined) {
    const { isAuthenticated, userId } = useAuth();
    const validId =
        !!number &&
        /^\d+$/.test(number) &&
        Number.isSafeInteger(Number(number)) &&
        Number(number) > 0;
    const query = useQuery({
        queryKey: [...customerOrdersKey, userId, number],
        queryFn: async ({ signal }) => {
            if (!env.isDebug) return getCustomerOrder(Number(number), { signal });
            const order = readDebugOrders().find(order => String(order.id) === number);
            if (!order) throw new ApiError(404, null);
            return order;
        },
        select: toCustomerOrder,
        enabled: isAuthenticated && validId,
        retry: false
    });
    return {
        order: query.data,
        isLoading: query.isLoading,
        notFound: !validId || (query.error instanceof ApiError && query.error.status === 404),
        error: toRequestError(query.error)
    };
}
