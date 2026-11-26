import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';

export const screenshotDir = path.resolve(import.meta.dirname, '../../../docs/spr/img');

export const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';

export function assistantConfigured() {
    if (process.env.ANTHROPIC_API_KEY) return true;
    const envFile = path.resolve(import.meta.dirname, '../../backend/.env');
    return existsSync(envFile) && /^ANTHROPIC_API_KEY=\S+/m.test(readFileSync(envFile, 'utf8'));
}

export const assistantMissingReason = 'ANTHROPIC_API_KEY is not set in apps/backend/.env';

export const credentials = {
    username: process.env.E2E_USERNAME ?? 'user',
    password: process.env.E2E_PASSWORD ?? 'password'
};

export type CatalogProduct = { id: number; name: string };

export const products = {
    headphones: { id: 1, name: 'Sony WH-1000XM5' },
    soldOutEarbuds: { id: 4, name: 'Samsung Galaxy Buds3' },
    mouse: { id: 6, name: 'Logitech MX Master 3S' },
    keyboard: { id: 7, name: 'Logitech MX Keys S' },
    charger: { id: 8, name: 'Anker Nano 65W' },
    powerBank: { id: 9, name: 'Anker PowerCore 20000' },
    externalDrive: { id: 14, name: 'Samsung T7 1TB' },
    iPhone16: { id: 28, name: 'Apple iPhone 16' },
    laptop: { id: 41, name: 'Lenovo Legion 5' },
    iPhone15Case: { id: 82, name: 'Spigen Tough Armor iPhone 15' }
} satisfies Record<string, CatalogProduct>;

export type ProductDetails = {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    connectivity: string[];
    images: string[];
    specifications: { name: string; value: string }[];
};

export type CustomerOrder = {
    id: number;
    status: 'PENDING_PAYMENT' | 'PAID' | 'PAYMENT_FAILED';
    items: { productId: number; quantity: number; unitPrice: number }[];
    invoice?: { name: string; taxId?: string };
    deliveryMethod: string;
    deliveryPrice: number;
    paymentMethod: 'blik' | 'card';
    itemsTotal: number;
    total: number;
};

export type CheckoutOptions = {
    deliveryMethods: { id: string; name: string; price: number }[];
};

export type ProductCard = CatalogProduct & { price: number };

async function settle(page: Page) {
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.mantine-Skeleton-root')).toHaveCount(0);
    await expect(page.locator('.mantine-Loader-root')).toHaveCount(0);
    await expect(page.locator('.mantine-Notification-root')).toHaveCount(0);
    await page.waitForFunction(() => Array.from(document.images).every(image => image.complete));
}

export async function capturePage(page: Page, name: string, { fullPage = false } = {}) {
    await settle(page);
    await page.screenshot({
        path: path.join(screenshotDir, `${name}.png`),
        animations: 'disabled',
        fullPage
    });
}

export async function captureElement(locator: Locator, name: string) {
    await settle(locator.page());
    await locator.screenshot({
        path: path.join(screenshotDir, `${name}.png`),
        animations: 'disabled'
    });
}

export function parsePrice(text: string): number {
    return Number(text.replace(/[^\d,]/g, '').replace(',', '.'));
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        useGrouping: 'always'
    }).format(price);
}

export async function selectOption(input: Locator, option: string) {
    await input.click();
    await input.page().getByRole('option', { name: option, exact: true }).click();
}

export function unlabelledSelect(page: Page, caption: string) {
    return page
        .getByText(caption, { exact: true })
        .locator('xpath=..')
        .locator('input:not([type="hidden"])');
}

export function catalogGrid(page: Page) {
    return page
        .locator('.mantine-SimpleGrid-root')
        .filter({ has: page.getByRole('button', { name: 'Dodaj do koszyka' }) });
}

export function carousel(page: Page, title: string) {
    return page
        .locator('div')
        .filter({ has: page.getByRole('heading', { name: title, exact: true }) })
        .filter({ has: page.locator('.mantine-Carousel-root') })
        .last();
}

export async function productCards(container: Locator): Promise<ProductCard[]> {
    const cards = container
        .locator('.mantine-Paper-root')
        .filter({ has: container.page().getByRole('button', { name: 'Dodaj do koszyka' }) });
    const raw = await cards.evaluateAll(elements =>
        elements.map(card => ({
            href: card.querySelector('a[href^="/products/"]')?.getAttribute('href') ?? '',
            texts: Array.from(card.querySelectorAll('p'), text => text.textContent ?? '')
        }))
    );

    return raw.map(({ href, texts }) => ({
        id: Number(href.split('/').pop()),
        name: texts[0],
        price: parsePrice(texts[1])
    }));
}

export async function expectCatalog(
    page: Page,
    matches: (cards: ProductCard[]) => boolean | Promise<boolean>
) {
    await expect
        .poll(async () => {
            const cards = await productCards(catalogGrid(page));
            return cards.length > 0 && (await matches(cards));
        })
        .toBe(true);
}

export async function fetchProduct(request: APIRequestContext, id: number) {
    const response = await request.get(`${apiURL}/api/products/${id}`);
    expect(response.ok()).toBe(true);
    return (await response.json()) as ProductDetails;
}

export async function fetchProducts(request: APIRequestContext, ids: number[]) {
    return Promise.all(ids.map(id => fetchProduct(request, id)));
}

export async function fetchCheckoutOptions(request: APIRequestContext) {
    const response = await request.get(`${apiURL}/api/checkout/options`);
    expect(response.ok()).toBe(true);
    return (await response.json()) as CheckoutOptions;
}

export async function authorization(page: Page) {
    return { Authorization: `Bearer ${await accessToken(page)}` };
}

export async function fetchOrders(page: Page, request: APIRequestContext) {
    const response = await request.get(`${apiURL}/api/orders`, {
        headers: await authorization(page)
    });
    expect(response.ok()).toBe(true);
    return (await response.json()) as CustomerOrder[];
}

export async function fetchOrder(page: Page, request: APIRequestContext, id: number) {
    const response = await request.get(`${apiURL}/api/orders/${id}`, {
        headers: await authorization(page)
    });
    expect(response.ok()).toBe(true);
    return (await response.json()) as CustomerOrder;
}

export async function signIn(page: Page) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByLabel('Adres e-mail').fill(credentials.username);
    await page.getByLabel('Hasło', { exact: true }).fill(credentials.password);
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await expect(page.getByRole('button', { name: 'Moje konto' })).toBeVisible();
}

export async function expectSignInPage(page: Page) {
    await expect(page).toHaveURL(/\/realms\/ecommerce\//);
    await expect(page.getByRole('heading', { name: 'Dobrze Cię widzieć.' })).toBeVisible();
}

export async function accessToken(page: Page): Promise<string> {
    const token = await page.evaluate(() => {
        const entry = Object.entries(sessionStorage).find(([key]) => key.startsWith('oidc.user:'));
        return entry ? (JSON.parse(entry[1]) as { access_token: string }).access_token : null;
    });
    expect(token).toBeTruthy();
    return token!;
}

export async function addToCart(page: Page, product: CatalogProduct, quantity = 1) {
    await page.goto(`/products/${product.id}`);
    await expect(page.getByRole('heading', { level: 1, name: product.name })).toBeVisible();
    if (quantity !== 1) await page.locator('main').getByRole('textbox').fill(String(quantity));
    await page.getByRole('button', { name: 'Dodaj do koszyka' }).first().click();
    await expect(page.getByText('Dodano do koszyka').first()).toBeVisible();
}

export async function openCart(page: Page) {
    await page.getByRole('button', { name: /^(\d+ )?Koszyk$/ }).click();
    const cart = page.getByRole('dialog', { name: 'Koszyk' });
    await expect(cart).toBeVisible();
    return cart;
}

export async function goToCheckout(page: Page) {
    const cart = await openCart(page);
    await cart.getByRole('link', { name: 'Przejdź do podsumowania' }).click();
}

export const deliveryAddress = {
    street: 'Długa',
    houseNumber: '12/4',
    postalCode: '00-238',
    city: 'Warszawa'
};

export async function fillCheckoutForm(page: Page) {
    await page.getByLabel('Imię', { exact: true }).fill('Anna');
    await page.getByLabel('Nazwisko', { exact: true }).fill('Kowalska');
    await page.getByLabel('Adres e-mail').fill('anna.kowalska@example.com');
    await page.getByLabel('Telefon').fill('600 100 200');
    await page.getByLabel('Ulica').fill(deliveryAddress.street);
    await page.getByLabel('Nr domu / lokalu').fill(deliveryAddress.houseNumber);
    await page.getByLabel('Kod pocztowy').fill(deliveryAddress.postalCode);
    await page.getByLabel('Miasto').fill(deliveryAddress.city);
}

export async function submitOrder(page: Page): Promise<number> {
    await page.getByRole('button', { name: 'Zamawiam i płacę' }).click();
    await expect(page).toHaveURL(/\/account\/orders\/\d+$/);
    return Number(page.url().split('/').pop());
}

export async function placeOrder(page: Page, items: CatalogProduct[]): Promise<number> {
    for (const item of items) await addToCart(page, item);
    await goToCheckout(page);
    await fillCheckoutForm(page);
    return submitOrder(page);
}

export async function openChat(page: Page) {
    await page.getByRole('button', { name: 'Otwórz czat z asystentem' }).click();
}

export function chatWindow(page: Page) {
    return page
        .locator('.mantine-Paper-root')
        .filter({ has: page.getByRole('button', { name: 'Zamknij czat' }) });
}

export async function askAssistant(chat: Locator, message: string) {
    const composer = chat.getByPlaceholder('Jakiego sprzętu szukasz?');
    await composer.fill(message);
    await composer.press('Enter');
}

export async function waitForAssistantReply(chat: Locator) {
    await expect(chat.getByRole('button', { name: 'Dodaj do koszyka' }).first()).toBeVisible({
        timeout: 120_000
    });
    await expect(chat.getByRole('button', { name: 'Wyślij wiadomość' })).toBeVisible({
        timeout: 120_000
    });
}
