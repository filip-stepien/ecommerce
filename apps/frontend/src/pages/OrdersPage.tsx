import { QueryResult } from '@/components/QueryResult';
import { AccountLayout } from '@/features/account/components/AccountLayout';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { OrderHistory } from '@/features/orders/components/OrderHistory';
import { appRoutes } from '@/lib/routes';

export function OrdersPage() {
    const { user, isLoading, error } = useCurrentUser();

    return (
        <QueryResult
            data={user}
            isLoading={isLoading}
            error={error}
            errorText='Nie udało się pobrać użytkownika'
        >
            {user => (
                <AccountLayout
                    user={user}
                    breadcrumbs={[
                        { label: 'Strona główna', to: appRoutes.home },
                        { label: 'Moje konto', to: appRoutes.account },
                        { label: 'Zamówienia' }
                    ]}
                    title='Moje zamówienia'
                    description='Historia zakupów, status przesyłek i szczegóły Twoich zamówień.'
                >
                    <OrderHistory />
                </AccountLayout>
            )}
        </QueryResult>
    );
}
