import { Anchor, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { AccountCard } from '@/features/account/components/AccountCard';
import { StatusBadge } from '@/features/account/components/StatusBadge';
import type { Order, OrderStatus } from '@/features/account/hooks/useAccountOverview';
import { formatDate, formatPrice } from '@/lib/format';

type RecentOrdersProps = {
    orders: Order[];
};

const statusBadges: Record<OrderStatus, { label: string; tone: 'info' | 'success' }> = {
    inTransit: { label: 'W drodze', tone: 'info' },
    delivered: { label: 'Dostarczono', tone: 'success' }
};

function describeItems(order: Order): string {
    return order.otherItemCount > 0
        ? `${order.firstItemName} + ${order.otherItemCount} szt.`
        : order.firstItemName;
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <AccountCard id='orders'>
            <Stack className='gap-5'>
                <Group className='items-start justify-between'>
                    <Title order={2} className='text-[22px] leading-normal font-semibold'>
                        Ostatnie zamówienia
                    </Title>
                    <Anchor component='button' type='button' className='text-[13px]'>
                        Wszystkie zamówienia →
                    </Anchor>
                </Group>
                <Divider />
                {orders.map(order => {
                    const badge = statusBadges[order.status];

                    return (
                        <Group key={order.number} className='flex-wrap gap-5 sm:flex-nowrap'>
                            <Stack className='min-w-0 flex-1 basis-full gap-[3px] sm:basis-0'>
                                <Text className='text-sm leading-normal font-semibold'>
                                    #{order.number}
                                </Text>
                                <Text className='text-xs leading-normal text-dimmed'>
                                    {formatDate(order.date)} · {describeItems(order)}
                                </Text>
                            </Stack>
                            <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
                            <Text className='w-29.5 text-sm leading-normal font-semibold'>
                                {formatPrice(order.total)}
                            </Text>
                            <Button
                                variant='outline'
                                size='md'
                                className='text-(--mantine-color-blue-8)'
                            >
                                Szczegóły
                            </Button>
                        </Group>
                    );
                })}
            </Stack>
        </AccountCard>
    );
}
