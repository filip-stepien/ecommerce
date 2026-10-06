import { TextInput } from '@mantine/core';
import type { AddressPath, UseCheckoutFormResult } from '@/features/checkout/hooks/useCheckoutForm';

type AddressFieldsProps = {
    form: UseCheckoutFormResult;
    path: AddressPath;
};

export function AddressFields({ form, path }: AddressFieldsProps) {
    return (
        <>
            <TextInput
                label='Ulica'
                className='sm:col-span-3'
                autoComplete='address-line1'
                {...form.getInputProps(`${path}.street`)}
            />
            <TextInput
                label='Nr domu / lokalu'
                autoComplete='address-line2'
                {...form.getInputProps(`${path}.houseNumber`)}
            />
            <TextInput
                label='Kod pocztowy'
                autoComplete='postal-code'
                {...form.getInputProps(`${path}.postalCode`)}
            />
            <TextInput
                label='Miasto'
                className='sm:col-span-2'
                autoComplete='address-level2'
                {...form.getInputProps(`${path}.city`)}
            />
            <TextInput
                label='Kraj'
                autoComplete='country-name'
                {...form.getInputProps(`${path}.country`)}
            />
        </>
    );
}
