import { test, expect } from '@src/fixtures.js';

test.describe('Cart Display & Totals UI', () => {
  test('should display correct prices, subtotal and total for added items', async ({
    cartPage,
    cartItemBuilder,
  }) => {
    const item = cartItemBuilder.build();
    await cartPage.addItemForm.addItem(item.name, String(item.price), String(item.quantity));

    await test.step('Verify item is displayed and summary totals are correct', async () => {
      const { root, priceLabel } = cartPage.cartList.getCartItem(item.name);
      await expect(root).toBeVisible();

      const expectedTotal = item.price * item.quantity;

      await expect(priceLabel).toContainText(expectedTotal.toFixed(2));
      await expect(cartPage.orderSummary.subtotalLabel).toContainText(expectedTotal.toFixed(2));
      await expect(cartPage.orderSummary.totalLabel).toContainText(expectedTotal.toFixed(2));
    });
  });
});
