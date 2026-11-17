import { Anchor, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { SectionCard } from '@/components/SectionCard';
import { OrderRow } from '@/features/orders/components/OrderHistory';
import type { CustomerOrder } from '@/features/orders/lib/customerOrder';
import { appRoutes } from '@/lib/routes';

const recentOrdersLimit = 2;

type RecentOrdersProps = {
    orders: CustomerOrder[];
};

export function RecentOrders({ orders }: RecentOrdersProps) {
    const recentOrders = orders.slice(0, recentOrdersLimit);

    return (
        <SectionCard id='orders'>
            <Stack className='gap-5'>
                <Group className='items-start justify-between'>
                    <Title order={2} className='text-[22px] leading-normal font-semibold'>
                        Ostatnie zamówienia
                    </Title>
                    <Anchor component={Link} to={appRoutes.orders} className='text-[13px]'>
                        Wszystkie zamówienia →
                    </Anchor>
                </Group>
                <Divider />
                {orders.length === 0 && (
                    <Text className='text-dimmed'>Nie masz jeszcze żadnych zamówień.</Text>
                )}
                {recentOrders.map(order => (
                    <OrderRow key={order.number} order={order} />
                ))}
            </Stack>
        </SectionCard>
    );
}
