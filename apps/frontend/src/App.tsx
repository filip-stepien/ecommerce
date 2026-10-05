import { useGetProducts } from '@/api/generated/products/products';
import { QueryResult } from '@/components/QueryResult';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

const priceFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

function Products() {
    const { data: products, isPending, error } = useGetProducts();

    return (
        <QueryResult
            data={products}
            isLoading={isPending}
            error={error}
            loadingText='Ładowanie produktów…'
            errorText='Nie udało się pobrać produktów'
        >
            {products => (
                <ul className='products'>
                    {products.map(product => (
                        <li key={product.id}>
                            <span>{product.name}</span>
                            <span>{priceFormat.format(product.price)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </QueryResult>
    );
}

function CurrentUser() {
    const { user, isLoading, error } = useCurrentUser();

    return (
        <QueryResult
            data={user}
            isLoading={isLoading}
            error={error}
            loadingText='Ładowanie danych użytkownika…'
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
    );
}

function App() {
    const auth = useAuth();

    return (
        <main>
            <header>
                <h1>Ecommerce</h1>
                {auth.isAuthenticated ? (
                    <button type='button' onClick={() => void auth.signOut()}>
                        Wyloguj
                    </button>
                ) : (
                    <button
                        type='button'
                        disabled={auth.isLoading}
                        onClick={() => void auth.signIn()}
                    >
                        Zaloguj
                    </button>
                )}
            </header>

            {auth.error && <p role='alert'>Błąd logowania: {auth.error.message}</p>}

            <section>
                <h2>Produkty</h2>
                <p className='hint'>GET /api/products — endpoint publiczny</p>
                <Products />
            </section>

            <section>
                <h2>Moje konto</h2>
                <p className='hint'>GET /api/me — wymaga tokenu z Keycloaka</p>
                {auth.isAuthenticated ? (
                    <CurrentUser />
                ) : (
                    <p>Zaloguj się, żeby zobaczyć swoje dane.</p>
                )}
            </section>
        </main>
    );
}

export default App;
