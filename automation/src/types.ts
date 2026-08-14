import type { APIResponse } from '@playwright/test';

export interface CreateItemPayload {
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem extends CreateItemPayload {
  id: string;
}

export interface CartItemSummary extends CartItem {
  subtotal: number;
}

export interface CartSummary {
  items: CartItemSummary[];
  subtotal: number;
  discountCode: string | null;
  discount: number;
  total: number;
}

export interface CreateCartResponse {
  cartId: string;
}

export interface ApplyDiscountResponse {
  message: string;
  discount: string;
}

export interface ErrorResponse {
  error: string;
}

export interface HealthCheckResponse {
  status: string;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  raw: APIResponse;
}
