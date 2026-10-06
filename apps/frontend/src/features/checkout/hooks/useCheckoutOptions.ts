import type { RequestError } from '@/api/error';
import { debug_useQuery } from '@/hooks/debug_useQuery';

export type DeliveryMethod = {
    id: string;
    name: string;
    price: number;
};

export type PaymentMethod = {
    id: string;
    name: string;
};

export type CheckoutOptions = {
    deliveryMethods: DeliveryMethod[];
    paymentMethods: PaymentMethod[];
    vatRate: number;
};

export type UseCheckoutOptionsResult = {
    options: CheckoutOptions | null;
    isLoading: boolean;
    error: RequestError | null;
};

function debug_useStaticCheckoutOptions(): UseCheckoutOptionsResult {
    const { data, isLoading } = debug_useQuery<CheckoutOptions>({
        deliveryMethods: [
            { id: 'courier', name: 'Kurier', price: 14.99 },
            { id: 'pickup', name: 'Odbiór osobisty', price: 0 }
        ],
        paymentMethods: [
            { id: 'blik', name: 'BLIK' },
            { id: 'card', name: 'Karta płatnicza' }
        ],
        vatRate: 0.23
    });

    return {
        options: data ?? null,
        isLoading,
        error: null
    };
}

export { debug_useStaticCheckoutOptions as useCheckoutOptions };
