import type { PropsWithChildren } from 'react';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';

export function AuthGuard({ children }: PropsWithChildren) {
    const { isAuthenticated, error } = useRequireAuth();

    if (isAuthenticated) return children;
    if (error) return <p>Zaloguj się, żeby zobaczyć tę stronę.</p>;

    return <p>Ładowanie...</p>;
}
