export const DEFAULT_EMPTY_CART_SUMMARY = {
  items: [],
  subtotal: 0,
  discountCode: null,
  discount: 0,
  total: 0,
};

export const ERROR_MESSAGES = {
  CART_NOT_FOUND: 'Cart not found',
  ITEM_NOT_FOUND: 'Item not found',
  INVALID_NAME: 'Invalid item name',
  INVALID_PRICE: 'Invalid price',
  INVALID_QUANTITY: 'Invalid quantity',
  INVALID_DISCOUNT: 'Invalid discount code',
} as const;

export const CART_NOT_FOUND_RESPONSE = {
  error: ERROR_MESSAGES.CART_NOT_FOUND,
};

export const NON_EXISTENT_ID = '00000000-0000-0000-0000-000000000000';

export const INVALID_CART_ID = 'invalid-cart-id';

export const DISCOUNT_CODES = {
  SAVE10: { code: 'SAVE10', expectedValue: '10%' },
  SAVE20: { code: 'SAVE20', expectedValue: '20%' },
  HALF: { code: 'HALF', expectedValue: '50%' },
} as const;
