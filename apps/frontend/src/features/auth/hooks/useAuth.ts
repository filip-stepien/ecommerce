import { useState } from 'react';
import { useAuth as useOidcContext } from 'react-oidc-context';
import type { SignInState } from '@/features/auth/lib/redirectState';
import { Env } from '@/lib/env';
import { getCurrentFullPath } from '@/lib/path';

export type UseAuthResult = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
    signIn: (returnTo?: string) => Promise<void>;
    signOut: () => Promise<void>;
};

function useOidcAuth(): UseAuthResult {
    const oidc = useOidcContext();

    return {
        isAuthenticated: oidc.isAuthenticated,
        isLoading: oidc.isLoading,
        error: oidc.error ?? null,
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

export const useAuth = Env.isDebug ? useDebugAuth : useOidcAuth;
