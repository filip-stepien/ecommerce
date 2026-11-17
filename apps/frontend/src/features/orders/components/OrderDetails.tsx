import { Button, Center, Divider, Group, Stack, Text, Title, Tooltip } from '@mantine/core';
import { Check, CircleAlert, CircleCheck, Clock, Package } from 'lucide-react';
import { Link } from 'react-router';
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { SectionCard } from '@/components/SectionCard';
import { StatusBadge } from '@/components/StatusBadge';
import {
    type CustomerOrder,
    type OrderStatus,
    orderStatuses
} from '@/features/orders/lib/customerOrder';
import { formatDate, formatPrice, pluralize } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

type OrderEvent = CustomerOrder['events'][number];
type OrderItem = CustomerOrder['items'][number];

const supportPhoneNumber = '800100200';
const supportHours = 'od poniedziałku do piątku, 8:00–18:00';

function OrderStatusIcon({ status }: { status: OrderStatus }) {
    switch (status) {
        case 'paid':
            return <CircleCheck className='text-[#237b57]' />;
        case 'paymentFailed':
            return <CircleAlert className='text-(--mantine-color-red-8)' />;
        case 'pendingPayment':
            return <Clock className='text-(--mantine-color-blue-8)' />;
    }
}

function OrderDetailsHeader({ order }: { order: CustomerOrder }) {
    const productCount = pluralize(order.items.length, {
        one: 'produkt',
        few: 'produkty',
        many: 'produktów'
    });
    const pieceCount = pluralize(order.itemQuantity, {
        one: 'sztuka',
        few: 'sztuki',
        many: 'sztuk'
    });

    return (
        <Stack className='gap-2'>
            <PageBreadcrumbs
                items={[
                    { label: 'Strona główna', to: appRoutes.home },
                    { label: 'Moje konto', to: appRoutes.account },
                    { label: 'Zamówienia', to: appRoutes.orders },
                    { label: order.number }
                ]}
            />
            <Title order={1} className='text-2xl break-words sm:text-[32px]'>
                Zamówienie #{order.number}
            </Title>
            <Text className='text-sm text-dimmed'>
                Złożono {formatDate(order.date)} o {order.time} · {productCount}, {pieceCount}
            </Text>
        </Stack>
    );
}

function OrderStatusBanner({ status }: { status: OrderStatus }) {
    const { title, description } = orderStatuses[status];

    return (
        <Group className='gap-5 rounded-xl bg-(--mantine-color-blue-0) p-6 dark:bg-(--mantine-color-dark-6)'>
            <Center className='size-14 shrink-0 rounded-xl bg-white'>
                <OrderStatusIcon status={status} />
            </Center>
            <Stack className='min-w-0 flex-1 gap-1'>
                <Title order={2} className='text-xl leading-normal font-semibold sm:text-[23px]'>
                    {title}
                </Title>
                <Text className='text-sm text-dimmed'>{description}</Text>
            </Stack>
        </Group>
    );
}

function TimelineMarker({ complete }: { complete: boolean }) {
    return (
        <Center
            className={`size-[22px] shrink-0 rounded-full ${complete ? 'bg-(--mantine-color-blue-8) text-white' : 'bg-(--mantine-color-gray-1) text-dimmed'}`}
        >
            {complete ? <Check size={12} /> : <span>·</span>}
        </Center>
    );
}

function TimelineConnector({ complete }: { complete: boolean }) {
    return (
        <div
            className={`min-h-[34px] w-0.5 flex-1 ${complete ? 'bg-(--mantine-color-blue-8)' : 'bg-default-border'}`}
        />
    );
}

function OrderTimeline({ events }: { events: OrderEvent[] }) {
    return (
        <SectionCard>
            <Stack className='gap-5'>
                <Title order={2} className='text-xl font-semibold'>
                    Historia zamówienia
                </Title>
                <ol>
                    {events.map((event, index) => {
                        const nextEvent = events[index + 1];

                        return (
                            <li key={event.label} className='flex gap-3.5'>
                                <div className='flex w-[22px] shrink-0 flex-col items-center'>
                                    <TimelineMarker complete={event.complete} />
                                    {nextEvent && (
                                        <TimelineConnector complete={nextEvent.complete} />
                                    )}
                                </div>
                                <Stack className='gap-0.5 pb-[15px]'>
                                    <Text
                                        className={`text-sm font-semibold ${event.complete ? '' : 'text-dimmed'}`}
                                    >
                                        {event.label}
                                    </Text>
                                    <Text className='text-xs text-dimmed'>{event.date}</Text>
                                </Stack>
                            </li>
                        );
                    })}
                </ol>
            </Stack>
        </SectionCard>
    );
}

function OrderShippingCard({ order }: { order: CustomerOrder }) {
    const { contact, address } = order;

    return (
        <SectionCard>
            <Stack className='gap-3'>
                <Title order={2} className='text-xl font-semibold'>
                    Dane przesyłki
                </Title>
                <Group>
                    <StatusBadge tone='info'>{order.deliveryMethod}</StatusBadge>
                </Group>
                <Divider />
                <Text className='text-xs text-dimmed'>Adres dostawy · zapisany w zamówieniu</Text>
                <Text className='text-sm font-semibold'>
                    {contact.firstName} {contact.lastName}
                </Text>
                <Text className='text-sm'>
                    {address.street} {address.houseNumber}
                    <br />
                    {address.postalCode} {address.city}, {address.country}
                </Text>
                <Text className='text-[13px] break-words text-dimmed'>
                    {contact.phone}
                    <br />
                    {contact.email}
                </Text>
            </Stack>
        </SectionCard>
    );
}

function OrderItemImage({ item }: { item: OrderItem }) {
    if (item.image) {
        return <img src={item.image} alt={item.name} className='size-16 rounded-lg object-cover' />;
    }

    return (
        <Center className='size-16 rounded-lg bg-placeholder'>
            <Package size={28} />
        </Center>
    );
}

function OrderItemRow({ item }: { item: OrderItem }) {
    return (
        <div className='grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4.5 gap-y-2 sm:grid-cols-[64px_minmax(0,1fr)_auto_122px]'>
            <OrderItemImage item={item} />
            <Stack className='min-w-0 gap-1'>
                <Text className='text-sm font-semibold'>{item.name}</Text>
                <Text className='text-xs text-dimmed'>{formatPrice(item.price)} / szt.</Text>
            </Stack>
            <Text className='text-[13px] text-dimmed'>{item.quantity} szt.</Text>
            <Text className='text-sm font-semibold'>{formatPrice(item.total)}</Text>
        </div>
    );
}

function OrderItemsCard({ items }: { items: OrderItem[] }) {
    return (
        <SectionCard>
            <Stack className='gap-4'>
                <Title order={2} className='text-xl font-semibold'>
                    Produkty w zamówieniu
                </Title>
                {items.map((item, index) => (
                    <Stack key={item.id} className='gap-3.5'>
                        <OrderItemRow item={item} />
                        {index < items.length - 1 && <Divider />}
                    </Stack>
                ))}
            </Stack>
        </SectionCard>
    );
}

function OrderSupportCard() {
    return (
        <SectionCard>
            <Group className='justify-between gap-4'>
                <Stack className='gap-1'>
                    <Text className='text-sm font-semibold'>
                        Potrzebujesz pomocy z zamówieniem?
                    </Text>
                    <Text className='text-[13px] text-dimmed'>
                        Jesteśmy dostępni {supportHours}.
                    </Text>
                </Stack>
                <Button
                    component='a'
                    href={`tel:${supportPhoneNumber}`}
                    variant='outline'
                    size='md'
                >
                    Skontaktuj się
                </Button>
            </Group>
        </SectionCard>
    );
}

function InvoiceDownloadButton() {
    return (
        <Tooltip
            label='Faktura nie jest jeszcze dostępna do pobrania.'
            multiline
            classNames={{ tooltip: 'w-65' }}
        >
            <span className='self-start'>
                <Button disabled variant='outline' size='md'>
                    Pobierz fakturę
                </Button>
            </span>
        </Tooltip>
    );
}

function OrderSummaryCard({ order }: { order: CustomerOrder }) {
    return (
        <SectionCard>
            <Stack className='gap-[17px]'>
                <Title order={2} className='text-lg font-semibold'>
                    Rozliczenie zamówienia
                </Title>
                <Stack className='gap-1'>
                    <Text className='text-sm text-dimmed'>
                        Produkty ({order.itemQuantity} szt.)
                    </Text>
                    <Text className='text-sm font-semibold'>{formatPrice(order.subtotal)}</Text>
                    <Group className='justify-between text-dimmed'>
                        <Text className='text-sm'>Dostawa · {order.deliveryMethod}</Text>
                        <Text className='text-sm'>{formatPrice(order.delivery)}</Text>
                    </Group>
                </Stack>
                <Stack className='gap-1 pt-5'>
                    <Text className='text-sm'>Łącznie z VAT</Text>
                    <Text className='text-[30px] leading-loose font-bold'>
                        {formatPrice(order.total)}
                    </Text>
                    <Text className='text-xs text-dimmed'>W tym VAT: {formatPrice(order.vat)}</Text>
                </Stack>
                <InvoiceDownloadButton />
            </Stack>
        </SectionCard>
    );
}

function OrderPaymentCard({ order }: { order: CustomerOrder }) {
    return (
        <SectionCard>
            <Stack className='gap-3'>
                <Group className='gap-2.5'>
                    <OrderStatusIcon status={order.status} />
                    <Title order={2} className='text-lg font-semibold'>
                        {orderStatuses[order.status].label}
                    </Title>
                </Group>
                <Text className='text-sm'>
                    {order.paymentMethod} · {formatPrice(order.total)}
                </Text>
                {order.transaction && (
                    <Text className='text-xs break-all text-dimmed'>
                        Numer transakcji: {order.transaction}
                    </Text>
                )}
                {order.paymentFailureReason && (
                    <Text className='text-xs text-(--mantine-color-red-8)'>
                        {order.paymentFailureReason}
                    </Text>
                )}
            </Stack>
        </SectionCard>
    );
}

type OrderDetailsProps = {
    order: CustomerOrder;
};

export function OrderDetails({ order }: OrderDetailsProps) {
    return (
        <Stack className='gap-7'>
            <OrderDetailsHeader order={order} />
            <OrderStatusBanner status={order.status} />
            <div className='grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_400px]'>
                <Stack className='min-w-0 gap-5'>
                    <div className='grid items-start gap-5 sm:grid-cols-2'>
                        <OrderTimeline events={order.events} />
                        <OrderShippingCard order={order} />
                    </div>
                    <OrderItemsCard items={order.items} />
                    <OrderSupportCard />
                </Stack>
                <Stack className='min-w-0 gap-5'>
                    <OrderSummaryCard order={order} />
                    <OrderPaymentCard order={order} />
                    <Button
                        component={Link}
                        to={appRoutes.orders}
                        variant='outline'
                        size='md'
                        className='self-start'
                    >
                        Wróć do zamówień
                    </Button>
                </Stack>
            </div>
        </Stack>
    );
}
