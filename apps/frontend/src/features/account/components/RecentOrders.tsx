import { orderStatuses } from '@/features/orders/model';
import { useState } from 'react';
import { Link } from 'react-router';
import { appRoutes, orderPath } from '@/lib/routes';
import {
    Anchor,
    Button,
    Divider,
    Group,
    Stack,
    Text,
    Title,
    TextInput,
    Select
} from '@mantine/core';
import { AccountCard } from '@/features/account/components/AccountCard';
import { StatusBadge } from '@/features/account/components/StatusBadge';
import type { Order } from '@/features/account/hooks/useAccountOverview';
import { formatDate, formatPrice } from '@/lib/format';

type RecentOrdersProps = {
    orders: Order[];
    all?: boolean;
};

function describeItems(order: Order): string {
    return order.otherItemCount > 0
        ? `${order.firstItemName} + ${order.otherItemCount} szt.`
        : order.firstItemName;
}

export function RecentOrders({ orders, all = false }: RecentOrdersProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const visibleOrders = all
        ? orders.filter(
              order =>
                  (status === 'all' || order.status === status) &&
                  `${order.number} ${order.firstItemName} ${order.items?.map(item => item.name).join(' ') ?? ''}`
                      .toLocaleLowerCase('pl')
                      .includes(search.trim().toLocaleLowerCase('pl'))
          )
        : orders.slice(0, 2);

    return (
        <AccountCard id='orders'>
            <Stack className='gap-5'>
                <Group className='items-start justify-between'>
                    <Title order={2} className='text-[22px] leading-normal font-semibold'>
                        {all ? 'Moje zamówienia' : 'Ostatnie zamówienia'}
                    </Title>
                    {!all && (
                        <Anchor component={Link} to={appRoutes.orders} className='text-[13px]'>
                            Wszystkie zamówienia →
                        </Anchor>
                    )}
                </Group>
                {all && (
                    <Stack gap='sm'>
                        <TextInput
                            aria-label='Szukaj zamówienia'
                            placeholder='Szukaj po numerze zamówienia lub nazwie produktu'
                            value={search}
                            onChange={event => setSearch(event.currentTarget.value)}
                        />
                        <Select
                            aria-label='Status zamówienia'
                            value={status}
                            onChange={value => setStatus(value ?? 'all')}
                            allowDeselect={false}
                            data={[
                                { label: 'Wszystkie', value: 'all' },
                                ...Object.entries(orderStatuses).map(([value, { label }]) => ({
                                    value,
                                    label
                                }))
                            ]}
                        />
                    </Stack>
                )}
                <Divider />
                {orders.length === 0 && <Text c='dimmed'>Nie masz jeszcze żadnych zamówień.</Text>}
                {orders.length > 0 && visibleOrders.length === 0 && (
                    <Text c='dimmed'>Brak zamówień pasujących do wyszukiwania.</Text>
                )}
                {visibleOrders.map(order => {
                    const badge = orderStatuses[order.status];

                    return (
                        <Group
                            key={order.number}
                            className='flex-wrap gap-4 border-b border-default-border pb-5 last:border-b-0 last:pb-0 xl:flex-nowrap'
                        >
                            <Stack className='min-w-0 flex-1 basis-full gap-[3px] xl:basis-0'>
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
                                component={Link}
                                to={orderPath(order.number)}
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
