import { Button, Center, Paper, Stack, Text } from '@mantine/core';
import { Package } from 'lucide-react';
import type { Product } from '@/api/generated/model';
import { formatPrice } from '@/lib/format';

type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Paper withBorder shadow='xs' className='rounded-lg p-4'>
            <Stack className='gap-3'>
                <Center className='h-[173px] rounded-[5px] bg-placeholder'>
                    <Package size={48} strokeWidth={1.25} className='text-dimmed' />
                </Center>
                <Text className='text-lg leading-tight font-semibold'>{product.name}</Text>
                <Text className='text-[22px] leading-tight font-bold'>
                    {formatPrice(product.price)}
                </Text>
                <Button size='md' className='w-full'>
                    Dodaj do koszyka
                </Button>
            </Stack>
        </Paper>
    );
}
