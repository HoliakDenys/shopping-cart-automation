# Shopping Cart API

A simple shopping cart application with discount code functionality.

## Features

- Create a shopping cart
- Add items with name, price, and quantity
- Remove items from cart
- Apply discount codes (SAVE10, SAVE20, HALF)
- View order summary with subtotal, discount, and total

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Start the Application

```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

### Stop the Application

```bash
docker-compose down
```

## Running Locally (without Docker)

### Prerequisites

- Node.js 18+

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm start
```

## API Endpoints

### Create Cart

```
POST /cart
```

**Response:** `{ "cartId": "uuid" }`

### Get Cart

```

GET /cart/:cartId
```

**Response:** `{ "items": [...], "subtotal": 0, "discount": 0, "total": 0 }`

### Add Item

```
POST /cart/:cartId/items
```

**Body:** `{ "name": "string", "price": number, "quantity": number }`

### Remove Item

```
DELETE /cart/:cartId/items/:itemId

```

### Apply Discount

```

POST /cart/:cartId/discount
```

**Body:** `{ "code": "SAVE10" | "SAVE20" | "HALF" }`

### Health Check

```

GET /health
```

## Discount Codes

| Code   | Discount |
| ------ | -------- |
| SAVE10 | 10% off  |
| SAVE20 | 20% off  |
| HALF   | 50% off  |

## Automation Test Suite

This repository contains an end-to-end and API automation test suite built using Playwright with TypeScript, designed to validate functionality, edge cases, and business requirements for the Shopping Cart application.

### Architecture & Quality Engineering Standards

- **Page Object Model (POM):** UI components and page interactions are encapsulated into modular page objects (`cartPage`, `addItemForm`, `cartList`, `orderSummary`, `discountForm`)
- **Custom Fixtures:** Standardized test context, pre-created cart lifecycle, and API client injection via Playwright fixtures (`fixtures.ts`)
- **Builder Pattern:** Fluent interface data generation (`cartItemBuilder.ts`) to produce flexible valid/invalid payloads

- **Assertions Layer:** Centralized helper assertions for HTTP status codes, error models, and DOM properties (`assertions.ts`)

#### Code Quality & Tooling

- **ESLint & Prettier:** Strict formatting and static analysis

- **Husky:** Pre-commit hooks for automated linting and formatting
- **CI/CD Integration:** Automated GitHub Actions workflow (`.github/workflows/playwright.yml`) executing tests on every pull request
- **Defect Tracking:** Identified system bugs are fully documented with reproduction steps in [BUGS.md](BUGS.md)

### Detailed Test Coverage Breakdown

#### 1. API Test Suite (`tests/api/`)

**Cart Lifecycle & Health Check** (`cart.spec.ts`, `health.spec.ts`):

- `POST /cart` & `GET /cart/:cartId`: Successful cart creation and initial empty cart state retrieval
- `GET /health`: Server health check returning 200 OK
- Negative Cases: 404 response for non-existent cart IDs; identified a defect where malformed cart IDs return 404 instead of the expected 400 validation response

**Cart Item Operations** (`cartItem.spec.ts`):

- **Positive Cases:** Adding valid items, verifying response structures, updating cart totals, and deleting items (`DELETE /cart/:cartId/items/:itemId`)
- **Negative Validation Cases:** Rejection with HTTP 400 on:
  - Empty item name
  - Negative price values
  - Zero or negative quantity values

  - Missing required fields (name, price, quantity)
- **Edge Cases:** 404 response when attempting to add or remove items from non-existent carts or item IDs

**Discount Code Management** (`discount.spec.ts`):

- **Positive Cases:** Parameterized tests verifying successful application of SAVE10 (10%), SAVE20 (20%), and HALF (50%). Overwriting active discount codes with new ones
- **Negative Cases:** Validation error HTTP 400 when submitting non-existent codes (e.g., INVALID100) or empty strings. 404 response for non-existent cart IDs

**Calculations & Business Logic** (`calculation.spec.ts`):

- Subtotal and total calculation accuracy across single and multi-item configurations
- Recalculation of cart totals following item removal
- Precision handling for floating-point calculations and decimal rounding with discounts
- Empty cart discount logic handling

#### 2. UI Test Suite (`tests/ui/`)

**Add Item Form** (`addItemForm.spec.ts`):

- Submitting valid items updates the UI list and resets input fields
- Form validation: Blocking submission and triggering HTML5 range underflow errors on negative price inputs
- Removing items updates the DOM state back to the "Your cart is empty" view

**Cart Display & Order Summary** (`cartDisplay.spec.ts`):

- Real-time display updates for individual item pricing, calculated subtotal, and final total

**Discount Application & UI Edge Cases** (`discountForm.spec.ts`):

- Applying valid discount codes dynamically updates order summary labels (discount amount & total)
- Form validation: Blocking item submission when quantity is set to zero or negative

### Test Results

- API and UI test suites cover positive, negative, edge-case, and business-logic scenarios.
- Known expected failures are documented and correspond to identified defects:
  - BUG-01: incorrect discount calculation for carts with multiple items
  - BUG-03: malformed cart IDs return `404` instead of `400`
- All other automated scenarios pass successfully.

### Running Automated Tests

```bash
# Install dependencies
npm install

# Execute Playwright tests in headless mode
npm run test

# Open Playwright Test Runner UI
npm run test:ui
```
