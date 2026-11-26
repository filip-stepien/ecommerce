import { expect, test } from '@playwright/test';
import {
    assistantConfigured,
    assistantMissingReason,
    capturePage,
    openChat,
    products,
    waitForAssistantReply
} from '../support.ts';

test('mobile catalog', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Wszystkie produkty' })).toBeVisible();
    await page.getByText('Sortuj:').evaluate(element => element.scrollIntoView());
    await capturePage(page, 'mobile-catalog');
});

test('mobile product details', async ({ page }) => {
    await page.goto(`/products/${products.headphones.id}`);
    await expect(
        page.getByRole('heading', { level: 1, name: products.headphones.name })
    ).toBeVisible();
    await capturePage(page, 'mobile-product');
});

test('mobile assistant', async ({ page }) => {
    test.skip(!assistantConfigured(), assistantMissingReason);
    await page.goto('/');
    await openChat(page);
    const chat = page.getByRole('dialog', { name: 'Asystent volt' });
    await chat.getByRole('button', { name: 'Słuchawki do 300 zł' }).click();
    await waitForAssistantReply(chat);
    await capturePage(page, 'mobile-assistant');
});
