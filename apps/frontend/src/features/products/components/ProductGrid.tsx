import { Box, Group, SimpleGrid, Text } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { QueryResult } from '@/components/QueryResult';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductCardSkeleton } from '@/features/products/components/ProductCardSkeleton';
import { ProductCount } from '@/features/products/components/ProductCount';
import { ProductPagination } from '@/features/products/components/ProductPagination';
import { ProductSortSelect } from '@/features/products/components/ProductSortSelect';
import type { UseProductCatalogResult } from '@/features/products/hooks/useProductCatalog';

type ProductGridProps = {
    catalog: UseProductCatalogResult;
};

function CardGrid({ children }: PropsWithChildren) {
    return (
        <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {children}
        </SimpleGrid>
    );
}

export function ProductGrid({ catalog }: ProductGridProps) {
    const { products, total, isLoading, error, query } = catalog;

    return (
        <>
            <Group className='justify-between'>
                {isLoading ? <Box /> : <ProductCount count={total} />}
                <ProductSortSelect
                    value={query.sort}
                    onChange={catalog.setSort}
                    disabled={isLoading}
                />
            </Group>
            <QueryResult
                data={products}
                isLoading={isLoading}
                error={error}
                errorText='Nie udało się pobrać produktów'
                loader={
                    <CardGrid>
                        {Array.from({ length: query.pageSize }, (_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </CardGrid>
                }
            >
                {products =>
                    products.length === 0 ? (
                        <Text className='text-dimmed'>
                            Brak produktów spełniających wybrane kryteria.
                        </Text>
                    ) : (
                        <CardGrid>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </CardGrid>
                    )
                }
            </QueryResult>
            <ProductPagination
                total={total}
                page={query.page}
                pageSize={query.pageSize}
                onPageChange={catalog.setPage}
                onPageSizeChange={catalog.setPageSize}
                disabled={isLoading}
            />
        </>
    );
}
