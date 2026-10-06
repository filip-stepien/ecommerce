import { Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { QueryResult } from '@/components/QueryResult';
import { useCart } from '@/features/cart/hooks/useCart';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { CheckoutNotice } from '@/features/checkout/components/CheckoutNotice';
import { useCheckoutOptions } from '@/features/checkout/hooks/useCheckoutOptions';

export function CheckoutPage() {
    const { items, clear } = useCart();
    const { options, isLoading, error } = useCheckoutOptions();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    function handleOrderPlaced() {
        clear();
        setIsOrderPlaced(true);
    }

    function renderContent() {
        if (isOrderPlaced) {
            return (
                <CheckoutNotice title='Dziękujemy za zamówienie'>
                    Twoje zamówienie zostało przyjęte do realizacji.
                </CheckoutNotice>
            );
        }

        if (items.length === 0) {
            return (
                <CheckoutNotice title='Twój koszyk jest pusty'>
                    Dodaj produkty do koszyka, aby złożyć zamówienie.
                </CheckoutNotice>
            );
        }

        return (
            <QueryResult
                data={options}
                isLoading={isLoading}
                error={error}
                errorText='Nie udało się pobrać opcji zamówienia'
            >
                {options => <CheckoutForm options={options} onOrderPlaced={handleOrderPlaced} />}
            </QueryResult>
        );
    }

    return (
        <Stack className='gap-7'>
            <Stack className='gap-2'>
                <Title order={1} className='text-[32px]'>
                    {isOrderPlaced ? 'Potwierdzenie' : 'Dostawa i płatność'}
                </Title>
                {!isOrderPlaced && (
                    <Text className='text-sm text-dimmed'>
                        Podaj adres, wybierz sposób dostawy i metodę płatności.
                    </Text>
                )}
            </Stack>
            {renderContent()}
        </Stack>
    );
}
