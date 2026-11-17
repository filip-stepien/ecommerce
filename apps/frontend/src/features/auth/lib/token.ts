import { userManager } from './userManager';

export async function getAccessToken(): Promise<string | null> {
    const user = await userManager.getUser();
    return user && !user.expired ? user.access_token : null;
}

export async function createAuthorizedHeaders(otherHeaders?: HeadersInit): Promise<Headers> {
    const headers = new Headers(otherHeaders);
    const accessToken = await getAccessToken();

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
}
