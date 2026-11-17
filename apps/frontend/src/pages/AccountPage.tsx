import { QueryResult } from '@/components/QueryResult';
import { AccountLayout } from '@/features/account/components/AccountLayout';
import { AccountMetrics } from '@/features/account/components/AccountMetrics';
import { AccountRecommendations } from '@/features/account/components/AccountRecommendations';
import { RecentOrders } from '@/features/account/components/RecentOrders';
import { SavedCustomerInfo } from '@/features/account/components/SavedCustomerInfo';
import { useAccountOverview } from '@/features/account/hooks/useAccountOverview';
import { type User, useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { appRoutes } from '@/lib/routes';

function AccountSummary({ user }: { user: User }) {
    const { overview, isLoading, error } = useAccountOverview();

    return (
        <QueryResult
            data={overview}
            isLoading={isLoading}
            error={error}
            errorText='Nie udało się pobrać danych konta'
        >
            {overview => (
                <>
                    <AccountMetrics orders={overview.orders} />
                    <RecentOrders orders={overview.orders} />
                    <SavedCustomerInfo user={user} address={overview.defaultAddress} />
                </>
            )}
        </QueryResult>
    );
}

export function AccountPage() {
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
                        { label: 'Moje konto' }
                    ]}
                    title={`Cześć, ${user.username}!`}
                    description='Twoje zamówienia i zapisane dane w jednym miejscu.'
                >
                    <AccountSummary user={user} />
                    <AccountRecommendations />
                </AccountLayout>
            )}
        </QueryResult>
    );
}
