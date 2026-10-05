import { Group, SimpleGrid, Text } from '@mantine/core';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductCount } from '@/features/products/components/ProductCount';
import { ProductPagination } from '@/features/products/components/ProductPagination';
import { ProductSortSelect } from '@/features/products/components/ProductSortSelect';
import type { UseProductCatalogResult } from '@/features/products/hooks/useProductCatalog';

type ProductGridProps = {
    catalog: UseProductCatalogResult;
};

export function ProductGrid({ catalog }: ProductGridProps) {
    const { products, total, query } = catalog;

    return (
        <>
            <Group className='justify-between'>
                <ProductCount count={total} />
                <ProductSortSelect value={query.sort} onChange={catalog.setSort} />
            </Group>
            {total === 0 ? (
                <Text className='text-dimmed'>Brak produktów spełniających wybrane kryteria.</Text>
            ) : (
                <>
                    <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </SimpleGrid>
                    <ProductPagination
                        total={total}
                        page={query.page}
                        pageSize={query.pageSize}
                        onPageChange={catalog.setPage}
                        onPageSizeChange={catalog.setPageSize}
                    />
                </>
            )}
        </>
    );
}
