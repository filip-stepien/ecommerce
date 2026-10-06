import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import type { Product } from '@/api/generated/model';
import type { AddCartItemOptions, CartContextValue, CartItem } from '@/features/cart/contexts/cart';

export function useCartState(): CartContextValue {
    const [items, setItems] = useLocalStorage<CartItem[]>({
        key: 'ecommerce-cart',
        defaultValue: [],
        getInitialValueInEffect: false
    });
    const [isOpen, { open, close }] = useDisclosure(false);

    function addItem(product: Product, { quantity = 1, image = null }: AddCartItemOptions = {}) {
        const existing = items.find(item => item.id === product.id);

        if (existing) {
            setQuantity(existing.id, existing.quantity + quantity);
            return;
        }

        const { id, name, price } = product;
        setItems(current => [...current, { id, name, price, image, quantity }]);
    }

    function setQuantity(id: number, quantity: number) {
        setItems(current => current.map(item => (item.id === id ? { ...item, quantity } : item)));
    }

    function removeItem(id: number) {
        setItems(current => current.filter(item => item.id !== id));
    }

    return {
        items,
        itemCount: items.reduce((count, item) => count + item.quantity, 0),
        total: items.reduce((total, item) => total + item.price * item.quantity, 0),
        isOpen,
        open,
        close,
        addItem,
        setQuantity,
        removeItem,
        clear: () => setItems([])
    };
}
