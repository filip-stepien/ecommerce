import { Outlet, Route, Routes } from 'react-router';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { appRoutes } from '@/lib/routes';
import { OrderDetailsPage } from '@/pages/OrderDetailsPage';
import { AccountPage } from '@/pages/AccountPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { ProductsPage } from '@/pages/ProductsPage';

export function Router() {
    return (
        <Routes>
            <Route path={appRoutes.home} element={<Layout />}>
                <Route index element={<ProductsPage />} />
                <Route path={appRoutes.product} element={<ProductDetailsPage />} />
                <Route
                    element={
                        <AuthGuard>
                            <Outlet />
                        </AuthGuard>
                    }
                >
                    <Route path={appRoutes.account} element={<AccountPage />} />
                    <Route path={appRoutes.orders} element={<AccountPage ordersOnly />} />
                    <Route path={appRoutes.order} element={<OrderDetailsPage />} />
                    <Route path={appRoutes.checkout} element={<CheckoutPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
