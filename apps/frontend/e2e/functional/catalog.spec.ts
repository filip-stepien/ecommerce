import { expect, test } from '@playwright/test';
import {
    catalogGrid,
    expectCatalog,
    fetchProduct,
    fetchProducts,
    productCards,
    products,
    selectOption,
    unlabelledSelect
} from '../support.ts';

function isSorted(values: number[]) {
    return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

test.describe('catalog (5)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expectCatalog(page, () => true);
    });

    test('pages through the products', async ({ page }) => {
        const firstPage = await productCards(catalogGrid(page));
        expect(firstPage).toHaveLength(6);

        await page.getByRole('button', { name: '2', exact: true }).click();
        await expectCatalog(page, cards =>
            cards.every(card => !firstPage.some(first => first.id === card.id))
        );

        await selectOption(unlabelledSelect(page, 'Na stronę:'), '12');
        await expectCatalog(page, cards => cards.length === 12);
    });

    test('filters by category', async ({ page, request }) => {
        await selectOption(page.getByRole('combobox', { name: 'Kategoria' }), 'Słuchawki');
        await expectCatalog(page, async cards =>
            (
                await fetchProducts(
                    request,
                    cards.map(card => card.id)
                )
            ).every(product => product.category === 'Słuchawki')
        );
    });

    test('filters by brand', async ({ page, request }) => {
        await selectOption(page.getByRole('combobox', { name: 'Producent' }), 'Logitech');
        await expectCatalog(page, async cards =>
            (
                await fetchProducts(
                    request,
                    cards.map(card => card.id)
                )
            ).every(product => product.brand === 'Logitech')
        );
    });

    test('filters by connectivity', async ({ page, request }) => {
        await selectOption(page.getByRole('combobox', { name: 'Łączność' }), 'Bluetooth');
        await expectCatalog(page, async cards =>
            (
                await fetchProducts(
                    request,
                    cards.map(card => card.id)
                )
            ).every(product => product.connectivity.includes('Bluetooth'))
        );
    });

    test('filters by price range', async ({ page }) => {
        await page.getByPlaceholder('od', { exact: true }).fill('500');
        await page.getByPlaceholder('do', { exact: true }).fill('1000');
        await expectCatalog(page, cards =>
            cards.every(card => card.price >= 500 && card.price <= 1000)
        );
    });

    test('hides unavailable products on request', async ({ page, request }) => {
        await selectOption(page.getByRole('combobox', { name: 'Kategoria' }), 'Słuchawki');
        await expectCatalog(page, cards =>
            cards.some(card => card.id === products.soldOutEarbuds.id)
        );

        await page.getByLabel('Tylko dostępne').check();
        await expectCatalog(page, async cards =>
            (
                await fetchProducts(
                    request,
                    cards.map(card => card.id)
                )
            ).every(product => product.stock > 0)
        );
    });

    test('sorts by price', async ({ page }) => {
        const sort = unlabelledSelect(page, 'Sortuj:');

        await selectOption(sort, 'Cena: od najniższej');
        await expectCatalog(page, cards => isSorted(cards.map(card => card.price)));

        await selectOption(sort, 'Cena: od najwyższej');
        await expectCatalog(page, cards => isSorted(cards.map(card => -card.price)));
    });

    test.fixme('sorts by relevance, newest and popularity', async ({ page }) => {
        await unlabelledSelect(page, 'Sortuj:').click();
        for (const option of [/trafno/i, /najnowsze|nowo/i, /popularn/i]) {
            await expect(page.getByRole('option', { name: option })).toBeVisible();
        }
    });
});

test.describe('search (6.4)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('finds products by name', async ({ page }) => {
        await page.getByPlaceholder('Szukaj produktów…').fill('sony');
        await expectCatalog(page, cards => cards.every(card => /sony/i.test(card.name)));
    });

    test('applies catalog filters and sorting to the results', async ({ page, request }) => {
        await page.getByPlaceholder('Szukaj produktów…').fill('logitech');
        await selectOption(page.getByRole('combobox', { name: 'Kategoria' }), 'Myszy');
        await selectOption(unlabelledSelect(page, 'Sortuj:'), 'Cena: od najniższej');
        await expectCatalog(
            page,
            async cards =>
                isSorted(cards.map(card => card.price)) &&
                (
                    await fetchProducts(
                        request,
                        cards.map(card => card.id)
                    )
                ).every(product => product.brand === 'Logitech' && product.category === 'Myszy')
        );
    });

    test.fixme('finds products by separate words and despite typos', async ({ page }) => {
        const search = page.getByPlaceholder('Szukaj produktów…');

        await search.fill('sony xm5');
        await expectCatalog(page, cards =>
            cards.slice(0, 2).some(card => card.name === products.headphones.name)
        );

        await search.fill('sonny wh1000');
        await expectCatalog(page, cards => cards[0].name === products.headphones.name);
    });

    test.fixme('finds products by the meaning of their description', async ({ page, request }) => {
        await page.getByPlaceholder('Szukaj produktów…').fill('cicha klawiatura do biura');
        await expectCatalog(
            page,
            async cards => (await fetchProduct(request, cards[0].id)).category === 'Klawiatury'
        );
    });

    test.fixme('treats amounts in the query as a price filter', async ({ page }) => {
        const search = page.getByPlaceholder('Szukaj produktów…');

        await search.fill('słuchawki do 300 zł');
        await expectCatalog(page, cards => cards.every(card => card.price <= 300));

        await search.fill('laptop od 1000 do 2000 zł');
        await expectCatalog(page, cards =>
            cards.every(card => card.price >= 1000 && card.price <= 2000)
        );
    });
});
