import type { Locator, Page } from '@playwright/test';
import { Step } from '@src/utils/stepDecorator.js';

export class CartList {
  private readonly container: Locator;
  private readonly cartItem: Locator;
  readonly emptyCartLabel: Locator;

  getCartItem(name: string) {
    const root = this.cartItem.filter({ has: this.page.getByText(name, { exact: true }) });
    return {
      root,
      nameLabel: root.locator('.cart-item-name'),
      priceLabel: root.locator('.cart-item-subtotal'),
      removeButton: root.locator('button:has-text("Remove")'),
    };
  }

  constructor(private page: Page) {
    this.container = this.page.locator('#cartItems');
    this.cartItem = this.container.locator('.cart-item');
    this.emptyCartLabel = this.container.locator('.empty-cart');
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItem.count();
  }

  @Step('Remove item from the cart')
  async removeCartItem(name: string): Promise<void> {
    await this.getCartItem(name).removeButton.click();
  }
}
