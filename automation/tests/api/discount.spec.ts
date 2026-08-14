import {
  CART_NOT_FOUND_RESPONSE,
  DISCOUNT_CODES,
  ERROR_MESSAGES,
  NON_EXISTENT_ID,
} from '@src/constants.js';
import { test, expect } from '@src/fixtures.js';
import { expectError, expectStatus, expectSuccess } from '@src/utils/assertions.js';

test.describe('Cart Discount API - Positive', () => {
  for (const { code, expectedValue } of Object.values(DISCOUNT_CODES)) {
    test(`should successfully apply valid discount code: ${code}`, async ({
      apiClient,
      cartId,
    }) => {
      const applyDiscountResponse = await apiClient.applyDiscount(cartId, code);

      await expectStatus(applyDiscountResponse, 200);

      await test.step(`Verify the response data contains the ${expectedValue} discount`, async () => {
        expect(applyDiscountResponse.data).toEqual({
          message: 'Discount code applied',
          discount: expectedValue,
        });
      });

      const getCartResponse = await apiClient.getCart(cartId);
      expectSuccess(getCartResponse);

      await test.step('Verify the retrieved cart contains the applied discount code', async () => {
        expect(getCartResponse.data.discountCode).toBe(code);
      });
    });
  }

  test('should overwrite existing discount code when applying a new one', async ({
    apiClient,
    cartId,
  }) => {
    await apiClient.applyDiscount(cartId, DISCOUNT_CODES.SAVE10.code);
    const newDiscount = DISCOUNT_CODES.HALF;

    const applyDiscountResponse = await apiClient.applyDiscount(cartId, newDiscount.code);
    await expectStatus(applyDiscountResponse, 200);
    expectSuccess(applyDiscountResponse);

    expect(applyDiscountResponse.data.discount).toBe(newDiscount.expectedValue);

    const getCartResponse = await apiClient.getCart(cartId);
    expectSuccess(getCartResponse);

    await test.step('Verify the retrieved cart contains the updated discount code', async () => {
      expect(getCartResponse.data.discountCode).toBe(newDiscount.code);
    });
  });
});

test.describe('Cart Discount API - Negative', () => {
  test('should return 400 when applying non-existent discount code', async ({
    apiClient,
    cartId,
  }) => {
    const applyDiscountResponse = await apiClient.applyDiscount(cartId, 'INVALID100');

    await expectStatus(applyDiscountResponse, 400);
    expectError(applyDiscountResponse);

    await test.step('Verify the response data contains the expected error message for invalid discount code', async () => {
      expect(applyDiscountResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_DISCOUNT });
    });
  });

  test('should return 400 when applying empty discount code', async ({ apiClient, cartId }) => {
    const applyDiscountResponse = await apiClient.applyDiscount(cartId, '');

    await expectStatus(applyDiscountResponse, 400);
    expectError(applyDiscountResponse);

    await test.step('Verify the response data contains the expected error message for invalid discount code', async () => {
      expect(applyDiscountResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_DISCOUNT });
    });
  });

  test('should return 404 when applying discount to a non-existent cart', async ({ apiClient }) => {
    const applyDiscountResponse = await apiClient.applyDiscount(NON_EXISTENT_ID, 'SAVE10');

    await expectStatus(applyDiscountResponse, 404);
    expectError(applyDiscountResponse);

    await test.step('Verify the response data contains the expected error message for non-existent cart', async () => {
      expect(applyDiscountResponse.data).toEqual(CART_NOT_FOUND_RESPONSE);
    });
  });
});
