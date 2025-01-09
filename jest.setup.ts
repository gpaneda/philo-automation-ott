import { config } from 'dotenv';
const result = config();

if (result.error) {
    throw result.error;
}

declare global {
    let driver: any;
}

jest.setTimeout(180000);

beforeAll(() => {
    // Add any global setup here
});

afterAll(() => {
    // Add any global cleanup here
}); 