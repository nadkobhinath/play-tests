import { test, expect } from '@playwright/test';

test('API test example', async ({ request }) => {
  const response = await request.get('/posts/1');
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty('id', 1);
});
