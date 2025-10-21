import { test, expect } from './fixtures';

test.describe('Product listing, Basket and Checkout tests', () => {
    test('shall get product quantities', async ({ authRequest }) => {
        const response = await authRequest.get(`/api/Quantitys`);
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(Array.isArray(data.data)).toBeTruthy();
        expect(data.data.length).toBeGreaterThan(0);
    });

    test('shall add a product to basket', async ({ authRequest, bid }) => {
        const response = await authRequest.get(`/api/Quantitys`);
        const data = await response.json();
        const productLimitProduct = data.data.find((p: any) => p.limitPerUser > 0);

        const addToBasketResponse = await authRequest.post('/api/BasketItems', {
            data: {
                BasketId: bid,
                ProductId: productLimitProduct.id,
                quantity: 1
            }
        });

        expect(addToBasketResponse.ok()).toBeTruthy();
    });

    test('shall increase the quantity of a product to basket', async ({ authRequest, bid }) => {
        const response = await authRequest.get(`/api/Quantitys`);
        const data = await response.json();
        const productLimitProduct = data.data.find((p: any) => p.limitPerUser > 0);

        const addFirstProductToBasketResponse = await authRequest.post('/api/BasketItems', {
            data: {
                BasketId: bid,
                ProductId: productLimitProduct.id,
                quantity: 1
            }
        });

        expect(addFirstProductToBasketResponse.ok()).toBeTruthy();

        const addMoreProductToBasketResponse = await authRequest.put(`/api/BasketItems/${productLimitProduct.id}`, {
            data: {
                quantity: 2
            }
        });

        expect(addMoreProductToBasketResponse.ok()).toBeTruthy();
    });


    test('shall NOT increase the quantity of a product more than the permitted quantity', async ({ authRequest, bid }) => {
        const response = await authRequest.get(`/api/Quantitys`);
        const data = await response.json();
        const productLimitProduct = data.data.find((p: any) => p.limitPerUser > 0);

        const addFirstProductToBasketResponse = await authRequest.post('/api/BasketItems', {
            data: {
                BasketId: bid,
                ProductId: productLimitProduct.id,
                quantity: 1
            }
        });

        expect(addFirstProductToBasketResponse.ok()).toBeTruthy();

        const addMoreProductToBasketResponse = await authRequest.put(`/api/BasketItems/${productLimitProduct.id}`, {
            data: {
                quantity: productLimitProduct.limitPerUser + 1
            }
        });

        expect(addMoreProductToBasketResponse.status()).toBe(400);
    });

    test('Unauthorised user shall NOT add a product to basket', async ({ authRequest, bid }) => {
        const response = await authRequest.get(`/api/Quantitys`);
        const data = await response.json();
        const productLimitProduct = data.data.find((p: any) => p.limitPerUser > 0);

        const addToBasketResponse = await authRequest.post('/api/BasketItems', {
            data: {
                BasketId: bid,
                ProductId: productLimitProduct.id,
                quantity: 1
            },
            headers: {
                Authorization: `Bearer randomtext`
            }
        });

        expect(addToBasketResponse.status()).toBe(401);
    });

    test('An order shall be placed successfully', async ({ authRequest, bid }) => {
        const response = await authRequest.get(`/api/Quantitys`);
        const data = await response.json();
        const productLimitProduct = data.data.find((p: any) => p.limitPerUser > 0);

        const addToBasketResponse = await authRequest.post('/api/BasketItems', {
            data: {
                BasketId: bid,
                ProductId: productLimitProduct.id,
                quantity: 1
            }
        });

        expect(addToBasketResponse.ok()).toBeTruthy();

        const addressResponse = await authRequest.get(`/api/addresss`);
        const addressResponseJson = await addressResponse.json();
        const addressId = addressResponseJson.data[0].id;

        const deliveriesResponse = await authRequest.get(`/api/Deliverys`);
        const deliveriesResponseJson = await deliveriesResponse.json();
        const deliveryOptionId = deliveriesResponseJson.data[0].id;

        const cardsResponse = await authRequest.get(`/api/Cards`);
        const cardsResponseJson = await cardsResponse.json();
        const cardOptionId = cardsResponseJson.data[0].id;

        const checkoutResponse = await authRequest.post(`/rest/basket/${bid}/checkout`, {
            data: {
                couponData: "bnVsbA==",
                orderDetails: {
                    paymentId: cardOptionId,
                    addressId: addressId,
                    deliveryMethodId: deliveryOptionId
                }
            }
        });
        expect(addToBasketResponse.ok()).toBeTruthy();

        const checkoutResponseJson = await checkoutResponse.json();
        expect(checkoutResponseJson.orderConfirmation).toBeDefined;
    });

    test.afterEach(async ({ authRequest, bid }) => {
        console.log('Cleaning up after test');
        const basketProductsResponse = await authRequest.get(`/rest/basket/${bid}`)

        const basketProductsJson = await basketProductsResponse.json();
        const basketProducts = await basketProductsJson.data.Products;

        for (const product of basketProducts) {
            const delResponse = await authRequest.delete(`/api/BasketItems/${product.BasketItem.id}`);
            expect(delResponse.status()).toBe(200);
        }
    });
});
