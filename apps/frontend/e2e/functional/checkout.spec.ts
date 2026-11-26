import { expect, test } from '@playwright/test';
import {
    addToCart,
    expectSignInPage,
    fetchCheckoutOptions,
    fetchOrder,
    fetchProduct,
    fillCheckoutForm,
    formatPrice,
    goToCheckout,
    products,
    signIn,
    submitOrder
} from '../support.ts';

test.describe('checkout (5)', () => {
    test('asks guests to sign in', async ({ page }) => {
        await addToCart(page, products.charger);
        await goToCheckout(page);
        await expectSignInPage(page);
    });

    test.describe('signed in', () => {
        test.beforeEach(async ({ page }) => {
            await signIn(page);
        });

        test('validates the form', async ({ page }) => {
            await addToCart(page, products.charger);
            await goToCheckout(page);
            await page.getByRole('button', { name: 'Zamawiam i płacę' }).click();

            await expect(page.getByText('To pole jest wymagane').first()).toBeVisible();
            await expect(page).toHaveURL(/\/checkout$/);
        });

        test('places a paid order with courier delivery and BLIK', async ({ page, request }) => {
            const charger = await fetchProduct(request, products.charger.id);
            const { deliveryMethods } = await fetchCheckoutOptions(request);
            const courier = deliveryMethods.find(method => method.id === 'courier')!;

            await addToCart(page, products.charger);
            await goToCheckout(page);
            await fillCheckoutForm(page);
            await page.getByLabel(/^Kurier/).check();
            await page.getByLabel('BLIK').check();
            const id = await submitOrder(page);

            await expect(
                page.getByRole('heading', { name: 'Dziękujemy za Twoje zamówienie' })
            ).toBeVisible();
            await expect(
                page.getByText(formatPrice(charger.price + courier.price), { exact: true })
            ).toBeVisible();
            const order = await fetchOrder(page, request, id);
            expect(order).toMatchObject({
                status: 'PAID',
                deliveryMethod: 'courier',
                paymentMethod: 'blik'
            });
            expect(order.total).toBeCloseTo(charger.price + courier.price, 2);
        });

        test('places an order with pickup, card payment and separate invoice details', async ({
            page,
            request
        }) => {
            await addToCart(page, products.charger);
            await goToCheckout(page);
            await fillCheckoutForm(page);
            await page.getByLabel(/^Odbiór osobisty/).check();
            await page.getByLabel('Karta płatnicza').check();
            await page.getByLabel('Numer karty').fill('4111111111111111');
            await page.getByLabel('Data ważności').fill('1230');
            await page.getByLabel('Kod CVC').fill('123');
            await page.getByLabel('Imię i nazwisko na karcie').fill('Anna Kowalska');
            await page.getByLabel('Dane do faktury takie same jak adres dostawy').uncheck();
            await page.getByLabel('Imię i nazwisko lub nazwa firmy').fill('Kowalska Consulting');
            await page.getByLabel('NIP (opcjonalnie)').fill('526-025-02-74');
            await page.getByLabel('Ulica').nth(1).fill('Prosta');
            await page.getByLabel('Nr domu / lokalu').nth(1).fill('5');
            await page.getByLabel('Kod pocztowy').nth(1).fill('00-850');
            await page.getByLabel('Miasto').nth(1).fill('Warszawa');
            const id = await submitOrder(page);

            const order = await fetchOrder(page, request, id);
            expect(order).toMatchObject({
                status: 'PAID',
                deliveryMethod: 'pickup',
                deliveryPrice: 0,
                paymentMethod: 'card',
                invoice: { name: 'Kowalska Consulting' }
            });
        });

        test('prices the order on the server', async ({ page, request }) => {
            const headphones = await fetchProduct(request, products.headphones.id);

            await addToCart(page, products.headphones);
            await page.evaluate(() => {
                const items = JSON.parse(
                    localStorage.getItem('ecommerce-cart') ?? '[]'
                ) as object[];
                localStorage.setItem(
                    'ecommerce-cart',
                    JSON.stringify(items.map(item => ({ ...item, price: 1 })))
                );
            });
            await page.reload();
            await goToCheckout(page);
            await fillCheckoutForm(page);
            const id = await submitOrder(page);

            const order = await fetchOrder(page, request, id);
            expect(order.itemsTotal).toBe(headphones.price);
            expect(order.items[0].unitPrice).toBe(headphones.price);
        });

        test('reserves the ordered stock', async ({ page, request }) => {
            const before = await fetchProduct(request, products.externalDrive.id);

            await addToCart(page, products.externalDrive, 2);
            await goToCheckout(page);
            await fillCheckoutForm(page);
            await submitOrder(page);

            const after = await fetchProduct(request, products.externalDrive.id);
            expect(after.stock).toBe(before.stock - 2);
        });

        test('rejects an order exceeding the stock', async ({ page, request }) => {
            const before = await fetchProduct(request, products.powerBank.id);

            await addToCart(page, products.powerBank, before.stock + 1);
            await goToCheckout(page);
            await fillCheckoutForm(page);
            await page.getByRole('button', { name: 'Zamawiam i płacę' }).click();

            await expect(page.getByText('Nie udało się złożyć zamówienia')).toBeVisible();
            await expect(page).toHaveURL(/\/checkout$/);
            const after = await fetchProduct(request, products.powerBank.id);
            expect(after.stock).toBe(before.stock);
        });
    });
});
