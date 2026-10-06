import { useState } from 'react';
import type { CartItem } from '@/features/cart/contexts/cart';
import { useCart } from '@/features/cart/hooks/useCart';

export type UseCartItemQuantityResult = {
    quantity: number | string;
    changeQuantity: (value: number | string) => void;
    resetQuantity: () => void;
};

export function useCartItemQuantity(item: CartItem): UseCartItemQuantityResult {
    const { setQuantity } = useCart();
    const [quantity, setQuantityInput] = useState<number | string>(item.quantity);

    function changeQuantity(value: number | string) {
        setQuantityInput(value);

        if (typeof value === 'number' && value >= 1) setQuantity(item.id, value);
    }

    return {
        quantity,
        changeQuantity,
        resetQuantity: () => setQuantityInput(item.quantity)
    };
}
