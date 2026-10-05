import { type RequestError, toRequestError } from '@/api/error';
import { useGetProducts } from '@/api/generated';
import type { Product } from '@/api/generated/model';
import { useDebugQuery } from '@/hooks/useDebugQuery';
import { Env } from '@/lib/env';

export type UseProductsResult = {
    products: Product[];
    isLoading: boolean;
    error: RequestError | null;
};

function useApiProducts(): UseProductsResult {
    const { data, isLoading, error } = useGetProducts();

    return {
        products: data ?? [],
        isLoading,
        error: toRequestError(error)
    };
}

function useStaticProducts(): UseProductsResult {
    const { data, isLoading } = useDebugQuery<Product[]>([
        { id: 1, name: 'Klawiatura mechaniczna', price: 349.99 },
        { id: 2, name: 'Mysz bezprzewodowa', price: 129 },
        { id: 3, name: 'Monitor 27"', price: 1199.5 },
        { id: 4, name: 'Słuchawki nauszne', price: 459 }
    ]);

    return {
        products: data ?? [],
        isLoading,
        error: null
    };
}

export const useProducts = Env.isDebug ? useStaticProducts : useApiProducts;
