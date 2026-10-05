import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import type { ProductDetails } from '@/features/products/hooks/useProductDetails';

type ProductDescriptionProps = {
    product: ProductDetails;
};

export function ProductDescription({ product }: ProductDescriptionProps) {
    return (
        <Paper withBorder className='rounded-xl p-6'>
            <Stack className='gap-8'>
                <Stack className='gap-4'>
                    <Title order={2} className='text-[22px]'>
                        Opis
                    </Title>
                    <Text className='text-sm leading-relaxed text-dimmed'>
                        {product.description}
                    </Text>
                </Stack>
                <Stack className='gap-4'>
                    <Title order={2} className='text-[22px]'>
                        Specyfikacja
                    </Title>
                    <Stack className='gap-2.5'>
                        {product.specifications.map(specification => (
                            <Group
                                key={specification.name}
                                className='flex-nowrap items-start gap-4'
                            >
                                <Text className='w-40 shrink-0 text-sm text-dimmed'>
                                    {specification.name}
                                </Text>
                                <Text className='text-sm font-semibold'>{specification.value}</Text>
                            </Group>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
}
