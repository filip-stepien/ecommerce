import { useCustomerOrders } from '@/features/orders/useCustomerOrders';
import type { CustomerOrder } from '@/features/orders/model';
import type { RequestError } from '@/api/error';

export type Order = CustomerOrder;

export type PersonalOffer = {
    id: string;
    title: string;
    description: string[];
    actionLabel: string;
};

export type Address = {
    recipient: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    lastUsedOrderNumber: string | null;
};

export type AccountOverview = {
    favoriteCount: number;
    orders: Order[];
    offers: PersonalOffer[];
    defaultAddress: Address | null;
};

export type UseAccountOverviewResult = {
    overview: AccountOverview | null;
    isLoading: boolean;
    error: RequestError | null;
};

export function useAccountOverview(): UseAccountOverviewResult {
    const { orders, isLoading, error } = useCustomerOrders();
    const latest = orders[0];
    return {
        overview: {
            favoriteCount: 0,
            orders,
            offers: [],
            defaultAddress: latest
                ? {
                      recipient: `${latest.contact.firstName} ${latest.contact.lastName}`,
                      street: `${latest.address.street} ${latest.address.houseNumber}`,
                      postalCode: latest.address.postalCode,
                      city: latest.address.city,
                      country: latest.address.country,
                      lastUsedOrderNumber: latest.number
                  }
                : null
        },
        isLoading,
        error
    };
}
