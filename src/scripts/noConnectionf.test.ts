import { startNoConnectionWorker, stopNoConnectionWorker } from '../helpers/setupNoConnection';

beforeAll(async () => {
    await startNoConnectionWorker();
});

afterAll(async () => {
    await stopNoConnectionWorker();
});

describe('No Connection Tests', () => {
    test('should handle no internet connection', async () => {
        const response = await fetch('/api/no-connection');
        expect(response.ok).toBe(false);
        expect(await response.text()).toBe('Failed to connect');
    });
});