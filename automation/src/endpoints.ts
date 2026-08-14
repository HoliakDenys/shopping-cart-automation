export const API_ENDPOINTS = {
  HEALTH: '/health',
  CART: '/cart',
  CART_BY_ID: (cartId: string) => `/cart/${cartId}`,
  CART_ITEMS: (cartId: string) => `/cart/${cartId}/items`,
  CART_ITEM_BY_ID: (cartId: string, itemId: string) => `/cart/${cartId}/items/${itemId}`,
  CART_DISCOUNT: (cartId: string) => `/cart/${cartId}/discount`,
} as const;
