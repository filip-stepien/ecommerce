import { expect, test } from '@playwright/test';
import {
    addToCart,
    assistantConfigured,
    assistantMissingReason,
    apiURL,
    askAssistant,
    captureElement,
    capturePage,
    carousel,
    chatWindow,
    credentials,
    fillCheckoutForm,
    goToCheckout,
    openCart,
    openChat,
    products,
    selectOption,
    signIn,
    submitOrder,
    unlabelledSelect,
    waitForAssistantReply
} from '../support.ts';

test('catalog', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Wszystkie produkty' })).toBeVisible();
    await capturePage(page, 'catalog');
});

test('catalog filters and sorting', async ({ page }) => {
    await page.goto('/');
    await selectOption(page.getByRole('combobox', { name: 'Kategoria' }), 'Słuchawki');
    await page.getByPlaceholder('do', { exact: true }).fill('1000');
    await page.getByLabel('Tylko dostępne').check();
    await selectOption(unlabelledSelect(page, 'Sortuj:'), 'Cena: od najniższej');
    await expect(page.getByText('JBL Tune 520BT')).toBeVisible();
    await capturePage(page, 'catalog-filters');
});

test('product details', async ({ page }) => {
    await page.goto(`/products/${products.headphones.id}`);
    await expect(
        page.getByRole('heading', { level: 1, name: products.headphones.name })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Powiązane produkty' })).toBeVisible();
    await capturePage(page, 'product', { fullPage: true });
});

test('cart', async ({ page }) => {
    await addToCart(page, products.headphones);
    await addToCart(page, products.mouse);
    await addToCart(page, products.charger);
    await openCart(page);
    await capturePage(page, 'cart');
});

test('sign in page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByLabel('Adres e-mail').fill(credentials.username);
    await capturePage(page, 'sign-in');
});

test('checkout, orders and account', async ({ page }) => {
    await signIn(page);
    await addToCart(page, products.keyboard);
    await addToCart(page, products.mouse);
    await goToCheckout(page);

    await fillCheckoutForm(page);
    await capturePage(page, 'checkout', { fullPage: true });

    await submitOrder(page);
    await expect(
        page.getByRole('heading', { name: 'Dziękujemy za Twoje zamówienie' })
    ).toBeVisible();
    await capturePage(page, 'order-details', { fullPage: true });

    await page.goto('/account/orders');
    await expect(page.getByRole('heading', { name: 'Moje zamówienia' })).toBeVisible();
    await capturePage(page, 'order-history');

    await page.goto('/account');
    await expect(page.getByText(`Cześć, ${credentials.username}!`)).toBeVisible();
    await capturePage(page, 'account', { fullPage: true });

    await page.goto('/');
    const recommendations = carousel(page, 'Proponowane dla Ciebie');
    await recommendations.scrollIntoViewIfNeeded();
    await captureElement(recommendations, 'recommendations');
});

test('assistant', async ({ page }) => {
    test.skip(!assistantConfigured(), assistantMissingReason);
    await page.goto('/');
    await openChat(page);
    const chat = chatWindow(page);
    await askAssistant(chat, 'Szukam słuchawek do biegania, mam do 1000 zł');
    await waitForAssistantReply(chat);
    await capturePage(page, 'assistant');
});

test('swagger ui', async ({ page }) => {
    await page.goto(`${apiURL}/swagger-ui.html`);
    await expect(page.locator('.opblock').first()).toBeVisible();
    await capturePage(page, 'swagger');
});
