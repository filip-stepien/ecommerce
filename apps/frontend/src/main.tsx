import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { queryClient } from '@/api/queryClient.ts';
import { AuthProvider } from '@/features/auth/providers/AuthProvider.tsx';
import App from './App.tsx';
import { theme } from './theme.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme='auto'>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </AuthProvider>
        </MantineProvider>
    </StrictMode>
);
