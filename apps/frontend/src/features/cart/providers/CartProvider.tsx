import type { PropsWithChildren } from 'react';
import { CartContext } from '@/features/cart/contexts/cart';
import { useCartState } from '@/features/cart/hooks/useCartState';

export function CartProvider({ children }: PropsWithChildren) {
    const value = useCartState();

    return <CartContext value={value}>{children}</CartContext>;
}
