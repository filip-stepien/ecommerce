import type { RequestError } from '@/api/error';
import type { CartItem } from '@/features/cart/contexts/cart';
import type { CheckoutFormValues } from '@/features/checkout/hooks/useCheckoutForm';
import { debug_useMutation } from '@/hooks/debug_useMutation';

export type OrderDraft = {
    items: CartItem[];
    details: CheckoutFormValues;
};

export type UsePlaceOrderResult = {
    placeOrder: (order: OrderDraft) => Promise<void>;
    isPending: boolean;
    error: RequestError | null;
};

function debug_useStaticPlaceOrder(): UsePlaceOrderResult {
    const { mutate, isPending } = debug_useMutation<OrderDraft>();

    return {
        placeOrder: mutate,
        isPending,
        error: null
    };
}

export { debug_useStaticPlaceOrder as usePlaceOrder };
