export const createCartResponseSchema = {
  type: 'object',
  properties: {
    cartId: { type: 'string', format: 'uuid' },
  },
  required: ['cartId'],
  additionalProperties: false,
};

export const getCartResponseSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          quantity: { type: 'number', minimum: 1 },
          subtotal: { type: 'number', minimum: 0 },
        },
        required: ['id', 'name', 'price', 'quantity', 'subtotal'],
        additionalProperties: false,
      },
    },
    subtotal: { type: 'number', minimum: 0 },
    discountCode: { type: ['string', 'null'] },
    discount: { type: 'number', minimum: 0 },
    total: { type: 'number', minimum: 0 },
  },
  required: ['items', 'subtotal', 'discountCode', 'discount', 'total'],
  additionalProperties: false,
};

export const addItemResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    price: { type: 'number', minimum: 0 },
    quantity: { type: 'number', minimum: 1 },
  },
  required: ['id', 'name', 'price', 'quantity'],
  additionalProperties: false,
};

export const healthCheckResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', const: 'ok' },
  },
  required: ['status'],
  additionalProperties: false,
};

export const discountResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    discount: { type: 'string' },
  },
  required: ['message', 'discount'],
  additionalProperties: false,
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
  required: ['error'],
  additionalProperties: false,
};
