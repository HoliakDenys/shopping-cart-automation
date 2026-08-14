import { test, expect } from '@playwright/test';
import type { ApiResponse, ErrorResponse } from '@src/types.js';

export async function expectStatus(response: { status: number }, expectedStatus: number) {
  await test.step(`Verify response status is ${expectedStatus}`, async () => {
    expect(response.status).toBe(expectedStatus);
  });
}

export function expectSuccess<T>(
  response: ApiResponse<T | ErrorResponse>,
): asserts response is ApiResponse<T> {
  expect(response.status, `Expected success status, got ${response.status}`).toBeLessThan(400);
}

export function expectError(
  response: ApiResponse<unknown>,
): asserts response is ApiResponse<ErrorResponse> {
  expect(response.status, `Expected error status, got ${response.status}`).toBeGreaterThanOrEqual(
    400,
  );
}
