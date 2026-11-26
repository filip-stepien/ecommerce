import { expect, test, type Page } from '@playwright/test';
import { addToCart, products, signIn } from '../support.ts';

const viewports = [
    { name: 'phone', width: 390, height: 844 },
    { name: 'tablet', width: 820, height: 1180 }
];

async function expectNoHorizontalScroll(page: Page) {
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, page.url()).toBeLessThanOrEqual(0);
}

test.describe('responsive interface (8)', () => {
    test('is in Polish', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    });

    for (const viewport of viewports) {
        test.describe(`on a ${viewport.name}`, () => {
            test.use({ viewport: { width: viewport.width, height: viewport.height } });

            test('fits shop pages to the screen width', async ({ page }) => {
                for (const path of ['/', `/products/${products.headphones.id}`]) {
                    await page.goto(path);
                    await expectNoHorizontalScroll(page);
                }
            });

            test('fits customer pages to the screen width', async ({ page }) => {
                await signIn(page);
                await addToCart(page, products.charger);
                for (const path of ['/checkout', '/account', '/account/orders']) {
                    await page.goto(path);
                    await expectNoHorizontalScroll(page);
                }
            });
        });
    }
});
