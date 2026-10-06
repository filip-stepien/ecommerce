import { useContext } from 'react';
import { CartContext, type CartContextValue } from '@/features/cart/contexts/cart';

export function useCart(): CartContextValue {
    const cart = useContext(CartContext);

    if (!cart) throw new Error('useCart must be used within CartProvider.');

    return cart;
}
