import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { BrowserRouter, useNavigate } from 'react-router';
import { queryClient } from '@/api/queryClient';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
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
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <RoutedAuthProvider>{children}</RoutedAuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </MantineProvider>
    );
}
