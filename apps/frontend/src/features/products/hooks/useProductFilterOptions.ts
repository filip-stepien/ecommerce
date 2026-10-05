import type { RequestError } from '@/api/error';
import { debug_useQuery } from '@/hooks/debug_useQuery';

export type ProductFilterOptions = {
    connectivityOptions: string[];
    brands: string[];
};

export type UseProductFilterOptionsResult = ProductFilterOptions & {
    isLoading: boolean;
    error: RequestError | null;
};

function debug_useStaticProductFilterOptions(): UseProductFilterOptionsResult {
    const { data, isLoading } = debug_useQuery<ProductFilterOptions>({
        connectivityOptions: ['Bluetooth', 'USB-C', 'Wi-Fi'],
        brands: ['Anker', 'Bose', 'JBL', 'Logitech', 'Samsung', 'Sony']
    });

    return {
        connectivityOptions: data?.connectivityOptions ?? [],
        brands: data?.brands ?? [],
        isLoading,
        error: null
    };
}

export { debug_useStaticProductFilterOptions as useProductFilterOptions };
