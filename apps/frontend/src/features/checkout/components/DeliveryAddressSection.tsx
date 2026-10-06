import { Checkbox, SimpleGrid, TextInput } from '@mantine/core';
import { AddressFields } from '@/features/checkout/components/AddressFields';
import { CheckoutSection } from '@/features/checkout/components/CheckoutSection';
import type { UseCheckoutFormResult } from '@/features/checkout/hooks/useCheckoutForm';

type DeliveryAddressSectionProps = {
    form: UseCheckoutFormResult;
};

export function DeliveryAddressSection({ form }: DeliveryAddressSectionProps) {
    return (
        <CheckoutSection title='1. Adres dostawy'>
            <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-4'>
                <TextInput
                    label='Imię'
                    className='sm:col-span-2'
                    autoComplete='given-name'
                    {...form.getInputProps('contact.firstName')}
                />
                <TextInput
                    label='Nazwisko'
                    className='sm:col-span-2'
                    autoComplete='family-name'
                    {...form.getInputProps('contact.lastName')}
                />
                <TextInput
                    label='Adres e-mail'
                    className='sm:col-span-2'
                    inputMode='email'
                    autoComplete='email'
                    {...form.getInputProps('contact.email')}
                />
                <TextInput
                    label='Telefon'
                    className='sm:col-span-2'
                    type='tel'
                    autoComplete='tel'
                    {...form.getInputProps('contact.phone')}
                />
                <AddressFields form={form} path='address' />
                <Checkbox
                    label='Dane do faktury takie same jak adres dostawy'
                    className='sm:col-span-4'
                    {...form.getInputProps('isInvoiceSameAsDelivery', { type: 'checkbox' })}
                />
                {!form.values.isInvoiceSameAsDelivery && (
                    <>
                        <TextInput
                            label='Imię i nazwisko lub nazwa firmy'
                            className='sm:col-span-3'
                            autoComplete='organization'
                            {...form.getInputProps('invoice.name')}
                        />
                        <TextInput
                            label='NIP (opcjonalnie)'
                            inputMode='numeric'
                            {...form.getInputProps('invoice.taxId')}
                        />
                        <AddressFields form={form} path='invoice.address' />
                    </>
                )}
            </SimpleGrid>
        </CheckoutSection>
    );
}
