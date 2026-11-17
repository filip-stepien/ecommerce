import { Button, Center, Image, Paper, Stack, Text, UnstyledButton } from '@mantine/core';
import { Package } from 'lucide-react';
import { Link, generatePath } from 'react-router';
import type { Product } from '@/api/generated/model';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

type ChatProductCardProps = {
    product: Product;
};

export function ChatProductCard({ product }: ChatProductCardProps) {
    const { addItem } = useCart();

    return (
        <Paper withBorder className='flex items-center gap-3 rounded-lg p-2.5'>
            <UnstyledButton
                component={Link}
                to={generatePath(appRoutes.product, { id: String(product.id) })}
                className='flex min-w-0 flex-1 items-center gap-3'
            >
                {product.imageUrl ? (
                    <Image src={product.imageUrl} alt='' className='size-14 shrink-0 rounded-md' />
                ) : (
                    <Center className='size-14 shrink-0 rounded-md bg-placeholder'>
                        <Package size={22} strokeWidth={1.25} className='text-dimmed' />
                    </Center>
                )}
                <Stack className='min-w-0 gap-0.5'>
                    <Text className='line-clamp-2 text-sm leading-snug font-semibold'>
                        {product.name}
                    </Text>
                    <Text className='text-sm font-bold'>{formatPrice(product.price)}</Text>
                </Stack>
            </UnstyledButton>
            <Button
                size='compact-sm'
                variant='light'
                className='shrink-0'
                aria-label={`Dodaj do koszyka: ${product.name}`}
                onClick={() => addItem(product, { image: product.imageUrl ?? null })}
            >
                Dodaj do koszyka
            </Button>
        </Paper>
    );
}
