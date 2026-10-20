import { Link, useLocation } from 'react-router';
import { appRoutes } from '@/lib/routes';
import { Center, Divider, NavLink, Paper, Stack, Text } from '@mantine/core';
import {
    Gift,
    Heart,
    LayoutDashboard,
    LockKeyhole,
    LogOut,
    MapPin,
    Package,
    ShieldCheck,
    UserRound
} from 'lucide-react';
import { AccountCard } from '@/features/account/components/AccountCard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User } from '@/features/auth/hooks/useCurrentUser';

type AccountNavigationProps = {
    user: User;
    favoriteCount: number;
};

const navLinkClassNames = {
    root: 'rounded-lg p-3.5 data-active:bg-(--mantine-color-blue-0) data-active:font-semibold data-active:text-(--mantine-color-blue-8)',
    section: 'me-3',
    label: 'text-sm leading-normal'
};

export function AccountNavigation({ user, favoriteCount }: AccountNavigationProps) {
    const { pathname } = useLocation();
    const { signOut } = useAuth();
    const links = [
        {
            label: 'Podsumowanie',
            icon: LayoutDashboard,
            href: appRoutes.account,
            active: pathname === appRoutes.account
        },
        {
            label: 'Moje zamówienia',
            icon: Package,
            href: appRoutes.orders,
            active: pathname === appRoutes.orders
        },
        { label: 'Oferty dla Ciebie', icon: Gift, href: `${appRoutes.account}#offers` },
        { label: `Ulubione (${favoriteCount})`, icon: Heart },
        { label: 'Adresy dostawy', icon: MapPin, href: `${appRoutes.account}#address` },
        { label: 'Dane osobowe', icon: UserRound, href: `${appRoutes.account}#personal-data` },
        { label: 'Bezpieczeństwo', icon: ShieldCheck }
    ];

    return (
        <Stack component='aside' className='w-full shrink-0 gap-5 md:w-61'>
            <AccountCard>
                <Stack className='gap-2'>
                    <Center className='size-11 rounded-full bg-(--mantine-color-blue-0)'>
                        <Text className='text-lg font-bold text-(--mantine-color-blue-8)'>
                            {user.username.slice(0, 2).toUpperCase()}
                        </Text>
                    </Center>
                    <Text className='text-sm leading-normal font-semibold'>{user.username}</Text>
                    {user.email && (
                        <Text className='text-xs leading-normal text-dimmed'>{user.email}</Text>
                    )}
                </Stack>
            </AccountCard>
            <Stack component='nav' className='gap-1'>
                {links.map(({ label, icon: Icon, href, active }) => (
                    <NavLink
                        key={label}
                        component={Link}
                        to={href ?? pathname}
                        disabled={!href}
                        label={label}
                        active={active}
                        leftSection={<Icon size={20} />}
                        classNames={navLinkClassNames}
                    />
                ))}
                <Divider />
                <NavLink
                    component='button'
                    label='Wyloguj się'
                    leftSection={<LogOut size={20} />}
                    classNames={navLinkClassNames}
                    onClick={() => void signOut()}
                />
            </Stack>
            <Paper className='rounded-[10px] bg-[#eef2f6] p-4.5 dark:bg-(--mantine-color-dark-6)'>
                <Stack className='gap-2'>
                    <LockKeyhole size={20} />
                    <Text className='text-xs leading-normal font-semibold'>
                        Twoje konto jest chronione
                    </Text>
                </Stack>
            </Paper>
        </Stack>
    );
}
