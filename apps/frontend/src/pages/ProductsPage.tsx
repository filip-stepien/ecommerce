import { Box, Flex, Stack, Text, Title } from '@mantine/core';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { RecommendedProductsCarousel } from '@/features/products/components/RecommendedProductsCarousel';
import { useProductCatalog } from '@/features/products/hooks/useProductCatalog';

export function ProductsPage() {
    const catalog = useProductCatalog();

    return (
        <Stack className='gap-7'>
            <Stack className='gap-2'>
                <Title order={1} className='text-[32px]'>
                    Wszystkie produkty
                </Title>
                <Text className='text-sm text-dimmed'>Przeglądaj produkty dostępne w sklepie.</Text>
            </Stack>
            <Flex className='flex-col items-start gap-7 md:flex-row'>
                <ProductFilters
                    values={catalog.query.filters}
                    onChange={catalog.setFilters}
                    onClear={catalog.clearFilters}
                />
                <Box className='w-full min-w-0 flex-1 md:w-auto'>
                    <ProductGrid catalog={catalog} />
                </Box>
            </Flex>
            <RecommendedProductsCarousel />
        </Stack>
    );
}
