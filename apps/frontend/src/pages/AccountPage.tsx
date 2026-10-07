import { Anchor, Breadcrumbs, Flex, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { QueryResult } from '@/components/QueryResult';
import { AccountMetrics } from '@/features/account/components/AccountMetrics';
import { AccountNavigation } from '@/features/account/components/AccountNavigation';
import { AccountRecommendations } from '@/features/account/components/AccountRecommendations';
import { PersonalOffers } from '@/features/account/components/PersonalOffers';
import { RecentOrders } from '@/features/account/components/RecentOrders';
import { SavedCustomerInfo } from '@/features/account/components/SavedCustomerInfo';
import { useAccountOverview } from '@/features/account/hooks/useAccountOverview';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { appRoutes } from '@/lib/routes';

export function AccountPage() {
    const { user, isLoading, error } = useCurrentUser();
    const overview = useAccountOverview();

    return (
        <QueryResult
            data={user}
            isLoading={isLoading}
            error={error}
            errorText='Nie udało się pobrać użytkownika'
        >
            {user => (
                <Stack className='gap-7'>
                    <Stack className='gap-2'>
                        <Breadcrumbs
                            separatorMargin={4}
                            classNames={{
                                root: 'text-xs leading-normal text-dimmed',
                                separator: 'text-dimmed'
                            }}
                        >
                            <Anchor
                                component={Link}
                                to={appRoutes.home}
                                c='dimmed'
                                className='text-xs'
                            >
                                Strona główna
                            </Anchor>
                            <Text className='text-xs leading-normal text-dimmed'>Moje konto</Text>
                        </Breadcrumbs>
                        <Title order={1} className='text-[32px]'>
                            Cześć, {user.username}!
                        </Title>
                        <Text className='text-sm text-dimmed'>
                            Twoje zamówienia, zapisane dane i oferty w jednym miejscu.
                        </Text>
                    </Stack>
                    <Flex className='flex-col items-start gap-7 md:flex-row'>
                        <AccountNavigation
                            user={user}
                            favoriteCount={overview.overview?.favoriteCount ?? 0}
                        />
                        <Stack className='w-full min-w-0 flex-1 gap-6 md:w-auto'>
                            <QueryResult
                                data={overview.overview}
                                isLoading={overview.isLoading}
                                error={overview.error}
                                errorText='Nie udało się pobrać danych konta'
                            >
                                {overview => (
                                    <>
                                        <AccountMetrics
                                            orders={overview.orders}
                                            offers={overview.offers}
                                        />
                                        <RecentOrders orders={overview.orders} />
                                        <PersonalOffers offers={overview.offers} />
                                        <SavedCustomerInfo
                                            user={user}
                                            address={overview.defaultAddress}
                                        />
                                    </>
                                )}
                            </QueryResult>
                            <AccountRecommendations />
                        </Stack>
                    </Flex>
                </Stack>
            )}
        </QueryResult>
    );
}
