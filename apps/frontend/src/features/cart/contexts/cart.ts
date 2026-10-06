import { createContext } from 'react';
import type { Product } from '@/api/generated/model';

export type CartItem = Product & {
    image: string | null;
    quantity: number;
};

export type AddCartItemOptions = {
    quantity?: number;
    image?: string | null;
};

export type CartContextValue = {
    items: CartItem[];
    itemCount: number;
    total: number;
    isOpen: boolean;
    open: () => void;
    close: () => void;
    addItem: (product: Product, options?: AddCartItemOptions) => void;
    setQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clear: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
