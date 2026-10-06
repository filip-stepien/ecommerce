import { Radio, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { CheckoutSection } from '@/features/checkout/components/CheckoutSection';
import type { UseCheckoutFormResult } from '@/features/checkout/hooks/useCheckoutForm';
import type { PaymentMethod } from '@/features/checkout/hooks/useCheckoutOptions';
import { formatCardCvc, formatCardExpiry, formatCardNumber } from '@/lib/format';

type PaymentMethodSectionProps = {
    form: UseCheckoutFormResult;
    methods: PaymentMethod[];
};

export function PaymentMethodSection({ form, methods }: PaymentMethodSectionProps) {
    return (
        <CheckoutSection title='3. Metoda płatności'>
            <Radio.Group aria-label='Metoda płatności' {...form.getInputProps('paymentMethod')}>
                <Stack className='gap-2.5'>
                    {methods.map(method => (
                        <Radio
                            key={method.id}
                            value={method.id}
                            size='xs'
                            classNames={{ label: 'text-sm' }}
                            label={method.name}
                        />
                    ))}
                </Stack>
            </Radio.Group>
            {form.values.paymentMethod === 'card' && (
                <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-4'>
                    <TextInput
                        label='Numer karty'
                        className='sm:col-span-2'
                        placeholder='0000 0000 0000 0000'
                        inputMode='numeric'
                        autoComplete='cc-number'
                        {...form.getInputProps('card.number')}
                        onChange={event =>
                            form.setFieldValue(
                                'card.number',
                                formatCardNumber(event.currentTarget.value)
                            )
                        }
                    />
                    <TextInput
                        label='Data ważności'
                        placeholder='MM/RR'
                        inputMode='numeric'
                        autoComplete='cc-exp'
                        {...form.getInputProps('card.expiry')}
                        onChange={event =>
                            form.setFieldValue(
                                'card.expiry',
                                formatCardExpiry(event.currentTarget.value)
                            )
                        }
                    />
                    <TextInput
                        label='Kod CVC'
                        placeholder='123'
                        inputMode='numeric'
                        autoComplete='cc-csc'
                        {...form.getInputProps('card.cvc')}
                        onChange={event =>
                            form.setFieldValue('card.cvc', formatCardCvc(event.currentTarget.value))
                        }
                    />
                    <TextInput
                        label='Imię i nazwisko na karcie'
                        className='sm:col-span-2'
                        autoComplete='cc-name'
                        {...form.getInputProps('card.holder')}
                    />
                </SimpleGrid>
            )}
        </CheckoutSection>
    );
}
