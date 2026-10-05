import { useDebouncedValue, useSetState } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { useCatalogSearchParams } from './useCatalogSearchParams';
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

type LocalProductFilters = Omit<ProductFilters, 'search' | 'category'>;

type LocalProductQuery = Omit<ProductQuery, 'filters'> & { filters: LocalProductFilters };

const emptyLocalProductFilters: LocalProductFilters = {
    connectivity: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    onlyAvailable: false
};

const initialLocalProductQuery: LocalProductQuery = {
    filters: emptyLocalProductFilters,
    sort: 'default',
    page: 1,
    pageSize: catalogPageSizeOptions[0]
};

export function useProductCatalog(): UseProductCatalogResult {
    const { search, category, setCatalogSearchParams } = useCatalogSearchParams();
    const [localQuery, setLocalQuery] = useSetState(initialLocalProductQuery);

    const [previousSearchParams, setPreviousSearchParams] = useState({ search, category });
    if (previousSearchParams.search !== search || previousSearchParams.category !== category) {
        setPreviousSearchParams({ search, category });
        setLocalQuery({ page: 1 });
    }

    const query = useMemo<ProductQuery>(
        () => ({ ...localQuery, filters: { ...localQuery.filters, search, category } }),
        [localQuery, search, category]
    );
    const [debouncedQuery] = useDebouncedValue(query, debounceMs);
    const products = useProducts(debouncedQuery);

    return {
        ...products,
        query,
        setFilters: ({ search, category, ...patch }) => {
            if (search !== undefined || category !== undefined) {
                setCatalogSearchParams({
                    ...(search !== undefined && { search }),
                    ...(category !== undefined && { category })
                });
            }
            setLocalQuery(current => ({ filters: { ...current.filters, ...patch }, page: 1 }));
        },
        clearFilters: () => {
            setCatalogSearchParams({ search: '', category: null });
            setLocalQuery({ filters: emptyLocalProductFilters, page: 1 });
        },
        setSort: sort => setLocalQuery({ sort, page: 1 }),
        setPage: page => setLocalQuery({ page }),
        setPageSize: pageSize => setLocalQuery({ pageSize, page: 1 })
    };
}
