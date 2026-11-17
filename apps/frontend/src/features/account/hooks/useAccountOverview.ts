import type { RequestError } from '@/api/error';
import { useCustomerOrders } from '@/features/orders/hooks/useCustomerOrders';
import type { CustomerOrder } from '@/features/orders/lib/customerOrder';

export type Address = {
    recipient: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    lastUsedOrderNumber: string | null;
};

export type AccountOverview = {
    orders: CustomerOrder[];
    defaultAddress: Address | null;
};

export type UseAccountOverviewResult = {
    overview: AccountOverview | null;
    isLoading: boolean;
    error: RequestError | null;
};

function toAddress(order: CustomerOrder): Address {
    return {
        recipient: `${order.contact.firstName} ${order.contact.lastName}`,
        street: `${order.address.street} ${order.address.houseNumber}`,
        postalCode: order.address.postalCode,
        city: order.address.city,
        country: order.address.country,
        lastUsedOrderNumber: order.number
    };
}

export function useAccountOverview(): UseAccountOverviewResult {
    const { orders, isLoading, error } = useCustomerOrders();
    const latestOrder = orders[0];

    return {
        overview: {
            orders,
            defaultAddress: latestOrder ? toAddress(latestOrder) : null
        },
        isLoading,
        error
    };
}
