import type { CustomerOrder, PlaceOrderResponse } from '@/api/generated/model';
import type { OrderDraft } from '@/features/checkout/hooks/usePlaceOrder';

const storageKey = 'volt-debug-orders-v1';

export function readDebugOrders(): CustomerOrder[] {
    const stored = sessionStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as CustomerOrder[]) : [];
}

export async function placeDebugOrder({
    items,
    details,
    options
}: OrderDraft): Promise<PlaceOrderResponse> {
    const delivery = options.deliveryMethods.find(method => method.id === details.deliveryMethod);
    if (!delivery) throw new Error('Wybierz dostępną metodę dostawy.');
    const orders = readDebugOrders();
    const id = Math.max(Date.now(), (orders[0]?.id ?? 0) + 1);
    const itemsTotal =
        Math.round(items.reduce((sum, item) => sum + item.quantity * item.price, 0) * 100) / 100;
    const total = Math.round((itemsTotal + delivery.price) * 100) / 100;
    const order: CustomerOrder = {
        id,
        status: 'PAID',
        createdAt: new Date().toISOString(),
        contact: details.contact,
        deliveryAddress: details.address,
        invoice: details.isInvoiceSameAsDelivery ? undefined : details.invoice,
        items: items.map(item => ({
            productId: item.id,
            name: item.name,
            image: item.image ?? undefined,
            quantity: item.quantity,
            unitPrice: item.price,
            lineTotal: Math.round(item.quantity * item.price * 100) / 100
        })),
        deliveryMethod: delivery.id,
        deliveryPrice: delivery.price,
        paymentMethod: details.paymentMethod as CustomerOrder['paymentMethod'],
        paymentId: `demo-${id}`,
        itemsTotal,
        total,
        vatAmount: Math.round(((total * options.vatRate) / (1 + options.vatRate)) * 100) / 100,
        currency: 'PLN'
    };
    sessionStorage.setItem(storageKey, JSON.stringify([order, ...orders]));
    return { orderId: id, status: order.status, total, currency: order.currency };
}
