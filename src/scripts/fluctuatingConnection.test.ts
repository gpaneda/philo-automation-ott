import { startFluctuatingConnectionWorker, stopFluctuatingConnectionWorker } from '../helpers/setupFluctuatingConnection';

beforeAll(async () => {
    await startFluctuatingConnectionWorker();
});

afterAll(async () => {
    await stopFluctuatingConnectionWorker();
});

describe('Fluctuating Connection Tests', () => {
    test('should handle fluctuating response', async () => {
        const response = await fetch('/api/fluctuating');
        const data = await response.json();
        expect(data.message).toBe('Fluctuating response');
    });
});
