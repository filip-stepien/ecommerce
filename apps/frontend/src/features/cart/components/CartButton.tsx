import { Indicator, Text, UnstyledButton } from '@mantine/core';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';

export function CartButton() {
    const { itemCount, open } = useCart();

    return (
        <UnstyledButton className='flex items-center gap-2' onClick={open}>
            <Indicator label={itemCount} size={16} disabled={itemCount === 0}>
                <ShoppingBag size={20} />
            </Indicator>
            <Text className='text-sm font-semibold'>Koszyk</Text>
        </UnstyledButton>
    );
}
