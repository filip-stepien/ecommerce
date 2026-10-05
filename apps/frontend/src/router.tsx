import { Outlet, Route, Routes } from 'react-router';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { MainLayout } from '@/layouts/MainLayout';
import { AppRoutes } from '@/lib/routes';
import { AccountPage } from '@/pages/AccountPage';
import { ProductsPage } from '@/pages/ProductsPage';

export function Router() {
    return (
        <Routes>
            <Route path={AppRoutes.home} element={<MainLayout />}>
                <Route index element={<ProductsPage />} />
                <Route
                    element={
                        <AuthGuard>
                            <Outlet />
                        </AuthGuard>
                    }
                >
                    <Route path={AppRoutes.account} element={<AccountPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
