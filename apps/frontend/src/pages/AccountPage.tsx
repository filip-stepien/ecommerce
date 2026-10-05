import { QueryResult } from '@/components/QueryResult';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export function AccountPage() {
    const { user, isLoading, error } = useCurrentUser();

    return (
        <section>
            <h2>Moje konto</h2>
            <QueryResult
                data={user}
                isLoading={isLoading}
                error={error}
                errorText='Nie udało się pobrać użytkownika'
            >
                {user => (
                    <dl className='user'>
                        <dt>Login</dt>
                        <dd>{user.username}</dd>
                        <dt>E-mail</dt>
                        <dd>{user.email ?? '—'}</dd>
                        <dt>Role</dt>
                        <dd>{user.roles.join(', ') || '—'}</dd>
                    </dl>
                )}
            </QueryResult>
        </section>
    );
}
