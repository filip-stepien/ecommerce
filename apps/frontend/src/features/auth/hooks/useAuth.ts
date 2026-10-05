import { useAuth as useOidcAuth } from 'react-oidc-context';

export type UseAuthResult = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
    const oidc = useOidcAuth();

    return {
        isAuthenticated: oidc.isAuthenticated,
        isLoading: oidc.isLoading,
        error: oidc.error ?? null,
        signIn: () => oidc.signinRedirect(),
        signOut: () => oidc.signoutRedirect()
    };
}
