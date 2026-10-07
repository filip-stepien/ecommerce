import { type RequestError, toRequestError } from '@/api/error';
import { useGetProductCategories } from '@/api/generated';
import { debug_useQuery } from '@/hooks/debug_useQuery';
import { env } from '@/lib/env';

export type UseProductCategoriesResult = {
    categories: string[];
    isLoading: boolean;
    error: RequestError | null;
};

function useApiProductCategories(): UseProductCategoriesResult {
    const { data, isLoading, error } = useGetProductCategories();

    return {
        categories: data ?? [],
        isLoading,
        error: toRequestError(error)
    };
}

function debug_useStaticProductCategories(): UseProductCategoriesResult {
    const { data, isLoading } = debug_useQuery<string[]>([
        'Komputery',
        'Smartfony',
        'Audio',
        'Akcesoria'
    ]);

    return {
        categories: data ?? [],
        isLoading,
        error: null
    };
}

export const useProductCategories = env.isDebug
    ? debug_useStaticProductCategories
    : useApiProductCategories;
