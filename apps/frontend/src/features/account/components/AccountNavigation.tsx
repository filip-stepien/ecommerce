import { Center, Divider, NavLink, Paper, Stack, Text } from '@mantine/core';
import { LayoutDashboard, LockKeyhole, LogOut, MapPin, Package, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { SectionCard } from '@/components/SectionCard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User } from '@/features/auth/hooks/useCurrentUser';
import { appRoutes } from '@/lib/routes';

type AccountNavigationProps = {
    user: User;
};

const navLinkClassNames = {
    root: 'rounded-lg p-3.5 data-active:bg-(--mantine-color-blue-0) data-active:font-semibold data-active:text-(--mantine-color-blue-8)',
    section: 'me-3',
    label: 'text-sm leading-normal'
};

const accountLinks = [
    { label: 'Podsumowanie', icon: LayoutDashboard, href: appRoutes.account },
    { label: 'Moje zamówienia', icon: Package, href: appRoutes.orders },
    { label: 'Adresy dostawy', icon: MapPin, href: `${appRoutes.account}#address` },
    { label: 'Dane osobowe', icon: UserRound, href: `${appRoutes.account}#personal-data` }
];

function AccountUserCard({ user }: { user: User }) {
    return (
        <SectionCard>
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
        </SectionCard>
    );
}

export function AccountNavigation({ user }: AccountNavigationProps) {
    const { pathname } = useLocation();
    const { signOut } = useAuth();

    return (
        <Stack component='aside' className='w-full shrink-0 gap-5 md:w-61'>
            <AccountUserCard user={user} />
            <Stack component='nav' className='gap-1'>
                {accountLinks.map(({ label, icon: Icon, href }) => (
                    <NavLink
                        key={label}
                        component={Link}
                        to={href}
                        label={label}
                        active={pathname === href}
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
