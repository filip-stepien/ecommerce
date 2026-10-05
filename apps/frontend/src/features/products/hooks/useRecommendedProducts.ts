import type { RequestError } from '@/api/error';
import type { Product } from '@/api/generated/model';
import { debug_useQuery } from '@/hooks/debug_useQuery';

export type UseRecommendedProductsResult = {
    products: Product[];
    isLoading: boolean;
    error: RequestError | null;
};

function debug_useStaticRecommendedProducts(): UseRecommendedProductsResult {
    const { data, isLoading } = debug_useQuery<Product[]>([
        { id: 101, name: 'Apple AirPods Pro 2', price: 1099 },
        { id: 102, name: 'Razer DeathAdder V3', price: 349 },
        { id: 103, name: 'Keychron K2', price: 449 },
        { id: 104, name: 'Anker PowerCore 20000', price: 199 },
        { id: 105, name: 'Logitech MX Keys S', price: 499 },
        { id: 106, name: 'Samsung T7 1TB', price: 459 },
        { id: 107, name: 'Sony WF-1000XM5', price: 1199 },
        { id: 108, name: 'Belkin BoostCharge', price: 129 }
    ]);

    return {
        products: data ?? [],
        isLoading,
        error: null
    };
}

export { debug_useStaticRecommendedProducts as useRecommendedProducts };
