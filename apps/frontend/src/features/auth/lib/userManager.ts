import { UserManager } from 'oidc-client-ts';
import { env } from '@/lib/env';

export const userManager = new UserManager({
    authority: env.oidcAuthority,
    client_id: env.oidcClientId,
    redirect_uri: window.location.origin,
    post_logout_redirect_uri: window.location.origin,
    scope: 'openid profile email'
});
