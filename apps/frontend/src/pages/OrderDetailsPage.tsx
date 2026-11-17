import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { Link, useParams } from 'react-router';
import { SectionCard } from '@/components/SectionCard';
import { Spinner } from '@/components/Spinner';
import { OrderDetails } from '@/features/orders/components/OrderDetails';
import { useCustomerOrder } from '@/features/orders/hooks/useCustomerOrder';
import { appRoutes } from '@/lib/routes';

function OrderNotFound() {
    return (
        <SectionCard>
            <Stack className='items-start'>
                <Title order={1}>Nie znaleziono zamówienia</Title>
                <Text className='text-dimmed'>
                    Sprawdź numer zamówienia lub wróć do historii zakupów.
                </Text>
                <Button component={Link} to={appRoutes.orders}>
                    Wróć do zamówień
                </Button>
            </Stack>
        </SectionCard>
    );
}

export function OrderDetailsPage() {
    const { number } = useParams();
    const { order, isLoading, error, notFound } = useCustomerOrder(number);

    if (isLoading) return <Spinner />;

    if (error && !notFound) {
        return (
            <Alert color='red' title='Nie udało się pobrać zamówienia'>
                {error.message}
            </Alert>
        );
    }

    if (!order) return <OrderNotFound />;

    return <OrderDetails order={order} />;
}
