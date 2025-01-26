import { AppHelper } from '../helpers/app.helper';
import dotenv from 'dotenv';
import WebSocketHelper from '../utils/WebSocketHelper';

let webSocketHelper: WebSocketHelper;

// Load environment variables
dotenv.config();

describe('Open Philo App', () => {
    beforeAll(async () => {
        webSocketHelper = new WebSocketHelper('ws://localhost:3000');
        // Verify required environment variables are present
        const requiredEnvVars = [
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET',
            'GMAIL_REDIRECT_URI',
            'GMAIL_REFRESH_TOKEN',
            'PHILO_EMAIL'
        ];

        requiredEnvVars.forEach(envVar => {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        });

        // Clear app data before starting test
        console.log('Clearing app data before test...');
        await AppHelper.clearAppData();
        await new Promise(resolve => setTimeout(resolve, 2000));
    });

    afterAll(async () => {
        // Clean up app data after test
        console.log('Clearing app data after test...');
        await AppHelper.clearAppData();
        await webSocketHelper.close();
    });

    test('TC103 - should complete email sign in flow', async () => {
        const success = await AppHelper.loginToPhilo();
        expect(success).toBe(true);
    }, 120000); // Allow 120 seconds for the complete flow
}); 