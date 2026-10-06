import { Anchor, Group, NumberInput, Stack, Text } from '@mantine/core';
import { CartItemImage } from '@/features/cart/components/CartItemImage';
import type { CartItem } from '@/features/cart/contexts/cart';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCartItemQuantity } from '@/features/cart/hooks/useCartItemQuantity';
import { formatPrice } from '@/lib/format';

type CartDrawerItemProps = {
    item: CartItem;
};

export function CartDrawerItem({ item }: CartDrawerItemProps) {
    const { removeItem } = useCart();
    const { quantity, changeQuantity, resetQuantity } = useCartItemQuantity(item);

    return (
        <Group className='flex-nowrap items-start gap-3.5'>
            <CartItemImage item={item} className='size-18' />
            <Stack className='min-w-0 flex-1 gap-2.5'>
                <Group className='flex-nowrap items-start justify-between gap-3'>
                    <Stack className='min-w-0 gap-0.5'>
                        <Text className='text-sm leading-normal font-semibold'>{item.name}</Text>
                        <Text className='text-xs leading-normal text-dimmed'>
                            {formatPrice(item.price)} / szt.
                        </Text>
                    </Stack>
                    <Text className='text-base font-bold whitespace-nowrap'>
                        {formatPrice(item.price * item.quantity)}
                    </Text>
                </Group>
                <Group className='justify-between'>
                    <NumberInput
                        aria-label='Ilość'
                        className='w-22'
                        min={1}
                        allowDecimal={false}
                        allowNegative={false}
                        value={quantity}
                        onChange={changeQuantity}
                        onBlur={resetQuantity}
                    />
                    <Anchor
                        component='button'
                        type='button'
                        className='text-xs'
                        onClick={() => removeItem(item.id)}
                    >
                        Usuń z koszyka
                    </Anchor>
                </Group>
            </Stack>
        </Group>
    );
}
