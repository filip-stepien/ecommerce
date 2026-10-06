import { Center, Image } from '@mantine/core';
import { Package } from 'lucide-react';
import type { CartItem } from '@/features/cart/contexts/cart';

type CartItemImageProps = {
    item: CartItem;
    className: string;
};

export function CartItemImage({ item, className }: CartItemImageProps) {
    if (item.image) {
        return <Image src={item.image} alt='' className={`shrink-0 rounded-lg ${className}`} />;
    }

    return (
        <Center className={`shrink-0 rounded-lg bg-placeholder ${className}`}>
            <Package size={24} strokeWidth={1.25} className='text-dimmed' />
        </Center>
    );
}
