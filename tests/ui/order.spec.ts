import { test, expect } from './fixtures';

test.describe('products page tests', () => {
    test('Clicking on add to basket button shall add product to basket', async ({ loggedInPage }) => {
        const page = loggedInPage;
        await page.locator("xpath=//div[contains(.,'Apple Juice')]/../following-sibling::div//button[contains(.,'Add to Basket')]").click();
        await page.locator('button[aria-label="Show the shopping cart"]').click();
        const basketProductName = await page.locator('xpath=//mat-row[1]/mat-cell[2]').textContent();
        expect(basketProductName).toContain('Apple Juice');

        // removing the product from the basket
        await page.locator('xpath=//mat-row[1]/mat-cell[5]//button').click();

    });

    test('Logging out and logging back in shall persist the basket items', async ({ loggedInPage }) => {
        const page = loggedInPage;
        const productShortName = 'Apple Juice';
        await page.locator(`xpath=//div[contains(.,'${productShortName}')]/../following-sibling::div//button[contains(.,'Add to Basket')]`).click();
        await page.locator('button[aria-label="Show the shopping cart"]').click();
        const basketProductName = await page.locator('xpath=//mat-row/mat-cell[2]').textContent();
        expect(basketProductName).toContain(productShortName)

        await page.getByRole('button', { name: 'Show/hide account menu' }).click();
        await page.locator('button#navbarLogoutButton').click();

        await page.getByRole('button', { name: 'Show/hide account menu' }).click();
        await page.locator('button#navbarLoginButton').click();

        await page.fill('#email', process.env.EMAIL!);
        await page.fill('#password', process.env.PASSWORD!);
        await page.locator('button#loginButton').click();
        await page.waitForURL('**/search');
        await page.locator('button[aria-label="Show the shopping cart"]').click();
        const basketProductNameAfterLogin = await page.locator('xpath=//mat-row/mat-cell[2]').textContent();
        expect(basketProductNameAfterLogin).toContain(productShortName);

        // removing the product from the basket
        await page.locator('xpath=//mat-row[1]/mat-cell[5]//button').click();
    });

    test('An Order shall be placed successfully', async ({ loggedInPage }) => {
        const page = loggedInPage;
        await page.locator("xpath=//div[contains(.,'Apple Juice')]/../following-sibling::div//button[contains(.,'Add to Basket')]").click();
        await page.locator('button[aria-label="Show the shopping cart"]').click();
        await page.locator('button#checkoutButton').click();
        await page.waitForURL('**/address/select');
        await page.locator('input[type="radio"]').first().click();
        await page.locator('button[aria-label="Proceed to payment selection"]').click();
        await page.waitForURL('**/delivery-method');
        await page.locator('input[type="radio"]').first().click();
        await page.locator('button[aria-label="Proceed to delivery method selection"]').click();
        await page.waitForURL('**/payment/shop');
        await page.locator('input[type="radio"]').first().click();
        await page.locator('button[aria-label="Proceed to review"]').click();
        await page.locator('button[aria-label="Complete your purchase"]').click();
        const confirmation = await page.locator('h1.confirmation').textContent();
        expect(confirmation).toBe('Thank you for your purchase!');
    });
})

