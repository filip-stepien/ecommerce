import { type RequestError, toRequestError } from '@/api/error';
import { useGetRecommendedProducts } from '@/api/generated';
import type { Product } from '@/api/generated/model';
import { debug_useQuery } from '@/hooks/debug_useQuery';
import { env } from '@/lib/env';

export type UseRecommendedProductsResult = {
    products: Product[];
    isLoading: boolean;
    error: RequestError | null;
};

function useApiRecommendedProducts(limit?: number): UseRecommendedProductsResult {
    const { data, isLoading, error } = useGetRecommendedProducts({ limit });

    return {
        products: data ?? [],
        isLoading,
        error: toRequestError(error)
    };
}

function debug_useStaticRecommendedProducts(limit?: number): UseRecommendedProductsResult {
    const { data, isLoading } = debug_useQuery<Product[]>([
        {
            id: 101,
            name: 'Logitech MX Master 3S',
            price: 449,
            imageUrl: '/products/logitech-mx-master-3s.jpg'
        },
        {
            id: 102,
            name: 'Anker Nano 65W',
            price: 149,
            imageUrl: '/products/anker-nano-65w.jpg'
        },
        {
            id: 103,
            name: 'Sony WH-1000XM5',
            price: 1299,
            imageUrl: '/products/sony-wh-1000xm5.jpg'
        },
        { id: 104, name: 'Anker PowerCore 20000', price: 199 },
        { id: 105, name: 'Logitech MX Keys S', price: 499 },
        { id: 106, name: 'Samsung T7 1TB', price: 459 },
        { id: 107, name: 'Sony WF-1000XM5', price: 1199 },
        { id: 108, name: 'Belkin BoostCharge', price: 129 }
    ]);

    return {
        products: data?.slice(0, limit) ?? [],
        isLoading,
        error: null
    };
}

export const useRecommendedProducts = env.isDebug
    ? debug_useStaticRecommendedProducts
    : useApiRecommendedProducts;
