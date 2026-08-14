import { test, expect } from '@src/fixtures.js';
import { expectRangeUnderflow } from '@src/utils/assertions.js';

test.describe('Discount Form & UI Edge Cases', () => {
  test('should apply discount code successfully and update total summary', async ({
    cartPage,
    cartItemBuilder,
  }) => {
    const item = cartItemBuilder.withPrice(100).withQuantity(1).build();
    await cartPage.addItemForm.addItem(item.name, String(item.price), String(item.quantity));

    await cartPage.discountForm.applyDiscount('SAVE20');

    await test.step('Verify discount is applied and total reflects the reduction', async () => {
      await expect(cartPage.orderSummary.discountLabel).toContainText('20.00');
      await expect(cartPage.orderSummary.totalLabel).toContainText('80.00');
    });
  });

  test('should block submission on zero or negative quantity', async ({
    cartPage,
    cartItemBuilder,
  }) => {
    const { name, price } = cartItemBuilder.build();

    await cartPage.addItemForm.addItem(name, String(price), '0');

    await test.step('Verify submission is blocked for zero quantity', async () => {
      const cartItemsCount = await cartPage.cartList.getCartItemsCount();
      expect(cartItemsCount).toBe(0);
      await expectRangeUnderflow(cartPage.addItemForm.itemQuantityInput);
    });
  });
});
