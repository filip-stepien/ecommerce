import { SimpleGrid, Stack, Text } from '@mantine/core';
import { AccountCard } from '@/features/account/components/AccountCard';
import type { Order, PersonalOffer } from '@/features/account/hooks/useAccountOverview';
import { formatPrice, pluralize } from '@/lib/format';

type AccountMetricsProps = {
    orders: Order[];
    offers: PersonalOffer[];
};

export function AccountMetrics({ orders, offers }: AccountMetricsProps) {
    const inTransitCount = orders.filter(order => order.status === 'inTransit').length;
    const ordersTotal = orders.reduce((sum, order) => sum + order.total, 0);
    const metrics = [
        {
            label: 'Zamówienia',
            value: orders.length,
            caption: `${pluralize(inTransitCount, { one: 'przesyłka', few: 'przesyłki', many: 'przesyłek' })} w drodze`
        },
        {
            label: 'Twoje zakupy',
            value: formatPrice(ordersTotal),
            caption: 'Od dołączenia do volt'
        },
        {
            label: 'Oferty dla Ciebie',
            value: offers.length,
            caption: 'Dopasowane do aktywności'
        }
    ];

    return (
        <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-3'>
            {metrics.map(metric => (
                <AccountCard key={metric.label}>
                    <Stack className='gap-2 leading-normal'>
                        <Text className='text-xs leading-normal text-dimmed'>{metric.label}</Text>
                        <Text className='text-[27px] leading-normal font-semibold'>
                            {metric.value}
                        </Text>
                        <Text className='text-xs leading-normal text-dimmed'>{metric.caption}</Text>
                    </Stack>
                </AccountCard>
            ))}
        </SimpleGrid>
    );
}
