import { Alert, Box, Container, Group, Text } from '@mantine/core';
import { ShoppingBag } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { AccountMenu } from '@/features/auth/components/AccountMenu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProductCategories } from '@/features/products/hooks/useProductCategories';
import { AppRoutes } from '@/lib/routes';

export function MainLayout() {
    const auth = useAuth();
    const { categories } = useProductCategories();

    return (
        <Box className='flex min-h-screen flex-col bg-(--mantine-color-gray-0) dark:bg-(--mantine-color-dark-8)'>
            <Box component='header' className='bg-body'>
                <Container>
                    <Group className='h-22 justify-between'>
                        <Text
                            component={Link}
                            to={AppRoutes.home}
                            className='text-[32px] leading-none font-bold'
                        >
                            E-sklep
                        </Text>
                        <Group className='gap-6'>
                            <AccountMenu />
                            <Group className='gap-2'>
                                <ShoppingBag size={20} />
                                <Text className='text-sm font-semibold'>Koszyk</Text>
                            </Group>
                        </Group>
                    </Group>
                </Container>
                <Box className='border-y border-default-border'>
                    <Container>
                        <Group component='nav' className='h-11.5 flex-nowrap gap-8.5'>
                            <Text
                                component={Link}
                                to={AppRoutes.home}
                                className='text-sm font-semibold'
                            >
                                Wszystkie produkty
                            </Text>
                            {[...categories, 'Nowości'].map(category => (
                                <Text key={category} className='text-sm font-semibold'>
                                    {category}
                                </Text>
                            ))}
                            <Text className='text-sm font-semibold text-anchor'>
                                Oferty dla Ciebie
                            </Text>
                        </Group>
                    </Container>
                </Box>
            </Box>
            <Box component='main' className='flex-1 pt-7 pb-12'>
                <Container>
                    {auth.error && (
                        <Alert color='red' title='Błąd logowania' className='mb-7'>
                            {auth.error.message}
                        </Alert>
                    )}
                    <Outlet />
                </Container>
            </Box>
            <Box component='footer' className='border-t border-default-border bg-body py-7'>
                <Container>
                    <Text className='text-center text-xs text-dimmed'>
                        © 2026 Filip Stępień, Rafał Grot, Bartłomiej Karkoszka
                    </Text>
                </Container>
            </Box>
        </Box>
    );
}
