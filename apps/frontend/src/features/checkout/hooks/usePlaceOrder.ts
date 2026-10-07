import { useMutation } from '@tanstack/react-query';
import { type RequestError, toRequestError } from '@/api/error';
import { placeOrder } from '@/api/generated';
import {
    type OrderDetailsPaymentMethod,
    type PlaceOrderRequest,
    PlaceOrderResponseStatus
} from '@/api/generated/model';
import type { CartItem } from '@/features/cart/contexts/cart';
import type { CheckoutFormValues } from '@/features/checkout/hooks/useCheckoutForm';
import { debug_useMutation } from '@/hooks/debug_useMutation';
import { env } from '@/lib/env';

export type OrderDraft = {
    items: CartItem[];
    details: CheckoutFormValues;
};

export type UsePlaceOrderResult = {
    placeOrder: (order: OrderDraft) => Promise<void>;
    isPending: boolean;
    error: RequestError | null;
};

function toPlaceOrderRequest({ items, details }: OrderDraft): PlaceOrderRequest {
    return {
        items: items.map(({ id, quantity }) => ({ id, quantity })),
        details: {
            contact: details.contact,
            address: details.address,
            isInvoiceSameAsDelivery: details.isInvoiceSameAsDelivery,
            invoice: details.isInvoiceSameAsDelivery
                ? undefined
                : { ...details.invoice, taxId: details.invoice.taxId || undefined },
            deliveryMethod: details.deliveryMethod,
            paymentMethod: details.paymentMethod as OrderDetailsPaymentMethod
        }
    };
}

async function placeOrderAndCheckPayment(order: OrderDraft): Promise<void> {
    const response = await placeOrder(toPlaceOrderRequest(order));

    if (response.status === PlaceOrderResponseStatus.PAYMENT_FAILED) {
        throw new Error(
            `Płatność za zamówienie nr ${response.orderId} została odrzucona. Spróbuj ponownie lub wybierz inną metodę płatności.`
        );
    }
}

function useApiPlaceOrder(): UsePlaceOrderResult {
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: placeOrderAndCheckPayment
    });

    return {
        placeOrder: mutateAsync,
        isPending,
        error: toRequestError(error)
    };
}

function debug_useStaticPlaceOrder(): UsePlaceOrderResult {
    const { mutate, isPending } = debug_useMutation<OrderDraft>();

    return {
        placeOrder: mutate,
        isPending,
        error: null
    };
}

export const usePlaceOrder = env.isDebug ? debug_useStaticPlaceOrder : useApiPlaceOrder;
