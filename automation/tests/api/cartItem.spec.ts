import { ERROR_MESSAGES, NON_EXISTENT_ID } from '@src/constants.js';
import { test, expect } from '@src/fixtures.js';
import { expectError, expectStatus, expectSuccess } from '@src/utils/assertions.js';

test.describe('Cart Item API - Positive', () => {
  test('should successfully add an item to the cart', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const newItem = cartItemBuilder.build();

    const addResponse = await apiClient.addItem(cartId, newItem);

    await expectStatus(addResponse, 201);
    expectSuccess(addResponse);

    await test.step('Verify the added item matches the expected structure', async () => {
      expect(addResponse.data).toMatchObject({
        name: newItem.name,
        price: newItem.price,
        quantity: newItem.quantity,
      });
      expect(addResponse.data.id).toBeDefined();
    });

    const getCartResponse = await apiClient.getCart(cartId);
    expectSuccess(getCartResponse);

    await test.step('Verify the cart summary reflects the added item', async () => {
      const expectedTotal = newItem.price * newItem.quantity;

      expect(getCartResponse.data.subtotal).toBeCloseTo(expectedTotal);
      expect(getCartResponse.data.total).toBeCloseTo(expectedTotal);
      expect(getCartResponse.data.items).toHaveLength(1);
    });
  });

  test('should successfully remove an item from the cart', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const newItem = cartItemBuilder.build();
    const addResponse = await apiClient.addItem(cartId, newItem);
    expectSuccess(addResponse);
    const itemId = addResponse.data.id;

    const deleteResponse = await apiClient.removeItem(cartId, itemId);
    await expectStatus(deleteResponse, 204);

    const getCartResponse = await apiClient.getCart(cartId);
    expectSuccess(getCartResponse);
    const cartItems = getCartResponse.data.items;

    await test.step('Verify the cart is empty after removing the item', async () => {
      expect(cartItems).toHaveLength(0);
    });
  });
});

test.describe('Cart Item API - Negative', () => {
  test('should return 404 when adding an item to a non-existent cart', async ({
    apiClient,
    cartItemBuilder,
  }) => {
    const newItem = cartItemBuilder.build();
    const addResponse = await apiClient.addItem(NON_EXISTENT_ID, newItem);

    await expectStatus(addResponse, 404);
  });

  test('should return 400 when adding item with invalid name', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const invalidItem = cartItemBuilder.withName('').build();

    const addItemResponse = await apiClient.addItem(cartId, invalidItem);

    await expectStatus(addItemResponse, 400);

    await test.step('Verify the response data contains the expected error message for invalid name', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_NAME });
    });
  });

  test('should return 400 when adding item with negative price', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const invalidItem = cartItemBuilder.build();
    invalidItem.price = invalidItem.price * -1;

    const addItemResponse = await apiClient.addItem(cartId, invalidItem);

    await expectStatus(addItemResponse, 400);
    expectError(addItemResponse);

    await test.step('Verify the response data contains the expected error message for invalid price', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_PRICE });
    });
  });

  test('should return 400 when adding item with zero quantity', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const invalidItem = cartItemBuilder.withQuantity(0).build();

    const addItemResponse = await apiClient.addItem(cartId, invalidItem);

    await expectStatus(addItemResponse, 400);

    await test.step('Verify the response data contains the expected error message for invalid quantity', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_QUANTITY });
    });
  });

  test('should return 400 when adding item with negative quantity', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const invalidItem = cartItemBuilder.build();
    invalidItem.quantity = invalidItem.quantity * -1;

    const addItemResponse = await apiClient.addItem(cartId, invalidItem);

    await expectStatus(addItemResponse, 400);
    expectError(addItemResponse);

    await test.step('Verify the response data contains the expected error message for invalid quantity', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_QUANTITY });
    });
  });

  test('should return 400 when adding an item without name field', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const incompleteItem = cartItemBuilder.build();
    delete (incompleteItem as { name?: string }).name;

    const addItemResponse = await apiClient.addItem(cartId, incompleteItem);

    await expectStatus(addItemResponse, 400);

    await test.step('Verify the response data contains the expected error message for missing name', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_NAME });
    });
  });

  test('should return 400 when adding an item without price field', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const incompleteItem = cartItemBuilder.build();
    delete (incompleteItem as { price?: number }).price;

    const addItemResponse = await apiClient.addItem(cartId, incompleteItem);

    await expectStatus(addItemResponse, 400);

    await test.step('Verify the response data contains the expected error message for missing price', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_PRICE });
    });
  });

  test('should return 400 when adding an item without quantity field', async ({
    apiClient,
    cartItemBuilder,
    cartId,
  }) => {
    const incompleteItem = cartItemBuilder.build();
    delete (incompleteItem as { quantity?: number }).quantity;

    const addItemResponse = await apiClient.addItem(cartId, incompleteItem);

    await expectStatus(addItemResponse, 400);

    await test.step('Verify the response data contains the expected error message for missing quantity', async () => {
      expect(addItemResponse.data).toEqual({ error: ERROR_MESSAGES.INVALID_QUANTITY });
    });
  });

  test('should return 404 when removing a non-existent item from cart', async ({
    apiClient,
    cartId,
  }) => {
    const removeItemResponse = await apiClient.removeItem(cartId, NON_EXISTENT_ID);
    await expectStatus(removeItemResponse, 404);

    await test.step('Verify the response data contains the expected error message for non-existent item', async () => {
      expect(removeItemResponse.data).toEqual({ error: ERROR_MESSAGES.ITEM_NOT_FOUND });
    });
  });
});
