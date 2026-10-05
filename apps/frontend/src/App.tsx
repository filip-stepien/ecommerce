import { useAuth } from 'react-oidc-context';
import { useGetProducts } from './api/generated/products/products';
import { useGetCurrentUser } from './api/generated/users/users';

const priceFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

function Products() {
    const { data: products, isPending, error } = useGetProducts();

    if (isPending) return <p>Ładowanie produktów…</p>;
    if (error) return <p role='alert'>Nie udało się pobrać produktów: {error.message}</p>;

    return (
        <ul className='products'>
            {products.map(product => (
                <li key={product.id}>
                    <span>{product.name}</span>
                    <span>{priceFormat.format(product.price)}</span>
                </li>
            ))}
        </ul>
    );
}

function CurrentUser() {
    const { data: user, isPending, error } = useGetCurrentUser();

    if (isPending) return <p>Ładowanie danych użytkownika…</p>;
    if (error) return <p role='alert'>Nie udało się pobrać użytkownika: {error.message}</p>;

    return (
        <dl className='user'>
            <dt>Login</dt>
            <dd>{user.username}</dd>
            <dt>E-mail</dt>
            <dd>{user.email ?? '—'}</dd>
            <dt>Role</dt>
            <dd>{user.roles.join(', ') || '—'}</dd>
        </dl>
    );
}

function App() {
    const auth = useAuth();

    return (
        <main>
            <header>
                <h1>Ecommerce</h1>
                {auth.isAuthenticated ? (
                    <button type='button' onClick={() => void auth.signoutRedirect()}>
                        Wyloguj
                    </button>
                ) : (
                    <button
                        type='button'
                        disabled={auth.isLoading}
                        onClick={() => void auth.signinRedirect()}
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
