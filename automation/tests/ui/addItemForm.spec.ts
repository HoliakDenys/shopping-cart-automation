import { test, expect } from '@src/fixtures.js';
import { expectRangeUnderflow } from '@src/utils/assertions.js';

test.describe('Add Item Form - Positive Cases', () => {
  test('should successfully add a valid item and clear the form', async ({
    cartPage,
    cartItemBuilder,
  }) => {
    const { name, price, quantity } = cartItemBuilder.build();
    await cartPage.addItemForm.addItem(name, String(price), String(quantity));

    await test.step('Verify item is added to the cart and form is cleared', async () => {
      const { root, nameLabel } = cartPage.cartList.getCartItem(name);
      await expect(root).toBeVisible();
      await expect(nameLabel).toHaveText(name);

      await expect(cartPage.addItemForm.itemNameInput).toBeEmpty();
      await expect(cartPage.addItemForm.itemPriceInput).toBeEmpty();
      await expect(cartPage.addItemForm.itemQuantityInput).toHaveValue('1');
    });
  });

  test('should display empty state text when no items are added', async ({ cartPage }) => {
    await test.step('Verify empty cart state label is visible and has correct text', async () => {
      await expect(cartPage.cartList.emptyCartLabel).toBeVisible();
      await expect(cartPage.cartList.emptyCartLabel).toHaveText('Your cart is empty');
    });
  });

  test('should successfully remove item from the cart', async ({ cartPage, cartItemBuilder }) => {
    const { name, price, quantity } = cartItemBuilder.build();
    await cartPage.addItemForm.addItem(name, String(price), String(quantity));
    await cartPage.cartList.removeCartItem(name);

    await test.step('Verify cart is empty after item removal', async () => {
      await expect(cartPage.cartList.emptyCartLabel).toBeVisible();
    });
  });
});

test.describe('Add Item Form - Negative Cases', () => {
  test('should block submission on negative price', async ({ cartPage, cartItemBuilder }) => {
    const { name, price, quantity } = cartItemBuilder.build();
    await cartPage.addItemForm.addItem(name, String(-price), String(quantity));

    await test.step('Verify submission is blocked and underflow error is triggered', async () => {
      const cartItemsCount = await cartPage.cartList.getCartItemsCount();
      expect(cartItemsCount).toBe(0);
      await expectRangeUnderflow(cartPage.addItemForm.itemPriceInput);
    });
  });
});
