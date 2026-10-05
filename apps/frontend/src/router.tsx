import { Outlet, Route, Routes } from 'react-router';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { MainLayout } from '@/layouts/MainLayout';
import { AccountPage } from '@/pages/AccountPage';
import { ProductsPage } from '@/pages/ProductsPage';

export function Router() {
    return (
        <Routes>
            <Route path='/' element={<MainLayout />}>
                <Route index element={<ProductsPage />} />
                <Route
                    element={
                        <AuthGuard>
                            <Outlet />
                        </AuthGuard>
                    }
                >
                    <Route path='account' element={<AccountPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
