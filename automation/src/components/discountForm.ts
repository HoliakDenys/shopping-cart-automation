import type { Locator, Page } from '@playwright/test';

export class DiscountForm {
  private readonly container: Locator;
  private readonly discountCodeInput: Locator;
  private readonly applyDiscountButton: Locator;

  constructor(private page: Page) {
    this.container = this.page.locator('.discount-form');
    this.discountCodeInput = this.container.locator('#discountCode');
    this.applyDiscountButton = this.container.locator('#applyDiscount');
  }

  async fillDiscountCode(code: string): Promise<void> {
    await this.discountCodeInput.fill(code);
  }

  async submitForm(): Promise<void> {
    await this.applyDiscountButton.click();
  }

  async applyDiscount(code: string): Promise<void> {
    await this.fillDiscountCode(code);
    await this.submitForm();
  }
}
