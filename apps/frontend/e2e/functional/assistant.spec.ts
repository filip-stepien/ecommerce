import { expect, test } from '@playwright/test';
import {
    askAssistant,
    assistantConfigured,
    assistantMissingReason,
    chatWindow,
    fetchProducts,
    openCart,
    openChat,
    productCards,
    products,
    waitForAssistantReply
} from '../support.ts';

test.describe('assistant (6.7)', () => {
    test('is available on every page', async ({ page }) => {
        for (const path of ['/', `/products/${products.headphones.id}`]) {
            await page.goto(path);
            await expect(
                page.getByRole('button', { name: 'Otwórz czat z asystentem' })
            ).toBeVisible();
        }
    });

    test('limits the message length', async ({ page }) => {
        await page.goto('/');
        await openChat(page);
        const chat = chatWindow(page);
        const composer = chat.getByPlaceholder('Jakiego sprzętu szukasz?');

        await composer.fill('a'.repeat(995));
        await composer.pressSequentially('b'.repeat(10));
        await expect(composer).toHaveValue('a'.repeat(995) + 'b'.repeat(5));
        await expect(chat.getByText('1000/1000')).toBeVisible();
    });

    test.describe('on a phone', () => {
        test.use({ viewport: { width: 390, height: 844 } });

        test('opens full screen', async ({ page }) => {
            await page.goto('/');
            await openChat(page);
            const chat = page.getByRole('dialog', { name: 'Asystent volt' });

            await expect
                .poll(async () => {
                    const box = await chat.boundingBox();
                    return box && [box.x, box.y, box.width, box.height].map(Math.round);
                })
                .toEqual([0, 0, 390, 844]);
        });
    });

    test(
        'proposes shop products as cards that can be added to the cart',
        { tag: '@llm' },
        async ({ page, request }) => {
            test.skip(!assistantConfigured(), assistantMissingReason);
            await page.goto('/');
            await openChat(page);
            const chat = chatWindow(page);
            await askAssistant(chat, 'Szukam słuchawek do biegania, mam do 1000 zł');
            await waitForAssistantReply(chat);

            const cards = await productCards(chat);
            const details = await fetchProducts(
                request,
                cards.map(card => card.id)
            );
            expect(cards.map(card => card.price)).toEqual(details.map(product => product.price));
            expect(cards.map(card => card.name)).toEqual(details.map(product => product.name));

            await chat.getByRole('button', { name: 'Dodaj do koszyka' }).first().click();
            await chat.getByRole('button', { name: 'Zamknij czat' }).click();
            const cart = await openCart(page);
            await expect(cart.getByText(cards[0].name)).toBeVisible();
        }
    );

    test.fixme(
        'checks accessory compatibility before proposing accessories (6.5)',
        { tag: '@llm' },
        async ({ page }) => {
            await page.goto('/');
            await openChat(page);
            const chat = chatWindow(page);
            await askAssistant(chat, 'Jakie etui pasuje do iPhone 16?');
            await waitForAssistantReply(chat);

            const cards = await productCards(chat);
            expect(cards.every(card => card.name.includes('iPhone 16'))).toBe(true);
        }
    );

    test.fixme('assembles a bundle within the budget (6.6)', { tag: '@llm' }, async ({ page }) => {
        await page.goto('/');
        await openChat(page);
        const chat = chatWindow(page);
        await askAssistant(chat, 'Mam 5000 zł, potrzebuję stanowiska do pracy z laptopem');
        await waitForAssistantReply(chat);

        const cards = await productCards(chat);
        expect(cards.reduce((sum, card) => sum + card.price, 0)).toBeLessThanOrEqual(5000);
        await expect(chat.getByRole('button', { name: 'Dodaj cały zestaw' })).toBeVisible();
    });
});
