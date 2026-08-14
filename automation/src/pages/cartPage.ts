import type { Page } from '@playwright/test';
import { AddItemForm } from '@src/components/addItemForm.js';
import { CartList } from '@src/components/cartList.js';
import { DiscountForm } from '@src/components/discountForm.js';
import { OrderSummary } from '@src/components/orderSummary.js';

export class CartPage {
  readonly addItemForm: AddItemForm;
  readonly cartList: CartList;
  readonly discountForm: DiscountForm;
  readonly orderSummary: OrderSummary;

  constructor(private page: Page) {
    this.addItemForm = new AddItemForm(this.page);
    this.cartList = new CartList(this.page);
    this.discountForm = new DiscountForm(this.page);
    this.orderSummary = new OrderSummary(this.page);
  }
}
