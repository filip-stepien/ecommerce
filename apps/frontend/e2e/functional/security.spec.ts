import { expect, test } from '@playwright/test';
import { apiURL, authorization, products, signIn } from '../support.ts';

const publicEndpoints = [
    '/api/products',
    `/api/products/${products.headphones.id}`,
    `/api/products/${products.headphones.id}/related`,
    '/api/products/recommended',
    '/api/products/categories',
    '/api/products/filter-options',
    '/api/checkout/options'
];

const customerEndpoints = ['/api/orders', '/api/me'];

test.describe('API access (7)', () => {
    test('lets guests browse the shop', async ({ request }) => {
        for (const path of publicEndpoints) {
            expect((await request.get(`${apiURL}${path}`)).status(), path).toBe(200);
        }
    });

    test('requires signing in for customer data and orders', async ({ request }) => {
        for (const path of customerEndpoints) {
            expect((await request.get(`${apiURL}${path}`)).status(), path).toBe(401);
        }
        expect((await request.post(`${apiURL}/api/orders`, { data: {} })).status()).toBe(401);
    });

    test('rejects a forged token', async ({ request }) => {
        const response = await request.get(`${apiURL}/api/orders`, {
            headers: { Authorization: 'Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0.' }
        });
        expect(response.status()).toBe(401);
    });

    test('gives a signed-in customer access to their data', async ({ page, request }) => {
        await signIn(page);
        const headers = await authorization(page);
        for (const path of customerEndpoints) {
            expect((await request.get(`${apiURL}${path}`, { headers })).status(), path).toBe(200);
        }
    });

    test.fixme('gives administrators access to product and order management', async () => {});

    test.fixme('denies customers access to product and order management', async () => {});
});
