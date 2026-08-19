# Bug Reports & API Observations

## BUG-01: Discount calculation applies only to the first cart item's subtotal

**Severity:** High

### Description:

When a cart contains multiple items and a promo code is applied (e.g., `SAVE20`), the discount is calculated exclusively based on the subtotal of the first element in the array (`items[0].subtotal`) instead of the overall cart subtotal. As a result, all subsequent items are completely ignored during the discount calculation.

### Steps to Reproduce:

1. Create a new cart.
2. Add Item 1 (e.g., price: 100, quantity: 1 -> subtotal: 100).
3. Add Item 2 (e.g., price: 100, quantity: 1 -> subtotal: 100).
4. Total subtotal reaches 200.
5. Apply the `SAVE20` promo code.

### Expected Result:

- The discount should be calculated from the total subtotal (200 * 0.2 = **40.00**).
- The final total should be **160.00**.

### Actual Result:

- The discount is calculated only for the first item (100 * 0.2 = **20.00**).
- The final total incorrectly resolves to **180.00**.

---

## BUG-02: Lack of validation for whitespace-only names on item creation

**Severity:** Low

### Description:

The item creation endpoint only checks for basic presence (`!name || typeof name !== 'string'`), but fails to filter out strings consisting purely of whitespace (e.g., `"   "`). The backend successfully accepts such titles and creates dummy items in the database.

### Steps to Reproduce:

1. Send a POST request to add an item to the cart.
2. Pass a whitespace-only string in the `name` field (e.g., `"   "`).
3. Provide valid price and quantity.

### Expected Result:

- The backend should reject the request with a `400 Bad Request` status due to invalid item name format.

### Actual Result:

- The item is successfully created and added to the cart with a blank/whitespace name.

---

## BUG-03: Invalid cart ID format returns 404 instead of 400

**Severity:** Low

### Description:

When requesting a cart with a malformed ID format (e.g., `/cart/invalid-id-123`), the backend returns a `404 Not Found` status instead of a proper `400 Bad Request`. This happens because `carts.get()` simply fails to locate the key within the native `Map` without validating the input string format first.

### Steps to Reproduce:

1. Send a GET request to `/cart/invalid-format-id-999`.

### Expected Result:

- The API should return a `400 Bad Request` status indicating that the provided cart ID format is invalid.

### Actual Result:

- The API returns `404 Not Found` because it treats a malformed ID the same way as a non-existent ID in the database.

---

## BUG-04: Extreme price values corrupt cart totals to `null`

**Severity:** High

### Description:

The item creation endpoint accepts arbitrarily large `price` values (e.g.,
`1e308`) without an upper bound check. When the cart summary is later
recalculated, the rounding operation (`Math.round(subtotal * 100) / 100`)
overflows past `Number.MAX_VALUE`, producing `Infinity`. Since
`JSON.stringify(Infinity)` serializes to `null`, the API response for
`subtotal`/`total` silently becomes `null` instead of a number — a value
that violates the endpoint's own response contract.

### Steps to Reproduce:

1. Create a new cart.
2. Add an item with `price: 1e308`, `quantity: 1`.
3. `GET /cart/:cartId`.

### Expected Result:

- The API should reject an out-of-range `price` with `400 Bad Request`,
  or cap it to a sane maximum.

### Actual Result:

- Item creation returns `201`. The subsequent `GET /cart/:cartId` response
  has `subtotal`/`total` as `null`.

---

## BUG-05: Fractional quantity is accepted

**Severity:** Medium

### Description:

The item creation endpoint validates `quantity < 1` but does not check
that the value is an integer. A cart can end up with a nonsensical
fractional quantity (e.g., `1.5` units of an item).

### Steps to Reproduce:

1. Create a new cart.
2. Add an item with `quantity: 1.5`.

### Expected Result:

- The API should return `400 Bad Request` for a non-integer quantity.

### Actual Result:

- The item is created successfully (`201`) with `quantity: 1.5`.
