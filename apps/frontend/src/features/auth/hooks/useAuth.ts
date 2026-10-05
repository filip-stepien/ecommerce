import { useState } from 'react';
import { useAuth as useOidcContext } from 'react-oidc-context';
import { type AuthError, toAuthError } from '@/features/auth/lib/error';
import type { SignInState } from '@/features/auth/lib/redirectState';
import { env } from '@/lib/env';
import { getCurrentFullPath } from '@/lib/path';

export type UseAuthResult = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AuthError | null;
    signIn: (returnTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
};

function useOidcAuth(): UseAuthResult {
    const oidc = useOidcContext();

    return {
        isAuthenticated: oidc.isAuthenticated,
        isLoading: oidc.isLoading,
        error: toAuthError(oidc.error),
        signIn: (returnTo = getCurrentFullPath()) => {
            const state: SignInState = { returnTo };
            return oidc.signinRedirect({ state });
        },
        signOut: () => oidc.signoutRedirect()
    };
}

function useDebugAuth(): UseAuthResult {
    const debugAuthSessionStorageKey = 'debug-auth';
    const [isAuthenticated] = useState(
        () => window.sessionStorage.getItem(debugAuthSessionStorageKey) === 'true'
    );

    return {
        isAuthenticated,
        isLoading: false,
        error: null,
        signIn: async (returnTo = getCurrentFullPath()) => {
            window.sessionStorage.setItem(debugAuthSessionStorageKey, 'true');
            window.location.assign(returnTo);
        },
        signOut: async () => {
            window.sessionStorage.removeItem(debugAuthSessionStorageKey);
            window.location.assign(window.location.origin);
        }
    };
}

export const useAuth = env.isDebug ? useDebugAuth : useOidcAuth;
