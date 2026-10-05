import { useEffect } from 'react';
import type { AuthError } from '@/features/auth/lib/error';
import { useAuth } from './useAuth';

export type UseRequireAuthResult = {
    isAuthenticated: boolean;
    error: AuthError | null;
};

export function useRequireAuth(): UseRequireAuthResult {
    const { isAuthenticated, isLoading, error, signIn } = useAuth();

    useEffect(() => {
        if (isAuthenticated || isLoading || error) return;
        signIn();
    }, [isAuthenticated, isLoading, error, signIn]);

    return { isAuthenticated, error };
}
