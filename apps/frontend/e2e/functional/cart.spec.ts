import { expect, test } from '@playwright/test';
import { addToCart, fetchProduct, formatPrice, openCart, products } from '../support.ts';

test.describe('cart (5)', () => {
    test('adds products and sums up the total', async ({ page, request }) => {
        const headphones = await fetchProduct(request, products.headphones.id);
        const charger = await fetchProduct(request, products.charger.id);

        await addToCart(page, products.headphones);
        await addToCart(page, products.charger);
        const cart = await openCart(page);

        await expect(cart.getByText(headphones.name)).toBeVisible();
        await expect(cart.getByText(charger.name)).toBeVisible();
        await expect(
            cart.getByText(formatPrice(headphones.price + charger.price), { exact: true })
        ).toBeVisible();
    });

    test('changes the quantity and removes products', async ({ page, request }) => {
        const charger = await fetchProduct(request, products.charger.id);

        await addToCart(page, products.charger);
        const cart = await openCart(page);
        await cart.getByRole('textbox').fill('3');
        await expect(
            cart.getByText(formatPrice(charger.price * 3), { exact: true }).first()
        ).toBeVisible();

        await cart.getByRole('button', { name: 'Usuń z koszyka' }).click();
        await expect(cart.getByText('Twój koszyk jest pusty')).toBeVisible();
    });

    test('keeps the cart after reloading the page', async ({ page }) => {
        await addToCart(page, products.mouse);
        await page.reload();
        const cart = await openCart(page);
        await expect(cart.getByText(products.mouse.name)).toBeVisible();
    });

    test.fixme('warns about an accessory that does not fit the device (6.5)', async ({ page }) => {
        await addToCart(page, products.iPhone16);
        await addToCart(page, products.iPhone15Case);
        const cart = await openCart(page);
        await expect(
            cart.getByText('Etui pasuje do iPhone 15, a w koszyku jest iPhone 16')
        ).toBeVisible();
    });
});
