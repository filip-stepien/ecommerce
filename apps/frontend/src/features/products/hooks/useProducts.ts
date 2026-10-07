import { type RequestError, toRequestError } from '@/api/error';
import { useGetProducts } from '@/api/generated';
import type { GetProductsParams, Product } from '@/api/generated/model';
import { debug_useQuery } from '@/hooks/debug_useQuery';
import { env } from '@/lib/env';

export type ProductFilters = {
    search: string;
    category: string | null;
    connectivity: string | null;
    brand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    onlyAvailable: boolean;
};

export type ProductSort = 'default' | 'priceAsc' | 'priceDesc' | 'nameAsc';

export type ProductQuery = {
    filters: ProductFilters;
    sort: ProductSort;
    page: number;
    pageSize: number;
};

export type UseProductsResult = {
    products: Product[];
    total: number;
    isLoading: boolean;
    error: RequestError | null;
};

function toProductsParams({ filters, sort, page, pageSize }: ProductQuery): GetProductsParams {
    return {
        search: filters.search.trim() || undefined,
        category: filters.category ?? undefined,
        connectivity: filters.connectivity ?? undefined,
        brand: filters.brand ?? undefined,
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined,
        onlyAvailable: filters.onlyAvailable || undefined,
        sort,
        page,
        pageSize
    };
}

function useApiProducts(query: ProductQuery): UseProductsResult {
    const { data, isLoading, error } = useGetProducts(toProductsParams(query));

    return {
        products: data?.products ?? [],
        total: data?.total ?? 0,
        isLoading,
        error: toRequestError(error)
    };
}

function debug_filterProducts(products: Product[], filters: ProductFilters): Product[] {
    const search = filters.search.trim().toLocaleLowerCase('pl');

    return products.filter(
        product =>
            product.name.toLocaleLowerCase('pl').includes(search) &&
            (filters.minPrice === null || product.price >= filters.minPrice) &&
            (filters.maxPrice === null || product.price <= filters.maxPrice)
    );
}

function debug_sortProducts(products: Product[], sort: ProductSort): Product[] {
    if (sort === 'priceAsc') return products.toSorted((a, b) => a.price - b.price);
    if (sort === 'priceDesc') return products.toSorted((a, b) => b.price - a.price);
    if (sort === 'nameAsc') return products.toSorted((a, b) => a.name.localeCompare(b.name, 'pl'));

    return products;
}

function debug_queryProducts(
    products: Product[],
    query: ProductQuery
): Pick<UseProductsResult, 'products' | 'total'> {
    const matching = debug_sortProducts(debug_filterProducts(products, query.filters), query.sort);
    const firstIndex = (query.page - 1) * query.pageSize;

    return {
        products: matching.slice(firstIndex, firstIndex + query.pageSize),
        total: matching.length
    };
}

function debug_useStaticProducts(query: ProductQuery): UseProductsResult {
    const { data, isLoading } = debug_useQuery<Product[]>([
        { id: 1, name: 'Sony WH-1000XM5', price: 1299 },
        { id: 2, name: 'Logitech MX Master 3S', price: 449 },
        { id: 3, name: 'Anker Nano 65W', price: 149 },
        { id: 4, name: 'Bose QuietComfort', price: 1199 },
        { id: 5, name: 'JBL Live 770NC', price: 599 },
        { id: 6, name: 'Samsung Galaxy Buds3', price: 699 }
    ]);

    return {
        ...debug_queryProducts(data ?? [], query),
        isLoading,
        error: null
    };
}

export const useProducts = env.isDebug ? debug_useStaticProducts : useApiProducts;
