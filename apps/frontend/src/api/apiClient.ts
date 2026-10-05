import { getAccessToken } from '@/features/auth/lib/token';
import { ApiError } from './error';

export type ErrorType<TBody> = ApiError<TBody>;

async function readResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return undefined;

    const isJson = response.headers.get('content-type')?.includes('json');
    return isJson ? JSON.parse(text) : text;
}

export async function apiClient<T>(url: string, options: RequestInit): Promise<T> {
    const accessToken = await getAccessToken();
    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(url, { ...options, headers });
    const body = await readResponseBody(response);

    if (!response.ok) {
        throw new ApiError(response.status, body);
    }

    return body as T;
}
