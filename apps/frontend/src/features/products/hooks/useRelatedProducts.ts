import type { RequestError } from '@/api/error';
import type { Product } from '@/api/generated/model';
import { debug_useQuery } from '@/hooks/debug_useQuery';

export type UseRelatedProductsResult = {
    products: Product[];
    isLoading: boolean;
    error: RequestError | null;
};

function debug_useStaticRelatedProducts(_productId: string | number): UseRelatedProductsResult {
    const { data, isLoading } = debug_useQuery<Product[]>([
        { id: 201, name: 'Bose QuietComfort Ultra', price: 1899 },
        { id: 202, name: 'Sennheiser Momentum 4', price: 1499 },
        { id: 203, name: 'Apple AirPods Max', price: 2699 },
        { id: 204, name: 'JBL Tune 770NC', price: 449 },
        { id: 205, name: 'Sony WH-CH720N', price: 499 },
        { id: 206, name: 'Jabra Elite 85h', price: 899 }
    ]);

    return {
        products: data ?? [],
        isLoading,
        error: null
    };
}

export { debug_useStaticRelatedProducts as useRelatedProducts };
