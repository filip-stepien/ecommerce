import type { CustomerOrder as ApiCustomerOrder } from '@/api/generated/model';
import { formatDate } from '@/lib/format';

export type OrderStatus = 'pendingPayment' | 'paid' | 'paymentFailed';
export type CustomerOrder = {
    number: string;
    date: string;
    time: string;
    firstItemName: string;
    otherItemCount: number;
    status: OrderStatus;
    total: number;
    subtotal: number;
    items: {
        id: number;
        name: string;
        image?: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    events: { label: string; date: string; complete: boolean }[];
    delivery: number;
    deliveryMethod: string;
    vat: number;
    paymentMethod: string;
    transaction?: string;
    paymentFailureReason?: string;
    contact: ApiCustomerOrder['contact'];
    address: ApiCustomerOrder['deliveryAddress'];
};

export const orderStatuses: Record<
    OrderStatus,
    { label: string; tone: 'info' | 'success' | 'error'; title: string; description: string }
> = {
    pendingPayment: {
        label: 'Oczekuje na płatność',
        tone: 'info',
        title: 'Zamówienie oczekuje na płatność',
        description: 'Zamówienie zostało zapisane. Oczekujemy na potwierdzenie płatności.'
    },
    paid: {
        label: 'Opłacono',
        tone: 'success',
        title: 'Dziękujemy za Twoje zamówienie',
        description:
            'Płatność została potwierdzona. Zamówienie oczekuje na przygotowanie do odbioru lub wysyłki.'
    },
    paymentFailed: {
        label: 'Płatność odrzucona',
        tone: 'error',
        title: 'Płatność nie powiodła się',
        description:
            'Zamówienie zostało zapisane, ale płatność została odrzucona. Skontaktuj się z nami, jeśli potrzebujesz pomocy.'
    }
};

export function toCustomerOrder(order: ApiCustomerOrder): CustomerOrder {
    const status: OrderStatus =
        order.status === 'PAID'
            ? 'paid'
            : order.status === 'PAYMENT_FAILED'
              ? 'paymentFailed'
              : 'pendingPayment';
    const time = new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(order.createdAt)
    );
    return {
        number: String(order.id),
        date: order.createdAt,
        time,
        status,
        firstItemName: order.items[0]?.name ?? 'Zamówienie',
        otherItemCount: Math.max(0, order.items.reduce((sum, item) => sum + item.quantity, 0) - 1),
        total: order.total,
        subtotal: order.itemsTotal,
        items: order.items.map(item => ({
            id: item.productId,
            name: item.name,
            image: item.image ?? undefined,
            quantity: item.quantity,
            price: item.unitPrice,
            total: item.lineTotal
        })),
        events: [
            {
                label: 'Zamówienie przyjęte',
                date: `${formatDate(order.createdAt)} · ${time}`,
                complete: true
            },
            {
                label: orderStatuses[status].label,
                date: 'Aktualny status płatności',
                complete: status !== 'pendingPayment'
            }
        ],
        delivery: order.deliveryPrice,
        deliveryMethod:
            order.deliveryMethod === 'courier'
                ? 'Kurier'
                : order.deliveryMethod === 'pickup'
                  ? 'Odbiór osobisty'
                  : order.deliveryMethod,
        vat: order.vatAmount,
        paymentMethod: order.paymentMethod === 'blik' ? 'BLIK' : 'Karta płatnicza',
        transaction: order.paymentId ?? undefined,
        paymentFailureReason: order.paymentFailureReason ?? undefined,
        contact: order.contact,
        address: order.deliveryAddress
    };
}
