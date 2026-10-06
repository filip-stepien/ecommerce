import { type UseFormReturnType, schemaResolver, useForm } from '@mantine/form';
import { z } from 'zod';
import type { CheckoutOptions } from '@/features/checkout/hooks/useCheckoutOptions';

const requiredText = z.string().trim().min(1, 'To pole jest wymagane');

const addressSchema = z.object({
    street: requiredText,
    houseNumber: requiredText,
    postalCode: requiredText,
    city: requiredText,
    country: requiredText
});

const checkoutSchema = z.object({
    contact: z.object({
        firstName: requiredText,
        lastName: requiredText,
        email: requiredText.pipe(z.email('Podaj poprawny adres e-mail')),
        phone: requiredText.regex(/^\+?[\d\s-]{9,}$/, 'Podaj poprawny numer telefonu')
    }),
    address: addressSchema,
    isInvoiceSameAsDelivery: z.boolean(),
    invoice: z.object({
        name: requiredText,
        taxId: z
            .string()
            .trim()
            .regex(/^(\d{3}-?\d{3}-?\d{2}-?\d{2})?$/, 'NIP powinien mieć 10 cyfr'),
        address: addressSchema
    }),
    deliveryMethod: requiredText,
    paymentMethod: requiredText,
    card: z.object({
        number: requiredText.regex(/^(\d ?){13,19}$/, 'Podaj poprawny numer karty'),
        holder: requiredText,
        expiry: requiredText.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Podaj datę w formacie MM/RR'),
        cvc: requiredText.regex(/^\d{3,4}$/, 'Podaj poprawny kod CVC')
    })
});

export type Address = z.infer<typeof addressSchema>;

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export type AddressPath = 'address' | 'invoice.address';

export type UseCheckoutFormResult = UseFormReturnType<CheckoutFormValues>;

const emptyAddress: Address = {
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'Polska'
};

function validate(values: CheckoutFormValues) {
    const schema = checkoutSchema.omit({
        ...(values.isInvoiceSameAsDelivery && { invoice: true }),
        ...(values.paymentMethod !== 'card' && { card: true })
    });

    return schemaResolver(schema, { sync: true })(values);
}

export function useCheckoutForm(options: CheckoutOptions): UseCheckoutFormResult {
    return useForm<CheckoutFormValues>({
        initialValues: {
            contact: { firstName: '', lastName: '', email: '', phone: '' },
            address: emptyAddress,
            isInvoiceSameAsDelivery: true,
            invoice: { name: '', taxId: '', address: emptyAddress },
            deliveryMethod: options.deliveryMethods[0]?.id ?? '',
            paymentMethod: options.paymentMethods[0]?.id ?? '',
            card: { number: '', holder: '', expiry: '', cvc: '' }
        },
        validate
    });
}
