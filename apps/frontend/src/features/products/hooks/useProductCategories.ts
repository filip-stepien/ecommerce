import type { RequestError } from '@/api/error';
import { debug_useQuery } from '@/hooks/debug_useQuery';

export type UseProductCategoriesResult = {
    categories: string[];
    isLoading: boolean;
    error: RequestError | null;
};

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

export { debug_useStaticProductCategories as useProductCategories };
