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

export const TYPE_CONFUSION_DISCOUNT_CODE = { toString: () => 'SAVE10' };

export const MALFORMED_ITEM_PAYLOADS = {
  NAME_AS_NUMBER: { name: 123, price: 10, quantity: 1 },
  PRICE_AS_STRING: { name: 'Test Item', price: '19.99', quantity: 1 },
  QUANTITY_AS_STRING: { name: 'Test Item', price: 19.99, quantity: '2' },
  PRICE_AS_ARRAY: { name: 'Test Item', price: [10], quantity: 1 },
} as const;
