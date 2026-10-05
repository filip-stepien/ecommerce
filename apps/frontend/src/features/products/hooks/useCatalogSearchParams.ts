import { useMatch, useNavigate, useSearchParams } from 'react-router';
import { appRoutes } from '@/lib/routes';

export type CatalogSearchParams = {
    search: string;
    category: string | null;
};

export type UseCatalogSearchParamsResult = CatalogSearchParams & {
    isCatalog: boolean;
    setCatalogSearchParams: (patch: Partial<CatalogSearchParams>) => void;
};

export function getCatalogPath(params: Partial<CatalogSearchParams> = {}): string {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);

    const search = searchParams.toString();
    return search ? `${appRoutes.home}?${search}` : appRoutes.home;
}

export function useCatalogSearchParams(): UseCatalogSearchParamsResult {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isCatalog = useMatch(appRoutes.home) !== null;

    const current: CatalogSearchParams = isCatalog
        ? { search: searchParams.get('search') ?? '', category: searchParams.get('category') }
        : { search: '', category: null };

    return {
        ...current,
        isCatalog,
        setCatalogSearchParams: patch =>
            void navigate(getCatalogPath({ ...current, ...patch }), { replace: isCatalog })
    };
}
