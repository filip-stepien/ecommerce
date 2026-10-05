import { NavLink, Outlet } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

function getNavLinkClassName({ isActive }: { isActive: boolean }) {
    return isActive ? 'font-semibold underline' : '';
}

export function MainLayout() {
    const auth = useAuth();

    return (
        <main>
            <header>
                <h1>Ecommerce</h1>
                <nav className='flex gap-4'>
                    <NavLink to='/' end className={getNavLinkClassName}>
                        Produkty
                    </NavLink>
                    <NavLink to='/account' className={getNavLinkClassName}>
                        Moje konto
                    </NavLink>
                </nav>
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

            <Outlet />
        </main>
    );
}
