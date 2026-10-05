import { Button, Center, Paper, Stack, Text, UnstyledButton } from '@mantine/core';
import { Package } from 'lucide-react';
import { Link, generatePath } from 'react-router';
import type { Product } from '@/api/generated/model';
import { formatPrice } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Paper withBorder shadow='xs' className='rounded-lg p-[23px]'>
            <Stack className='gap-[17px]'>
                <UnstyledButton
                    component={Link}
                    to={generatePath(appRoutes.product, { id: String(product.id) })}
                    className='flex flex-col gap-[17px]'
                >
                    <Center className='h-[173px] rounded-[5px] bg-placeholder'>
                        <Package size={48} strokeWidth={1.25} className='text-dimmed' />
                    </Center>
                    <Text className='text-lg leading-[1.55] font-semibold'>{product.name}</Text>
                </UnstyledButton>
                <Text className='text-[22px] leading-[1.6] font-bold'>
                    {formatPrice(product.price)}
                </Text>
                <Button size='md' className='self-start'>
                    Dodaj do koszyka
                </Button>
            </Stack>
        </Paper>
    );
}
