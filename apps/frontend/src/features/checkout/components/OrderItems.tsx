import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { CartItemImage } from '@/features/cart/components/CartItemImage';
import type { CartItem } from '@/features/cart/contexts/cart';
import { formatPrice } from '@/lib/format';

type OrderItemsProps = {
    items: CartItem[];
};

export function OrderItems({ items }: OrderItemsProps) {
    return (
        <Paper withBorder className='rounded-xl p-6'>
            <Stack className='gap-3.5'>
                <Title order={2} className='text-lg leading-normal font-semibold'>
                    Twoje produkty
                </Title>
                {items.map(item => (
                    <OrderItem key={item.id} item={item} />
                ))}
            </Stack>
        </Paper>
    );
}

type OrderItemProps = {
    item: CartItem;
};

function OrderItem({ item }: OrderItemProps) {
    return (
        <Group className='flex-nowrap gap-3'>
            <CartItemImage item={item} className='size-13' />
            <Stack className='min-w-0 flex-1 gap-0.5'>
                <Text className='text-[13px] leading-normal font-semibold'>{item.name}</Text>
                <Text className='text-xs leading-normal text-dimmed'>
                    {item.quantity} × {formatPrice(item.price)}
                </Text>
            </Stack>
        </Group>
    );
}
