import { test, expect } from '@src/fixtures.js';
import { expectStatus, expectSuccess } from '@src/utils/assertions.js';
import { roundCurrency } from '@src/utils/currency.js';

test.describe('Cart Calculation API - Positive', () => {
  test('should correctly calculate subtotal and total for multiple items', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const itemA = cartItemBuilder.withPrice(19.99).withQuantity(2).build();
    const itemB = cartItemBuilder.withPrice(5.5).withQuantity(3).build();

    await apiClient.addItem(cartId, itemA);
    await apiClient.addItem(cartId, itemB);

    const getCartResponse = await apiClient.getCart(cartId);

    await expectStatus(getCartResponse, 200);
    expectSuccess(getCartResponse);

    const expectedSubtotal = roundCurrency(
      itemA.price * itemA.quantity + itemB.price * itemB.quantity,
    );

    await test.step('Verify the response data contains the correct subtotal, discount, and total', async () => {
      expect(getCartResponse.data.subtotal).toBe(expectedSubtotal);
      expect(getCartResponse.data.discount).toBe(0);
      expect(getCartResponse.data.total).toBe(expectedSubtotal);
    });
  });

  test('should recalculate total sum after removing an item', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const itemA = cartItemBuilder.withPrice(12.25).withQuantity(4).build();
    const itemB = cartItemBuilder.withPrice(8.75).withQuantity(2).build();

    await apiClient.addItem(cartId, itemA);
    const addResponseB = await apiClient.addItem(cartId, itemB);
    expectSuccess(addResponseB);

    await apiClient.removeItem(cartId, addResponseB.data.id);

    const getCartResponse = await apiClient.getCart(cartId);

    await expectStatus(getCartResponse, 200);
    expectSuccess(getCartResponse);
    const expectedSubtotal = roundCurrency(itemA.price * itemA.quantity);

    await test.step('Verify the response data contains the correct subtotal, discount, and total', async () => {
      expect(getCartResponse.data.subtotal).toBe(expectedSubtotal);
      expect(getCartResponse.data.total).toBe(expectedSubtotal);
      expect(getCartResponse.data.items).toHaveLength(1);
    });
  });
});

test.describe('Cart Calculation API - Negative', () => {
  // TODO: create a bug report for this issue, as the API should correctly apply discount to multiple items instead of only one
  test.fail(
    'should apply discount correctly to multiple items in the cart',
    async ({ apiClient, cartItemBuilder, cartId }) => {
      const itemA = cartItemBuilder.withPrice(20).withQuantity(2).build();
      const itemB = cartItemBuilder.withPrice(10).withQuantity(1).build();

      await apiClient.addItem(cartId, itemA);
      await apiClient.addItem(cartId, itemB);

      await apiClient.applyDiscount(cartId, 'SAVE10');

      const getCartResponse = await apiClient.getCart(cartId);

      await expectStatus(getCartResponse, 200);
      expectSuccess(getCartResponse);

      const expectedSubtotal = roundCurrency(
        itemA.price * itemA.quantity + itemB.price * itemB.quantity,
      );
      const expectedDiscount = roundCurrency(expectedSubtotal * 0.1);
      const expectedTotal = roundCurrency(expectedSubtotal - expectedDiscount);

      await test.step('Verify the response data contains the correct subtotal, discount, and total', async () => {
        expect(getCartResponse.data.subtotal).toBe(expectedSubtotal);
        expect(getCartResponse.data.discount).toBe(expectedDiscount);
        expect(getCartResponse.data.total).toBe(expectedTotal);
      });
    },
  );
});

test.describe('Cart Calculation API - Edge Cases', () => {
  test('should not apply discount or change totals on an empty cart', async ({
    apiClient,
    cartId,
  }) => {
    await apiClient.applyDiscount(cartId, 'SAVE20');

    const getCartResponse = await apiClient.getCart(cartId);

    await expectStatus(getCartResponse, 200);
    expectSuccess(getCartResponse);

    await test.step('Verify the response data contains zero subtotal, discount, and total', async () => {
      expect(getCartResponse.data.subtotal).toBe(0);
      expect(getCartResponse.data.discount).toBe(0);
      expect(getCartResponse.data.total).toBe(0);
    });
  });

  test('should handle decimal price rounding correctly with discount', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const item = cartItemBuilder.withPrice(9.99).withQuantity(3).build();

    await apiClient.addItem(cartId, item);
    await apiClient.applyDiscount(cartId, 'SAVE10');

    const getCartResponse = await apiClient.getCart(cartId);

    await expectStatus(getCartResponse, 200);
    expectSuccess(getCartResponse);

    const expectedSubtotal = roundCurrency(item.price * item.quantity);
    const expectedDiscount = roundCurrency(expectedSubtotal * 0.1);
    const expectedTotal = roundCurrency(expectedSubtotal - expectedDiscount);

    await test.step('Verify the response data contains correctly rounded decimal totals', async () => {
      expect(getCartResponse.data.subtotal).toBe(expectedSubtotal);
      expect(getCartResponse.data.discount).toBe(expectedDiscount);
      expect(getCartResponse.data.total).toBe(expectedTotal);
    });
  });
});
