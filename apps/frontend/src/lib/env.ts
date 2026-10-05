function envErr(name: string, problem: string): Error {
    return new Error(`Environment variable ${name} ${problem}.`);
}

function str(name: string): string {
    const raw = import.meta.env[name];
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (!value) throw envErr(name, 'is missing');

    return value;
}

function bool(name: string): boolean {
    const raw = import.meta.env[name];

    if (typeof raw === 'boolean') return raw;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (raw === undefined || raw === '') throw envErr(name, 'is missing');

    throw envErr(name, `must be "true" or "false", got "${String(raw)}"`);
}

export const Env = {
    isDebug: bool('VITE_DEBUG'),
    oidcAuthority: str('VITE_OIDC_AUTHORITY'),
    oidcClientId: str('VITE_OIDC_CLIENT_ID')
} as const;
