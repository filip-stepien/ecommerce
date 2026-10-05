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

export type RequestError = {
    reason: 'unauthorized' | 'forbidden' | 'network' | 'unknown';
    message: string;
};

function toErrorReason(error: Error): RequestError['reason'] {
    if (!(error instanceof ApiError)) return 'network';
    if (error.status === 401) return 'unauthorized';
    if (error.status === 403) return 'forbidden';

    return 'unknown';
}

export function toRequestError(error: Error): RequestError {
    return { reason: toErrorReason(error), message: error.message };
}
