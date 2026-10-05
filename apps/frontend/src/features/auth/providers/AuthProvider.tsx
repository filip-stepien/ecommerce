import type { PropsWithChildren } from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { getReturnToPathFromOidcUser } from '@/features/auth/lib/redirectState';
import { userManager } from '@/features/auth/lib/userManager';

type AuthProviderProps = PropsWithChildren<{
    onSignedIn: (returnTo: string) => void;
}>;

export function AuthProvider({ onSignedIn, children }: AuthProviderProps) {
    return (
        <OidcAuthProvider
            userManager={userManager}
            onSigninCallback={user => onSignedIn(getReturnToPathFromOidcUser(user))}
        >
            {children}
        </OidcAuthProvider>
    );
}
