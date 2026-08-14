import type { APIRequestContext } from '@playwright/test';
import { validateSchema } from './utils/schemaValidator.js';
import {
  addItemResponseSchema,
  createCartResponseSchema,
  discountResponseSchema,
  getCartResponseSchema,
  healthCheckResponseSchema,
  errorResponseSchema,
} from './schemas.js';
import { API_ENDPOINTS } from './endpoints.js';
import type {
  ApiResponse,
  ApplyDiscountResponse,
  CartItem,
  CartSummary,
  CreateCartResponse,
  CreateItemPayload,
  ErrorResponse,
  HealthCheckResponse,
} from './types.js';
import { Step } from './utils/stepDecorator.js';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  private handleResponse(responseStatus: number, data: unknown, successSchema: object): void {
    const schema = responseStatus >= 400 ? errorResponseSchema : successSchema;
    validateSchema(data, schema);
  }

  @Step('Create a new cart')
  async createCart(): Promise<ApiResponse<CreateCartResponse>> {
    const response = await this.request.post(API_ENDPOINTS.CART);
    const data = await response.json();
    this.handleResponse(response.status(), data, createCartResponseSchema);
    return { status: response.status(), data, raw: response };
  }

  @Step('Retrieve cart summary by ID')
  async getCart(cartId: string): Promise<ApiResponse<CartSummary | ErrorResponse>> {
    const response = await this.request.get(API_ENDPOINTS.CART_BY_ID(cartId));
    const data = await response.json();
    this.handleResponse(response.status(), data, getCartResponseSchema);
    return { status: response.status(), data, raw: response };
  }

  @Step('Add an item to the cart')
  async addItem(
    cartId: string,
    item: CreateItemPayload,
  ): Promise<ApiResponse<CartItem | ErrorResponse>> {
    const response = await this.request.post(API_ENDPOINTS.CART_ITEMS(cartId), { data: item });
    const data = await response.json();
    this.handleResponse(response.status(), data, addItemResponseSchema);
    return { status: response.status(), data, raw: response };
  }

  @Step('Remove an item from the cart')
  async removeItem(cartId: string, itemId: string): Promise<ApiResponse<null | ErrorResponse>> {
    const response = await this.request.delete(API_ENDPOINTS.CART_ITEM_BY_ID(cartId, itemId));
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (data !== null) validateSchema(data, errorResponseSchema);

    return { status: response.status(), data, raw: response };
  }

  @Step('Apply discount code to the cart')
  async applyDiscount(
    cartId: string,
    code: string,
  ): Promise<ApiResponse<ApplyDiscountResponse | ErrorResponse>> {
    const response = await this.request.post(API_ENDPOINTS.CART_DISCOUNT(cartId), {
      data: { code },
    });
    const data = await response.json();
    this.handleResponse(response.status(), data, discountResponseSchema);
    return { status: response.status(), data, raw: response };
  }

  @Step('Perform health check')
  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    const response = await this.request.get(API_ENDPOINTS.HEALTH);
    const data = await response.json();
    this.handleResponse(response.status(), data, healthCheckResponseSchema);
    return { status: response.status(), data, raw: response };
  }
}
