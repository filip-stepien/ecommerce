import { useAuth as useOidcAuth } from 'react-oidc-context';
import type { SignInState } from '@/features/auth/lib/signInState';

export type UseAuthResult = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
    signIn: (returnTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
};

function getCurrentPath(): string {
    return window.location.pathname + window.location.search;
}

export function useAuth(): UseAuthResult {
    const oidc = useOidcAuth();

    return {
        isAuthenticated: oidc.isAuthenticated,
        isLoading: oidc.isLoading,
        error: oidc.error ?? null,
        signIn: (returnTo = getCurrentPath()) => {
            const state: SignInState = { returnTo };
            return oidc.signinRedirect({ state });
        },
        signOut: () => oidc.signoutRedirect()
    };
}
