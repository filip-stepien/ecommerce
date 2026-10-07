import { type RequestError, toRequestError } from '@/api/error';
import { useGetProductFilterOptions } from '@/api/generated';
import { debug_useQuery } from '@/hooks/debug_useQuery';
import { env } from '@/lib/env';

export type ProductFilterOptions = {
    connectivityOptions: string[];
    brands: string[];
};

export type UseProductFilterOptionsResult = ProductFilterOptions & {
    isLoading: boolean;
    error: RequestError | null;
};

function useApiProductFilterOptions(): UseProductFilterOptionsResult {
    const { data, isLoading, error } = useGetProductFilterOptions();

    return {
        connectivityOptions: data?.connectivityOptions ?? [],
        brands: data?.brands ?? [],
        isLoading,
        error: toRequestError(error)
    };
}

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

export const useProductFilterOptions = env.isDebug
    ? debug_useStaticProductFilterOptions
    : useApiProductFilterOptions;
