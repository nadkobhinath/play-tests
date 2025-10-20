import { test, expect } from '@playwright/test';

test.describe('Login Api Tests', () => {
    const baseUrl = process.env.BASE_URL;

    test('Login shall be successful', async ({ request }) => {
        const payload = {
            email: process.env.EMAIL!,
            password: process.env.PASSWORD!
        };
        const response = await request.post(baseUrl + '/rest/user/login', {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response.status()).toBe(200);
    });

    test('Invalid password shall not log in', async ({ request }) => {
        const payload = {
            email: process.env.EMAIL!,
            password: 'Abc12$2'
        };
        const response = await request.post(baseUrl + '/rest/user/login', {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response.status()).toBe(401);
    });
});

