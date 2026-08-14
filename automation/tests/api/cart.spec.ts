import {
  CART_NOT_FOUND_RESPONSE,
  DEFAULT_EMPTY_CART_SUMMARY,
  INVALID_CART_ID,
  NON_EXISTENT_ID,
} from '@src/constants.js';
import { test, expect } from '@src/fixtures.js';
import { expectError, expectStatus } from '@src/utils/assertions.js';

test.describe('Cart API - Positive', () => {
  test('should successfully create a cart and retrieve empty cart summary', async ({
    apiClient,
  }) => {
    const createCartResponse = await apiClient.createCart();
    await expectStatus(createCartResponse, 201);

    const getCartResponse = await apiClient.getCart(createCartResponse.data.cartId);
    await expectStatus(getCartResponse, 200);

    await test.step('Verify the retrieved cart summary matches the expected empty cart summary', async () => {
      expect(getCartResponse.data).toEqual(DEFAULT_EMPTY_CART_SUMMARY);
    });
  });
});

test.describe('Cart API - Negative', () => {
  test('should return 404 when retrieving a non-existent cart', async ({ apiClient }) => {
    const getCartResponse = await apiClient.getCart(NON_EXISTENT_ID);
    await expectStatus(getCartResponse, 404);
    expectError(getCartResponse);

    await test.step('Verify the response data matches the expected cart not found response', async () => {
      expect(getCartResponse.data).toEqual(CART_NOT_FOUND_RESPONSE);
    });
  });

  // TODO: create a bug report for this issue, as the API should return 400 for invalid cart IDs instead of 404
  test.fail(
    'should return 400 when retrieving a cart with an invalid ID',
    async ({ apiClient }) => {
      const getCartResponse = await apiClient.getCart(INVALID_CART_ID);
      await expectStatus(getCartResponse, 400);
    },
  );
});
