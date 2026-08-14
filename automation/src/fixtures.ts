import { test as base } from '@playwright/test';
import { ApiClient } from './apiClient.js';
import { CartItemBuilder } from './data/cartItemBuilder.js';

export const test = base.extend<{
  apiClient: ApiClient;
  cartItemBuilder: CartItemBuilder;
  cartId: string;
}>({
  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    await use(apiClient);
  },

  // eslint-disable-next-line no-empty-pattern
  cartItemBuilder: async ({}, use) => {
    await use(new CartItemBuilder());
  },

  cartId: async ({ apiClient }, use) => {
    const { data } = await apiClient.createCart();
    await use(data.cartId);
  },
});

export const expect = test.expect;
