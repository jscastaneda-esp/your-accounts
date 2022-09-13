import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/auth/login');
	await new Promise((resolve) => setTimeout(resolve, 1500));
	expect(await page.title()).toEqual('Iniciar Sesión');
});
