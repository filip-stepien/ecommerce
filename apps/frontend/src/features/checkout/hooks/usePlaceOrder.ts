import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type RequestError, toRequestError } from '@/api/error';
import { placeOrder } from '@/api/generated';
import {
    type OrderDetailsPaymentMethod,
    type PlaceOrderRequest,
    type PlaceOrderResponse
} from '@/api/generated/model';
import type { CartItem } from '@/features/cart/contexts/cart';
import type { CheckoutFormValues } from '@/features/checkout/hooks/useCheckoutForm';
import type { CheckoutOptions } from './useCheckoutOptions';
import { customerOrdersKey } from '@/features/orders/hooks/useCustomerOrders';
import { debug_placeOrder } from '@/features/orders/lib/debug_orders';
import { env } from '@/lib/env';

export type OrderDraft = {
    items: CartItem[];
    details: CheckoutFormValues;
    options: CheckoutOptions;
};

export type UsePlaceOrderResult = {
    placeOrder: (order: OrderDraft) => Promise<PlaceOrderResponse>;
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

export function usePlaceOrder(): UsePlaceOrderResult {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (order: OrderDraft) =>
            env.isDebug ? debug_placeOrder(order) : placeOrder(toPlaceOrderRequest(order)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: customerOrdersKey });
        }
    });
    return { placeOrder: mutateAsync, isPending, error: toRequestError(error) };
}
