import { setupWorker, rest } from 'msw';

// Create the service worker for no connection
const worker = setupWorker(
    rest.get('/api/no-connection', (req, res, ctx) => {
        return res.networkError('Failed to connect'); // Simulate network error
    })
);

// Function to start the worker
export const startNoConnectionWorker = async () => {
    await worker.start();
};

// Function to stop the worker
export const stopNoConnectionWorker = async () => {
    await worker.stop();
};
