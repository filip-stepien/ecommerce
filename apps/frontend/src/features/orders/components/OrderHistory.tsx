import { useState } from 'react';
import { Button, Divider, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { Link } from 'react-router';
import { QueryResult } from '@/components/QueryResult';
import { SectionCard } from '@/components/SectionCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useCustomerOrders } from '@/features/orders/hooks/useCustomerOrders';
import {
    type CustomerOrder,
    describeItems,
    filterOrders,
    isOrderStatus,
    type OrderFilter,
    orderStatuses
} from '@/features/orders/lib/customerOrder';
import { formatDate, formatPrice } from '@/lib/format';
import { orderPath } from '@/lib/routes';

const statusOptions = [
    { label: 'Wszystkie', value: 'all' },
    ...Object.entries(orderStatuses).map(([value, { label }]) => ({ value, label }))
];

function toStatusFilter(value: string | null): OrderFilter['status'] {
    return value && isOrderStatus(value) ? value : 'all';
}

export function OrderRow({ order }: { order: CustomerOrder }) {
    const status = orderStatuses[order.status];

    return (
        <Group className='flex-wrap gap-4 border-b border-default-border pb-5 last:border-b-0 last:pb-0 xl:flex-nowrap'>
            <Stack className='min-w-0 flex-1 basis-full gap-[3px] xl:basis-0'>
                <Text className='text-sm leading-normal font-semibold'>#{order.number}</Text>
                <Text className='text-xs leading-normal text-dimmed'>
                    {formatDate(order.date)} · {describeItems(order)}
                </Text>
            </Stack>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
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
}

function OrderFilters({
    filter,
    onChange
}: {
    filter: OrderFilter;
    onChange: (filter: OrderFilter) => void;
}) {
    return (
        <Stack className='gap-3'>
            <TextInput
                placeholder='Szukaj po numerze zamówienia lub nazwie produktu'
                value={filter.search}
                onChange={event => onChange({ ...filter, search: event.currentTarget.value })}
            />
            <Select
                value={filter.status}
                onChange={value => onChange({ ...filter, status: toStatusFilter(value) })}
                allowDeselect={false}
                data={statusOptions}
            />
        </Stack>
    );
}

function OrderHistoryList({ orders }: { orders: CustomerOrder[] }) {
    const [filter, setFilter] = useState<OrderFilter>({ search: '', status: 'all' });
    const visibleOrders = filterOrders(orders, filter);

    return (
        <SectionCard>
            <Stack className='gap-5'>
                <Title order={2} className='text-[22px] leading-normal font-semibold'>
                    Moje zamówienia
                </Title>
                <OrderFilters filter={filter} onChange={setFilter} />
                <Divider />
                {orders.length === 0 && (
                    <Text className='text-dimmed'>Nie masz jeszcze żadnych zamówień.</Text>
                )}
                {orders.length > 0 && visibleOrders.length === 0 && (
                    <Text className='text-dimmed'>Brak zamówień pasujących do wyszukiwania.</Text>
                )}
                {visibleOrders.map(order => (
                    <OrderRow key={order.number} order={order} />
                ))}
            </Stack>
        </SectionCard>
    );
}

export function OrderHistory() {
    const { orders, isLoading, error } = useCustomerOrders();

    return (
        <QueryResult
            data={orders}
            isLoading={isLoading}
            error={error}
            errorText='Nie udało się pobrać zamówień'
        >
            {orders => <OrderHistoryList orders={orders} />}
        </QueryResult>
    );
}
