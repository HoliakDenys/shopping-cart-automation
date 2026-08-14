import { faker } from '@faker-js/faker';
import type { CreateItemPayload } from '../types.js';

export class CartItemBuilder {
  private item: CreateItemPayload = {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 10, max: 200 })),
    quantity: faker.number.int({ min: 1, max: 5 }),
  };

  withName(name: string): this {
    this.item.name = name;
    return this;
  }

  withPrice(price: number): this {
    this.item.price = price;
    return this;
  }

  withQuantity(quantity: number): this {
    this.item.quantity = quantity;
    return this;
  }

  build(): CreateItemPayload {
    return { ...this.item };
  }
}
