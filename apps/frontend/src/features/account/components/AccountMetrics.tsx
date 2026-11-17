import { SimpleGrid, Stack, Text } from '@mantine/core';
import { SectionCard } from '@/components/SectionCard';
import {
    countPendingPayments,
    type CustomerOrder,
    sumPaidTotal
} from '@/features/orders/lib/customerOrder';
import { formatPrice, pluralize } from '@/lib/format';

type AccountMetricsProps = {
    orders: CustomerOrder[];
};

export function AccountMetrics({ orders }: AccountMetricsProps) {
    const pendingCount = countPendingPayments(orders);
    const paidTotal = sumPaidTotal(orders);
    const metrics = [
        {
            label: 'Zamówienia',
            value: orders.length,
            caption: `${pluralize(pendingCount, { one: 'zamówienie', few: 'zamówienia', many: 'zamówień' })} do opłacenia`
        },
        {
            label: 'Twoje zakupy',
            value: formatPrice(paidTotal),
            caption: 'Od dołączenia do volt'
        }
    ];

    return (
        <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-2'>
            {metrics.map(metric => (
                <SectionCard key={metric.label}>
                    <Stack className='gap-2 leading-normal'>
                        <Text className='text-xs leading-normal text-dimmed'>{metric.label}</Text>
                        <Text className='text-[27px] leading-normal font-semibold'>
                            {metric.value}
                        </Text>
                        <Text className='text-xs leading-normal text-dimmed'>{metric.caption}</Text>
                    </Stack>
                </SectionCard>
            ))}
        </SimpleGrid>
    );
}
