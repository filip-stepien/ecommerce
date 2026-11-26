import { expect, test, type Page } from '@playwright/test';
import {
    apiURL,
    carousel,
    fetchOrders,
    fetchProducts,
    placeOrder,
    productCards,
    products,
    signIn
} from '../support.ts';

async function recommendedOnHomePage(page: Page) {
    await page.goto('/');
    const section = carousel(page, 'Proponowane dla Ciebie');
    await expect.poll(async () => (await productCards(section)).length).toBeGreaterThan(0);
    return productCards(section);
}

test.describe('recommendations (6.3)', () => {
    test('shows bestsellers to guests', async ({ page, request }) => {
        const response = await request.get(`${apiURL}/api/products/recommended`);
        const bestsellers = (await response.json()) as { id: number }[];

        const cards = await recommendedOnHomePage(page);
        expect(cards.map(card => card.id)).toEqual(bestsellers.map(product => product.id));
    });

    test('recommends only available products', async ({ page, request }) => {
        const cards = await recommendedOnHomePage(page);
        const details = await fetchProducts(
            request,
            cards.map(card => card.id)
        );
        expect(details.filter(product => product.stock === 0)).toEqual([]);
    });

    test('recommends products like the purchased ones and skips bought ones', async ({
        page,
        request
    }) => {
        await signIn(page);
        await placeOrder(page, [products.keyboard]);
        const orders = await fetchOrders(page, request);
        const boughtIds = new Set(
            orders
                .filter(order => order.status === 'PAID')
                .flatMap(order => order.items.map(item => item.productId))
        );
        const bought = await fetchProducts(request, [...boughtIds]);

        const cards = await recommendedOnHomePage(page);
        expect(cards.filter(card => boughtIds.has(card.id))).toEqual([]);
        const [first] = await fetchProducts(request, [cards[0].id]);
        expect(
            bought.some(
                product => product.category === first.category || product.brand === first.brand
            )
        ).toBe(true);
    });

    test.fixme('shows products based on recently viewed ones', async ({ page, request }) => {
        await signIn(page);
        await page.goto(`/products/${products.laptop.id}`);
        await page.goto('/');

        const section = carousel(page, 'Na podstawie oglądanych');
        await expect.poll(async () => (await productCards(section)).length).toBeGreaterThan(0);
        const details = await fetchProducts(
            request,
            (await productCards(section)).map(card => card.id)
        );
        expect(details.every(product => product.category === 'Laptopy')).toBe(true);
    });
});
