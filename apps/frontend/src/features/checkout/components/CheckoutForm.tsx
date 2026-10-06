import { Box, Stack } from '@mantine/core';
import { useCart } from '@/features/cart/hooks/useCart';
import { DeliveryAddressSection } from '@/features/checkout/components/DeliveryAddressSection';
import { DeliveryMethodSection } from '@/features/checkout/components/DeliveryMethodSection';
import { OrderItems } from '@/features/checkout/components/OrderItems';
import { OrderSummary } from '@/features/checkout/components/OrderSummary';
import { PaymentMethodSection } from '@/features/checkout/components/PaymentMethodSection';
import {
    type CheckoutFormValues,
    useCheckoutForm
} from '@/features/checkout/hooks/useCheckoutForm';
import type { CheckoutOptions } from '@/features/checkout/hooks/useCheckoutOptions';
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder';

type CheckoutFormProps = {
    options: CheckoutOptions;
    onOrderPlaced: () => void;
};

export function CheckoutForm({ options, onOrderPlaced }: CheckoutFormProps) {
    const { items, itemCount, total } = useCart();
    const form = useCheckoutForm(options);
    const { placeOrder, isPending } = usePlaceOrder();
    const deliveryMethod = options.deliveryMethods.find(
        method => method.id === form.values.deliveryMethod
    );

    async function handleSubmit(details: CheckoutFormValues) {
        await placeOrder({ items, details });
        onOrderPlaced();
    }

    return (
        <Box
            component='form'
            noValidate
            className='flex flex-col gap-7 lg:flex-row lg:items-start'
            onSubmit={form.onSubmit(handleSubmit, errors =>
                form.getInputNode(Object.keys(errors)[0])?.focus()
            )}
        >
            <Stack className='min-w-0 flex-1 gap-5'>
                <DeliveryAddressSection form={form} />
                <DeliveryMethodSection form={form} methods={options.deliveryMethods} />
                <PaymentMethodSection form={form} methods={options.paymentMethods} />
            </Stack>
            <Stack className='w-full shrink-0 gap-5 lg:w-100'>
                <OrderItems items={items} />
                <OrderSummary
                    itemCount={itemCount}
                    productsTotal={total}
                    deliveryMethod={deliveryMethod}
                    vatRate={options.vatRate}
                    isSubmitting={isPending}
                />
            </Stack>
        </Box>
    );
}
