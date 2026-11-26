import { expect, test, type Page } from '@playwright/test';
import {
    carousel,
    fetchProduct,
    fetchProducts,
    formatPrice,
    productCards,
    products
} from '../support.ts';

async function relatedProducts(page: Page) {
    const related = carousel(page, 'Powiązane produkty');
    await expect.poll(async () => (await productCards(related)).length).toBeGreaterThan(0);
    return productCards(related);
}

test.describe('product card (5)', () => {
    test('shows images, price, description and specification', async ({ page, request }) => {
        const product = await fetchProduct(request, products.headphones.id);
        await page.goto(`/products/${product.id}`);

        const main = page.locator('main');
        await expect(main.getByRole('heading', { level: 1, name: product.name })).toBeVisible();
        await expect(main.getByRole('button', { name: /^Zdjęcie \d+$/ })).toHaveCount(
            product.images.length
        );
        await expect(
            main.getByText(formatPrice(product.price), { exact: true }).first()
        ).toBeVisible();
        await expect(main.getByText(product.description)).toBeVisible();
        for (const specification of product.specifications) {
            await expect(main.getByText(specification.name, { exact: true })).toBeVisible();
            await expect(main.getByText(specification.value, { exact: true })).toBeVisible();
        }
    });

    test('shows similar products from the same category', async ({ page, request }) => {
        await page.goto(`/products/${products.headphones.id}`);
        const related = await relatedProducts(page);
        const details = await fetchProducts(
            request,
            related.map(card => card.id)
        );

        expect(related.map(card => card.id)).not.toContain(products.headphones.id);
        expect(details.map(product => product.category)).toEqual(details.map(() => 'Słuchawki'));
    });

    test.fail('leaves unavailable products out of similar products', async ({ page, request }) => {
        await page.goto(`/products/${products.headphones.id}`);
        const related = await relatedProducts(page);
        const details = await fetchProducts(
            request,
            related.map(card => card.id)
        );

        expect(details.filter(product => product.stock === 0)).toEqual([]);
    });

    test('reports a missing product', async ({ page }) => {
        await page.goto('/products/999999');
        await expect(page.getByText('Nie udało się pobrać produktu')).toBeVisible();
    });

    test.fixme('shows availability', async ({ page }) => {
        await page.goto(`/products/${products.headphones.id}`);
        await expect(page.locator('main').getByText(/^dostępny/i)).toBeVisible();

        await page.goto(`/products/${products.soldOutEarbuds.id}`);
        await expect(page.locator('main').getByText(/^niedostępny/i)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dodaj do koszyka' }).first()).toBeDisabled();
    });

    test.fixme('shows products frequently bought together', async ({ page }) => {
        await page.goto(`/products/${products.iPhone16.id}`);
        const section = carousel(page, 'Często kupowane razem');
        await expect.poll(async () => (await productCards(section)).length).toBeGreaterThan(0);
    });

    test.fixme('shows accessories matching a smartphone (6.5)', async ({ page }) => {
        await page.goto(`/products/${products.iPhone16.id}`);
        const accessories = carousel(page, 'Pasujące akcesoria');
        await expect(accessories.getByText('Apple Silicone Case iPhone 16')).toBeVisible();
        await expect(accessories.getByText(products.iPhone15Case.name)).toHaveCount(0);
    });
});
