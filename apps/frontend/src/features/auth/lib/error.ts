import type { ErrorContext } from 'react-oidc-context';

export type AuthError = {
    reason: 'signIn' | 'signOut' | 'sessionRenewal' | 'unknown';
    message: string;
};

function toErrorReason(source: ErrorContext['source']): AuthError['reason'] {
    if (source === 'renewSilent') return 'sessionRenewal';
    if (source.startsWith('signin')) return 'signIn';
    if (source.startsWith('signout')) return 'signOut';

    return 'unknown';
}

export function toAuthError(error?: ErrorContext | null): AuthError | null {
    return error ? { reason: toErrorReason(error.source), message: error.message } : null;
}
