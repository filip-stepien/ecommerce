import {
    Alert,
    Anchor,
    Breadcrumbs,
    Button,
    Center,
    Divider,
    Group,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core';
import { Check, Package, Clock, CircleAlert } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { AccountCard } from '@/features/account/components/AccountCard';
import { StatusBadge } from '@/features/account/components/StatusBadge';
import { useCustomerOrder } from '@/features/orders/useCustomerOrders';
import { orderStatuses } from '@/features/orders/model';
import { Spinner } from '@/components/Spinner';
import { formatDate, formatPrice, pluralize } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

export function OrderDetailsPage() {
    const { number } = useParams();
    const { order, isLoading, error, notFound } = useCustomerOrder(number);
    if (isLoading) return <Spinner />;
    if (error && !notFound)
        return (
            <Alert color='red' title='Nie udało się pobrać zamówienia'>
                {error.message}
            </Alert>
        );
    if (!order)
        return (
            <AccountCard>
                <Stack align='start'>
                    <Title order={1}>Nie znaleziono zamówienia</Title>
                    <Text c='dimmed'>Sprawdź numer zamówienia lub wróć do historii zakupów.</Text>
                    <Button component={Link} to={appRoutes.orders}>
                        Wróć do zamówień
                    </Button>
                </Stack>
            </AccountCard>
        );
    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = order.subtotal;
    const status = orderStatuses[order.status];
    return (
        <Stack className='gap-7'>
            <Stack className='gap-2'>
                <Breadcrumbs
                    separatorMargin={4}
                    classNames={{ root: 'flex-wrap text-xs text-dimmed', separator: 'text-dimmed' }}
                >
                    <Anchor component={Link} to={appRoutes.home} c='dimmed' size='xs'>
                        Strona główna
                    </Anchor>
                    <Anchor component={Link} to={appRoutes.account} c='dimmed' size='xs'>
                        Moje konto
                    </Anchor>
                    <Anchor component={Link} to={appRoutes.orders} c='dimmed' size='xs'>
                        Zamówienia
                    </Anchor>
                    <Text size='xs' c='dimmed'>
                        {order.number}
                    </Text>
                </Breadcrumbs>
                <Title order={1} className='text-2xl break-words sm:text-[32px]'>
                    Zamówienie #{order.number}
                </Title>
                <Text size='sm' c='dimmed'>
                    Złożono {formatDate(order.date)} o {order.time} ·{' '}
                    {pluralize(order.items.length, {
                        one: 'produkt',
                        few: 'produkty',
                        many: 'produktów'
                    })}
                    , {pluralize(quantity, { one: 'sztuka', few: 'sztuki', many: 'sztuk' })}
                </Text>
            </Stack>
            <Group className='gap-5 rounded-xl bg-(--mantine-color-blue-0) p-6 dark:bg-(--mantine-color-dark-6)'>
                <Center className='size-14 shrink-0 rounded-xl bg-white'>
                    {order.status === 'paid' ? (
                        <img src='/orders/circle-check.svg' alt='' />
                    ) : order.status === 'paymentFailed' ? (
                        <CircleAlert className='text-(--mantine-color-red-8)' />
                    ) : (
                        <Clock className='text-(--mantine-color-blue-8)' />
                    )}
                </Center>
                <Stack className='min-w-0 flex-1 gap-1'>
                    <Title
                        order={2}
                        className='text-xl leading-normal font-semibold sm:text-[23px]'
                    >
                        {status.title}
                    </Title>
                    <Text size='sm' c='dimmed'>
                        {status.description}
                    </Text>
                </Stack>
            </Group>
            <div className='grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_400px]'>
                <Stack className='min-w-0 gap-5'>
                    <div className='grid items-start gap-5 sm:grid-cols-2'>
                        <AccountCard>
                            <Stack className='gap-5'>
                                <Title order={2} className='text-xl font-semibold'>
                                    Historia zamówienia
                                </Title>
                                <ol>
                                    {order.events.map((event, index) => (
                                        <li key={event.label} className='flex gap-3.5'>
                                            <div className='flex w-[22px] shrink-0 flex-col items-center'>
                                                <Center
                                                    className={`size-[22px] shrink-0 rounded-full ${event.complete ? 'bg-(--mantine-color-blue-8) text-white' : 'bg-(--mantine-color-gray-1) text-dimmed'}`}
                                                >
                                                    {event.complete ? (
                                                        <Check size={12} aria-label='Ukończono' />
                                                    ) : (
                                                        <span>·</span>
                                                    )}
                                                </Center>
                                                {index < order.events.length - 1 && (
                                                    <div
                                                        className={`min-h-[34px] w-0.5 flex-1 ${order.events[index + 1].complete ? 'bg-(--mantine-color-blue-8)' : 'bg-default-border'}`}
                                                    />
                                                )}
                                            </div>
                                            <Stack className='gap-0.5 pb-[15px]'>
                                                <Text
                                                    size='sm'
                                                    fw={600}
                                                    c={event.complete ? undefined : 'dimmed'}
                                                >
                                                    {event.label}
                                                </Text>
                                                <Text size='xs' c='dimmed'>
                                                    {event.date}
                                                </Text>
                                            </Stack>
                                        </li>
                                    ))}
                                </ol>
                            </Stack>
                        </AccountCard>
                        <AccountCard>
                            <Stack className='gap-3'>
                                <Title order={2} className='text-xl font-semibold'>
                                    Dane przesyłki
                                </Title>
                                <Group>
                                    <StatusBadge tone='info'>{order.deliveryMethod}</StatusBadge>
                                </Group>
                                <Divider />
                                <Text size='xs' c='dimmed'>
                                    Adres dostawy · zapisany w zamówieniu
                                </Text>
                                <Text size='sm' fw={600}>
                                    {order.contact.firstName} {order.contact.lastName}
                                </Text>
                                <Text size='sm'>
                                    {order.address.street} {order.address.houseNumber}
                                    <br />
                                    {order.address.postalCode} {order.address.city},{' '}
                                    {order.address.country}
                                </Text>
                                <Text size='13px' c='dimmed' className='break-words'>
                                    {order.contact.phone}
                                    <br />
                                    {order.contact.email}
                                </Text>
                            </Stack>
                        </AccountCard>
                    </div>
                    <AccountCard>
                        <Stack className='gap-4'>
                            <Title order={2} className='text-xl font-semibold'>
                                Produkty w zamówieniu
                            </Title>
                            {order.items.map((item, index) => (
                                <Stack key={item.id} className='gap-3.5'>
                                    <div className='grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4.5 gap-y-2 sm:grid-cols-[64px_minmax(0,1fr)_auto_122px]'>
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='size-16 rounded-lg object-cover'
                                            />
                                        ) : (
                                            <Center className='size-16 rounded-lg bg-placeholder'>
                                                <Package size={28} />
                                            </Center>
                                        )}
                                        <Stack className='min-w-0 gap-1'>
                                            <Text size='sm' fw={600}>
                                                {item.name}
                                            </Text>
                                            <Text size='xs' c='dimmed'>
                                                {formatPrice(item.price)} / szt.
                                            </Text>
                                        </Stack>
                                        <Text size='13px' c='dimmed'>
                                            {item.quantity} szt.
                                        </Text>
                                        <Text size='sm' fw={600}>
                                            {formatPrice(item.total)}
                                        </Text>
                                    </div>
                                    {index < order.items.length - 1 && <Divider />}
                                </Stack>
                            ))}
                        </Stack>
                    </AccountCard>
                    <AccountCard>
                        <Group justify='space-between' className='gap-4'>
                            <Stack className='gap-1'>
                                <Text size='sm' fw={600}>
                                    Potrzebujesz pomocy z zamówieniem?
                                </Text>
                                <Text size='13px' c='dimmed'>
                                    Jesteśmy dostępni od poniedziałku do piątku, 8:00–18:00.
                                </Text>
                            </Stack>
                            <Button component='a' href='tel:800100200' variant='outline' size='md'>
                                Skontaktuj się
                            </Button>
                        </Group>
                    </AccountCard>
                </Stack>
                <Stack className='min-w-0 gap-5'>
                    <AccountCard>
                        <Stack className='gap-[17px]'>
                            <Title order={2} className='text-lg font-semibold'>
                                Rozliczenie zamówienia
                            </Title>
                            <Stack className='gap-1'>
                                <Text size='sm' c='dimmed'>
                                    Produkty ({quantity} szt.)
                                </Text>
                                <Text size='sm' fw={600}>
                                    {formatPrice(subtotal)}
                                </Text>
                                <Group justify='space-between' c='dimmed'>
                                    <Text size='sm'>Dostawa · {order.deliveryMethod}</Text>
                                    <Text size='sm'>{formatPrice(order.delivery)}</Text>
                                </Group>
                            </Stack>
                            <Stack className='gap-1 pt-5'>
                                <Text size='sm'>Łącznie z VAT</Text>
                                <Text className='text-[30px] leading-loose font-bold'>
                                    {formatPrice(order.total)}
                                </Text>
                                <Text size='xs' c='dimmed'>
                                    W tym VAT: {formatPrice(order.vat)}
                                </Text>
                            </Stack>
                            <Tooltip
                                label='Faktura nie jest jeszcze dostępna do pobrania.'
                                multiline
                                w={260}
                            >
                                <span className='self-start' tabIndex={0}>
                                    <Button disabled variant='outline' size='md'>
                                        Pobierz fakturę
                                    </Button>
                                </span>
                            </Tooltip>
                        </Stack>
                    </AccountCard>
                    <AccountCard>
                        <Stack className='gap-3'>
                            <Group className='gap-2.5'>
                                {order.status === 'paid' ? (
                                    <img src='/orders/circle-check.svg' alt='' />
                                ) : (
                                    <CircleAlert size={20} />
                                )}
                                <Title order={2} className='text-lg font-semibold'>
                                    {status.label}
                                </Title>
                            </Group>
                            <Text size='sm'>
                                {order.paymentMethod} · {formatPrice(order.total)}
                            </Text>
                            {order.transaction && (
                                <Text size='xs' c='dimmed' className='break-all'>
                                    Numer transakcji: {order.transaction}
                                </Text>
                            )}
                            {order.paymentFailureReason && (
                                <Text size='xs' c='red.8'>
                                    {order.paymentFailureReason}
                                </Text>
                            )}
                        </Stack>
                    </AccountCard>
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
