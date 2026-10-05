import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import App from './App.tsx';
import { userManager } from './auth/userManager.ts';
import './index.css';

const queryClient = new QueryClient();

function removeSigninParamsFromUrl() {
    window.history.replaceState({}, document.title, window.location.pathname);
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider userManager={userManager} onSigninCallback={removeSigninParamsFromUrl}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </AuthProvider>
    </StrictMode>
);
