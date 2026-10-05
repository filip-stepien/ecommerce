import type { User } from 'oidc-client-ts';

export type SignInState = {
    returnTo: string;
};

export function getReturnTo(user: User | undefined): string {
    const state = user?.state as SignInState | undefined;
    return state?.returnTo ?? '/';
}
