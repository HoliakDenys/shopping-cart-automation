# Shopping Cart API — Test Automation Framework

A Playwright + TypeScript test suite designed to validate the shopping cart
service through API and UI automation. The project focuses on contract checks,
negative scenarios, regression prevention, and defect documentation.

## Highlights

- **Schema-driven validation** — each API response is checked against an AJV
  JSON Schema before custom assertions run
- **Type-safe API client** — typed request/response handling reduces brittle
  test logic and improves reliability
- **Negative testing coverage** — invalid payloads, malformed IDs, edge values,
  and unsupported discount codes are covered alongside positive flows
- **Page Object Model** for the UI layer
- **CI-ready setup** — the full suite can run automatically via GitHub Actions
- **Bug documentation** — known issues and reproduction steps are captured in
  the defect report

## Tech Stack

Playwright · TypeScript · AJV · ESLint · Prettier · Husky

## Project Structure

```text
automation/
  src/
    apiClient.ts
    constants.ts
    endpoints.ts
    fixtures.ts
    schemas.ts
    types.ts
    components/
      addItemForm.ts
      cartList.ts
      discountForm.ts
      orderSummary.ts
    data/
      cartItemBuilder.ts
    pages/
      cartPage.ts
    utils/
      assertions.ts
      currency.ts
      schemaValidator.ts
      stepDecorator.ts
  tests/
    api/
      calculation.spec.ts
      cart.spec.ts
      cartItem.spec.ts
      discount.spec.ts
      health.spec.ts
    ui/
      addItemForm.spec.ts
      cartDisplay.spec.ts
      discountForm.spec.ts
src/
public/
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Run the Application

```bash
docker-compose up --build
```

The app is available at http://localhost:3000

### Run the Tests

```bash
npm install
npx playwright install --with-deps
npm test
npm run test:ui
```

### Quality Checks

```bash
npm run lint
npm run typecheck
npm run format:check
```

## CI

The suite is configured to run automatically on pull requests through GitHub
Actions.

## Known Defects

See the defect report for detailed reproduction steps and root-cause notes.
