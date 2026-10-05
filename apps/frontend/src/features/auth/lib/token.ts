import { userManager } from './userManager';

export async function getAccessToken(): Promise<string | null> {
    const user = await userManager.getUser();
    return user && !user.expired ? user.access_token : null;
}
