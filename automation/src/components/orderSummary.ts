import type { Locator, Page } from '@playwright/test';

export class OrderSummary {
  private readonly container: Locator;
  readonly subtotalLabel: Locator;
  readonly discountLabel: Locator;
  readonly totalLabel: Locator;

  constructor(private page: Page) {
    this.container = this.page.locator('.summary');
    this.subtotalLabel = this.container.locator('#subtotal');
    this.discountLabel = this.container.locator('#discount');
    this.totalLabel = this.container.locator('#total');
  }
}
