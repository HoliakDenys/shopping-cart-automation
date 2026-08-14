import { expect, test } from '@src/fixtures.js';
import { expectStatus } from '@src/utils/assertions.js';

test.describe('Health Check API', () => {
  test('should return 200 OK and valid status', async ({ apiClient }) => {
    const healthCheckResponse = await apiClient.healthCheck();

    await expectStatus(healthCheckResponse, 200);

    await test.step('Verify the response data contains the "ok" status', async () => {
      expect(healthCheckResponse.data.status).toBe('ok');
    });
  });
});
