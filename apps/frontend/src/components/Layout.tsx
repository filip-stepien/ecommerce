import { Alert, Box, Container } from '@mantine/core';
import { Outlet } from 'react-router';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function Layout() {
    const auth = useAuth();
    useScrollToTop();

    return (
        <Box className='flex min-h-screen flex-col bg-(--mantine-color-gray-0) dark:bg-(--mantine-color-dark-8)'>
            <Header />
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
            <Footer />
            <CartDrawer />
        </Box>
    );
}
