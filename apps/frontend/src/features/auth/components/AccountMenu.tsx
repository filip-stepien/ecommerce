import { Menu, Text, UnstyledButton } from '@mantine/core';
import { UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AppRoutes } from '@/lib/routes';

const buttonClassName = 'flex items-center gap-2';
const labelClassName = 'text-sm font-semibold';

export function AccountMenu() {
    const { isAuthenticated, isLoading, signIn, signOut } = useAuth();
    const { user } = useCurrentUser();

    if (!isAuthenticated) {
        return (
            <UnstyledButton
                className={buttonClassName}
                disabled={isLoading}
                onClick={() => void signIn()}
            >
                <UserRound size={20} />
                <Text className={labelClassName}>Zaloguj się</Text>
            </UnstyledButton>
        );
    }

    return (
        <Menu position='bottom-end'>
            <Menu.Target>
                <UnstyledButton className={buttonClassName}>
                    <UserRound size={20} />
                    <Text className={labelClassName}>
                        {user ? `Cześć, ${user.username}` : 'Moje konto'}
                    </Text>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item component={Link} to={AppRoutes.account}>
                    Moje konto
                </Menu.Item>
                <Menu.Item onClick={() => void signOut()}>Wyloguj się</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
