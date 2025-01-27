import { startDecreasedBandwidthWorker, stopDecreasedBandwidthWorker } from '../helpers/setupDecreasedBandwidth';

describe('Decreased Bandwidth Tests', () => {
    beforeAll(async () => {
        await startDecreasedBandwidthWorker();
    });

    afterAll(async () => {
        await stopDecreasedBandwidthWorker();
    });

    it('should return success message', async () => {
        const response = await fetch('/api/data');
        const data = await response.json();
        expect(data.message).toBe('Success');
    });
});
