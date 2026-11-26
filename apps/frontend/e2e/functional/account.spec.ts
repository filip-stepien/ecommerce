import { expect, test } from '@playwright/test';
import {
    credentials,
    deliveryAddress,
    expectSignInPage,
    placeOrder,
    products,
    signIn
} from '../support.ts';

test.describe('sign in (3, 5)', () => {
    test('signs in through Keycloak with the shop theme and signs out', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Zaloguj się' }).click();
        await expectSignInPage(page);
        await expect(page.locator('link[rel="stylesheet"][href*="/login/volt/"]')).toHaveCount(1);

        await page.getByLabel('Adres e-mail').fill(credentials.username);
        await page.getByLabel('Hasło', { exact: true }).fill(credentials.password);
        await page.getByRole('button', { name: 'Zaloguj się' }).click();
        await expect(page.getByRole('button', { name: 'Moje konto' })).toBeVisible();

        await page.getByRole('button', { name: 'Moje konto' }).click();
        await page.getByRole('menuitem', { name: 'Wyloguj się' }).click();
        await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
    });

    test('rejects a wrong password', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Zaloguj się' }).click();
        await page.getByLabel('Adres e-mail').fill(credentials.username);
        await page.getByLabel('Hasło', { exact: true }).fill(`${credentials.password}-wrong`);
        await page.getByRole('button', { name: 'Zaloguj się' }).click();
        await expectSignInPage(page);
    });

    test('sends guests from customer pages to sign in', async ({ page }) => {
        for (const path of ['/account', '/account/orders', '/checkout']) {
            await page.goto(path);
            await expectSignInPage(page);
        }
    });

    test.fixme('registers a new customer', async ({ page }) => {
        const username = `customer-${Date.now()}`;

        await page.goto('/');
        await page.getByRole('button', { name: 'Zaloguj się' }).click();
        await page.getByRole('link', { name: 'Załóż konto' }).click();
        await page.locator('#firstName').fill('Jan');
        await page.locator('#lastName').fill('Nowak');
        await page.locator('#email').fill(`${username}@example.com`);
        await page.locator('#username').fill(username);
        await page.locator('#password').fill('Haslo-123456');
        await page.locator('#password-confirm').fill('Haslo-123456');
        await page.locator('form').getByRole('button').last().click();

        await expect(page.getByRole('button', { name: 'Moje konto' })).toBeVisible();
    });
});

test.describe('orders and account (5)', () => {
    test.beforeEach(async ({ page }) => {
        await signIn(page);
    });

    test('lists the order in the history and opens its details', async ({ page }) => {
        const id = await placeOrder(page, [products.charger]);

        await page.goto('/account/orders');
        const row = page
            .locator('div')
            .filter({ has: page.getByText(`#${id}`, { exact: true }) })
            .filter({ has: page.getByRole('link', { name: 'Szczegóły' }) })
            .last();
        await expect(row.getByText('Opłacono')).toBeVisible();

        await row.getByRole('link', { name: 'Szczegóły' }).click();
        await expect(page).toHaveURL(new RegExp(`/account/orders/${id}$`));
        await expect(page.getByText(products.charger.name).first()).toBeVisible();
    });

    test('shows customer data, recent orders and the last delivery address', async ({ page }) => {
        const id = await placeOrder(page, [products.charger]);

        await page.goto('/account');
        await expect(page.getByText(`Cześć, ${credentials.username}!`)).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Dane osobowe' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Ostatni adres dostawy' })).toBeVisible();
        await expect(page.getByText(deliveryAddress.street).first()).toBeVisible();
        await expect(page.getByText(`#${id}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Wykorzystany w zamówieniu #${id}`)).toBeVisible();
    });

    test('does not show an order that is not the customer’s', async ({ page }) => {
        await page.goto('/account/orders/999999999');
        await expect(
            page.getByRole('heading', { name: 'Nie znaleziono zamówienia' })
        ).toBeVisible();
    });
});
