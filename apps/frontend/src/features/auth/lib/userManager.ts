import { UserManager } from 'oidc-client-ts';
import { Env } from '@/lib/env';

export const userManager = new UserManager({
    authority: Env.oidcAuthority,
    client_id: Env.oidcClientId,
    redirect_uri: window.location.origin,
    post_logout_redirect_uri: window.location.origin,
    scope: 'openid profile email'
});
