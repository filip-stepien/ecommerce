import { userManager } from '../auth/userManager';

export class ApiError<TBody = unknown> extends Error {
    readonly status: number;
    readonly body: TBody;

    constructor(status: number, body: TBody) {
        super(`Żądanie do API nie powiodło się (HTTP ${status})`);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

export type ErrorType<TBody> = ApiError<TBody>;

async function readBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return undefined;
    const isJson = response.headers.get('content-type')?.includes('json');
    return isJson ? JSON.parse(text) : text;
}

export async function http<T>(url: string, options: RequestInit): Promise<T> {
    const user = await userManager.getUser();
    const headers = new Headers(options.headers);
    if (user && !user.expired) {
        headers.set('Authorization', `Bearer ${user.access_token}`);
    }

    const response = await fetch(url, { ...options, headers });
    const body = await readBody(response);
    if (!response.ok) {
        throw new ApiError(response.status, body);
    }
    return body as T;
}
