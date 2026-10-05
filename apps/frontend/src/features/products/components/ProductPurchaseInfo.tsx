import { Button, Divider, Group, NumberInput, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import type { ProductDetails } from '@/features/products/hooks/useProductDetails';
import { formatPrice } from '@/lib/format';

type ProductPurchaseInfoProps = {
    product: ProductDetails;
};

export function ProductPurchaseInfo({ product }: ProductPurchaseInfoProps) {
    const [quantity, setQuantity] = useState<number>(1);

    return (
        <Stack className='min-w-0 flex-1 gap-4.5'>
            <Stack className='gap-1.5'>
                <Title order={1} className='text-[34px] leading-[1.2]'>
                    {product.name}
                </Title>
                <Text className='text-[17px] text-dimmed'>{product.subtitle}</Text>
            </Stack>
            <Divider />
            <Stack className='gap-1'>
                <Text className='text-4xl font-bold'>{formatPrice(product.price)}</Text>
                <Text className='text-xs text-dimmed'>Cena zawiera VAT</Text>
            </Stack>
            <Group className='gap-3.5'>
                <NumberInput
                    aria-label='Ilość'
                    className='w-22'
                    min={1}
                    value={quantity}
                    onChange={value => setQuantity(Number(value))}
                />
                <Button size='md'>Dodaj do koszyka</Button>
            </Group>
        </Stack>
    );
}
