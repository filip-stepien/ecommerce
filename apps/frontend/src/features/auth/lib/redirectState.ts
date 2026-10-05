import type { User } from 'oidc-client-ts';
import { appRoutes } from '@/lib/routes';

export type SignInState = {
    returnTo: string;
};

export function getReturnToPathFromOidcUser(user: User | undefined): string {
    const state = user?.state as SignInState | undefined;
    return state?.returnTo ?? appRoutes.home;
}
