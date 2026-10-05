import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from './providers.tsx';
import { Router } from './router.tsx';
import '@fontsource-variable/open-sans';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <Router />
        </Providers>
    </StrictMode>
);
