import { Radio, Stack } from '@mantine/core';
import { CheckoutSection } from '@/features/checkout/components/CheckoutSection';
import type { UseCheckoutFormResult } from '@/features/checkout/hooks/useCheckoutForm';
import type { DeliveryMethod } from '@/features/checkout/hooks/useCheckoutOptions';
import { formatPrice } from '@/lib/format';

type DeliveryMethodSectionProps = {
    form: UseCheckoutFormResult;
    methods: DeliveryMethod[];
};

export function DeliveryMethodSection({ form, methods }: DeliveryMethodSectionProps) {
    return (
        <CheckoutSection title='2. Sposób dostawy'>
            <Radio.Group aria-label='Sposób dostawy' {...form.getInputProps('deliveryMethod')}>
                <Stack className='gap-2.5'>
                    {methods.map(method => (
                        <Radio
                            key={method.id}
                            value={method.id}
                            size='xs'
                            classNames={{ label: 'text-sm' }}
                            label={`${method.name} - ${formatPrice(method.price)}`}
                        />
                    ))}
                </Stack>
            </Radio.Group>
        </CheckoutSection>
    );
}
