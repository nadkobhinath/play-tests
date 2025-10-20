import { test as baseTest, expect, Page } from '@playwright/test';
import { EnvConfig } from '../../utils/env';

type MyFixtures = {
    loggedInPage: Page;
};

export const test = baseTest.extend<MyFixtures>({
    loggedInPage: async ({ browser }, use) => {
        const page = await browser.newPage();
        await page.goto('/');
        const dismissBannerBtn = page.locator('button[aria-label="Close Welcome Banner"]');

        if (await dismissBannerBtn.isVisible()) {
            await dismissBannerBtn.click();
        }

        const dismissCookieBtn = page.locator('a[aria-label="dismiss cookie message"]');
        dismissCookieBtn.waitFor({ timeout: 5000 });

        if (await dismissCookieBtn.isVisible()) {
            await dismissCookieBtn.click();
        }

        await page.getByRole('button', { name: 'Show/hide account menu' }).click();
        await page.locator('button#navbarLoginButton').click();

        await page.fill('#email', process.env.EMAIL!);
        await page.fill('#password', process.env.PASSWORD!);
        await page.locator('button#loginButton').click();
        await page.waitForURL('**/search');


        

        await use(page);

        await page.close();
    },
});

export { expect };
