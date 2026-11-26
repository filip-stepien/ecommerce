import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';

export default defineConfig({
    testDir: 'e2e',
    timeout: 180_000,
    expect: { timeout: 15_000 },
    workers: 1,
    forbidOnly: !!process.env.CI,
    reporter: 'list',
    globalTeardown: './e2e/screenshot-manifest.ts',
    use: {
        baseURL,
        locale: 'pl-PL',
        timezoneId: 'Europe/Warsaw',
        colorScheme: 'light',
        trace: 'retain-on-failure'
    },
    projects: [
        {
            name: 'functional',
            testDir: 'e2e/functional',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
        },
        {
            name: 'screenshots',
            testDir: 'e2e/screenshots',
            testIgnore: /mobile\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 900 },
                deviceScaleFactor: 1.5
            }
        },
        {
            name: 'screenshots-mobile',
            testDir: 'e2e/screenshots',
            testMatch: /mobile\.spec\.ts/,
            use: { ...devices['Pixel 7'] }
        }
    ],
    webServer: [
        {
            name: 'backend',
            command: 'task backend:dev',
            cwd: path.resolve(import.meta.dirname, '../..'),
            url: `${apiURL}/api/checkout/options`,
            reuseExistingServer: true,
            timeout: 300_000
        },
        {
            name: 'frontend',
            command: 'pnpm dev',
            url: baseURL,
            reuseExistingServer: true,
            env: { VITE_DEBUG: 'false' }
        }
    ]
});
