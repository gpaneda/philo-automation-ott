import { setupWorker, rest } from 'msw';

// Create the service worker for fluctuating connection
const worker = setupWorker(
    rest.get('/api/fluctuating', (req, res, ctx) => {
        const randomDelay = Math.random() * 2000; // Random delay between 0 and 2000ms
        return res(ctx.json({ message: 'Fluctuating response' }), ctx.delay(randomDelay));
    })
);

// Function to start the worker
export const startFluctuatingConnectionWorker = async () => {
    await worker.start();
};

// Function to stop the worker
export const stopFluctuatingConnectionWorker = async () => {
    await worker.stop();
};
