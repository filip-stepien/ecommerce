import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AuthGuard({ children }: PropsWithChildren) {
    const { isAuthenticated, isLoading, error, signIn } = useAuth();
    const hasRequestedSignIn = useRef(false);

    useEffect(() => {
        if (isAuthenticated) {
            hasRequestedSignIn.current = false;
            return;
        }

        if (isLoading || error || hasRequestedSignIn.current) return;

        hasRequestedSignIn.current = true;
        void signIn();
    }, [isAuthenticated, isLoading, error, signIn]);

    if (isAuthenticated) return children;
    if (error) return <p>Zaloguj się, żeby zobaczyć tę stronę.</p>;

    return <p>Ładowanie...</p>;
}
