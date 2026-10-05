import { Group, Image, Paper, Stack, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import type { ProductDetails } from '@/features/products/hooks/useProductDetails';

type ProductGalleryProps = {
    product: ProductDetails;
};

export function ProductGallery({ product }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Stack className='w-full gap-4 lg:w-1/2'>
            <Paper className='h-[460px] rounded-xl p-7.5'>
                <Image
                    src={product.images[selectedIndex]}
                    alt={product.name}
                    className='h-full rounded-lg'
                />
            </Paper>
            <Group className='gap-3'>
                {product.images.map((image, index) => (
                    <UnstyledButton
                        key={image}
                        aria-label={`Zdjęcie ${index + 1}`}
                        aria-pressed={index === selectedIndex}
                        onClick={() => setSelectedIndex(index)}
                        className={`h-[86px] w-28 rounded-lg border bg-body p-1.5 ${
                            index === selectedIndex
                                ? 'border-anchor ring-1 ring-anchor'
                                : 'border-default-border'
                        }`}
                    >
                        <Image src={image} alt='' className='h-full rounded-lg' />
                    </UnstyledButton>
                ))}
            </Group>
        </Stack>
    );
}
