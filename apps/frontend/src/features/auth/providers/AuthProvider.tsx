import type { PropsWithChildren } from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { userManager } from '@/features/auth/lib/userManager';

function removeSigninParamsFromUrl() {
    window.history.replaceState({}, document.title, window.location.pathname);
}

export function AuthProvider({ children }: PropsWithChildren) {
    return (
        <OidcAuthProvider userManager={userManager} onSigninCallback={removeSigninParamsFromUrl}>
            {children}
        </OidcAuthProvider>
    );
}
