import type { Locator, Page } from '@playwright/test';
import { Step } from '@src/utils/stepDecorator.js';

export class AddItemForm {
  private readonly container: Locator;
  readonly itemNameInput: Locator;
  readonly itemPriceInput: Locator;
  readonly itemQuantityInput: Locator;
  private readonly addToCartButton: Locator;

  constructor(private page: Page) {
    this.container = this.page.locator('#addItemForm');
    this.itemNameInput = this.container.locator('#itemName');
    this.itemPriceInput = this.container.locator('#itemPrice');
    this.itemQuantityInput = this.container.locator('#itemQuantity');
    this.addToCartButton = this.container.locator('.btn-primary');
  }

  @Step('Fill item name')
  async fillItemName(name: string): Promise<void> {
    await this.itemNameInput.fill(name);
  }

  @Step('Fill item price')
  async fillItemPrice(price: string): Promise<void> {
    await this.itemPriceInput.fill(price);
  }

  @Step('Fill item quantity')
  async fillItemQuantity(quantity: string): Promise<void> {
    await this.itemQuantityInput.fill(quantity);
  }

  @Step('Submit form')
  async submitForm(): Promise<void> {
    await this.addToCartButton.click();
  }

  async addItem(name: string, price: string, quantity: string): Promise<void> {
    await this.fillItemName(name);
    await this.fillItemPrice(price);
    await this.fillItemQuantity(quantity);
    await this.submitForm();
  }
}
