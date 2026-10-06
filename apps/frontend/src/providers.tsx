import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { BrowserRouter, useNavigate } from 'react-router';
import { queryClient } from '@/api/queryClient';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { CartProvider } from '@/features/cart/providers/CartProvider';
import { theme } from '@/theme';

function RoutedAuthProvider({ children }: PropsWithChildren) {
    const navigate = useNavigate();

    return (
        <AuthProvider onSignedIn={returnTo => navigate(returnTo, { replace: true })}>
            {children}
        </AuthProvider>
    );
}

export function Providers({ children }: PropsWithChildren) {
    return (
        <MantineProvider theme={theme} defaultColorScheme='light'>
            <Notifications position='bottom-right' autoClose={2500} />
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <RoutedAuthProvider>
                        <CartProvider>{children}</CartProvider>
                    </RoutedAuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </MantineProvider>
    );
}
