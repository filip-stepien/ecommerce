import { useDebouncedValue, useSetState } from '@mantine/hooks';
import {
    type ProductFilters,
    type ProductQuery,
    type ProductSort,
    type UseProductsResult,
    useProducts
} from './useProducts';

export type UseProductCatalogResult = UseProductsResult & {
    query: ProductQuery;
    setFilters: (patch: Partial<ProductFilters>) => void;
    clearFilters: () => void;
    setSort: (sort: ProductSort) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
};

export const catalogPageSizeOptions = [6, 12, 24];

const debounceMs = 300;

const emptyProductFilters: ProductFilters = {
    search: '',
    category: null,
    connectivity: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    onlyAvailable: false
};

const initialProductQuery: ProductQuery = {
    filters: emptyProductFilters,
    sort: 'default',
    page: 1,
    pageSize: catalogPageSizeOptions[0]
};

export function useProductCatalog(): UseProductCatalogResult {
    const [query, setQuery] = useSetState(initialProductQuery);
    const [debouncedQuery] = useDebouncedValue(query, debounceMs);
    const products = useProducts(debouncedQuery);

    return {
        ...products,
        query,
        setFilters: patch =>
            setQuery(current => ({ filters: { ...current.filters, ...patch }, page: 1 })),
        clearFilters: () => setQuery({ filters: emptyProductFilters, page: 1 }),
        setSort: sort => setQuery({ sort, page: 1 }),
        setPage: page => setQuery({ page }),
        setPageSize: pageSize => setQuery({ pageSize, page: 1 })
    };
}
