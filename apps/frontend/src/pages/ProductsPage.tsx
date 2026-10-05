import { Flex, Stack, Text, Title } from '@mantine/core';
import { QueryResult } from '@/components/QueryResult';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductSearch } from '@/features/products/components/ProductSearch';
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
                <Stack className='w-full min-w-0 flex-1 gap-5 md:w-auto'>
                    <ProductSearch
                        value={catalog.query.filters.search}
                        onChange={search => catalog.setFilters({ search })}
                    />
                    <QueryResult
                        data={catalog.products}
                        isLoading={catalog.isLoading}
                        error={catalog.error}
                        errorText='Nie udało się pobrać produktów'
                    >
                        {() => <ProductGrid catalog={catalog} />}
                    </QueryResult>
                </Stack>
            </Flex>
        </Stack>
    );
}
