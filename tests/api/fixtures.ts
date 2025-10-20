import { test as base, request as playwrightRequest, APIRequestContext, expect } from '@playwright/test';

type AuthFixtures = {
  authRequest: APIRequestContext;
  authToken: string;
  bid: number;
};

export { expect };

export const test = base.extend<AuthFixtures>({
  authRequest: async ({}, use, testInfo) => {
    const requestContext = await playwrightRequest.newContext({
      baseURL: process.env.BASE_URL,
    });

    const loginResponse = await requestContext.post('/rest/user/login', {
      data: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    const body = await loginResponse.json();
    const token = body.authentication.token;
    const bid = body.authentication.bid;

    testInfo.attach('auth-basket-id', { body: `Basket ID: ${bid}` });

    const authContext = await playwrightRequest.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    await use(Object.assign(authContext, { bid }));

    await authContext.dispose();
    await requestContext.dispose();
  },

  authToken: async ({ authRequest }, use) => {
    await use((authRequest as any).token || '');
  },

  bid: async ({ authRequest }, use) => {
    await use((authRequest as any).bid || '');
  },
});
