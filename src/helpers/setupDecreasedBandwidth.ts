import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Create the service worker for decreased bandwidth
const worker = setupServer(
    rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.json({ message: 'Success' }), ctx.delay(1000)); // Simulate a delay to mimic decreased bandwidth
    })
);

// Function to start the worker
export const startDecreasedBandwidthWorker = async () => {
    await worker.start();
};

// Function to stop the worker
export const stopDecreasedBandwidthWorker = async () => {
    await worker.stop();
};
