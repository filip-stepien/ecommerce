import { Outlet, Route, Routes } from 'react-router';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { appRoutes } from '@/lib/routes';
import { AccountPage } from '@/pages/AccountPage';
import { ProductsPage } from '@/pages/ProductsPage';

export function Router() {
    return (
        <Routes>
            <Route path={appRoutes.home} element={<Layout />}>
                <Route index element={<ProductsPage />} />
                <Route
                    element={
                        <AuthGuard>
                            <Outlet />
                        </AuthGuard>
                    }
                >
                    <Route path={appRoutes.account} element={<AccountPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
