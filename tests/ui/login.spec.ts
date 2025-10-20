import { test, expect } from './fixtures';

test.describe('Login Tests', () => {
    test('Registered user can Login', async ({ loggedInPage }) => {
        const page = loggedInPage;
        const counterBefore = await page.locator("span.warn-notification").textContent();
        expect(counterBefore).toBe("0");

    });
    test('Invalid password shall not log in', async ({ page }) => {
        await page.goto('/');
        const dismissBtn = page.locator('button[aria-label="Close Welcome Banner"]');

        if (await dismissBtn.isVisible()) {
            await dismissBtn.click();
        }

        await page.getByRole('button', { name: 'Show/hide account menu' }).click();
        await page.locator('button#navbarLoginButton').click();

        await page.fill('#email', process.env.EMAIL!);
        await page.fill('#password', "abc12300!");
        await page.locator('button#loginButton').click();
    })
   
})

