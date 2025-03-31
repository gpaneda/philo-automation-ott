import { AppHelper } from '../helpers/app.helper';
import dotenv from 'dotenv';
import WebSocketHelper from '../utils/WebSocketHelper';

let webSocketHelper: WebSocketHelper;

// Load environment variables
dotenv.config();

// Debug logging for environment variables
console.log('\n=== Environment Variables ===');
console.log('PHILO_EMAIL:', process.env.PHILO_EMAIL);
console.log('GMAIL_CLIENT_ID:', process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not Set');
console.log('GMAIL_CLIENT_SECRET:', process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not Set');
console.log('GMAIL_REDIRECT_URI:', process.env.GMAIL_REDIRECT_URI ? 'Set' : 'Not Set');
console.log('GMAIL_REFRESH_TOKEN:', process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not Set');
console.log('FIRE_TV_IP:', process.env.FIRE_TV_IP);
console.log('FIRE_TV_PORT:', process.env.FIRE_TV_PORT);
console.log('ANDROID_TV_IP:', process.env.ANDROID_TV_IP);
console.log('ANDROID_TV_PORT:', process.env.ANDROID_TV_PORT);

describe('Open Philo App', () => {
    beforeAll(async () => {
        try {
            webSocketHelper = new WebSocketHelper({ url: 'ws://localhost:3000' });
            // Verify required environment variables are present
            const requiredEnvVars = [
                'GMAIL_CLIENT_ID',
                'GMAIL_CLIENT_SECRET',
                'GMAIL_REDIRECT_URI',
                'GMAIL_REFRESH_TOKEN',
                'PHILO_EMAIL',
                'PHILO_EMAIL_2',
                'PHILO_EMAIL_3',
                'ANDROID_TV_IP',
                'ANDROID_TV_PORT',
                'FIRE_TV_IP',
                'FIRE_TV_PORT'
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
        } catch (error: unknown) {
            console.error('Error in beforeAll:', error);
            if (error instanceof Error) {
                throw new Error(`Failed in beforeAll: ${error.message}`);
            }
            throw new Error('Failed in beforeAll: Unknown error');
        }
    });

    afterAll(async () => {
        try {
            // Clean up app data after test
            console.log('Clearing app data after test...');
            await AppHelper.clearAppData();
            await webSocketHelper.close();
        } catch (error: unknown) {
            console.error('Error in afterAll:', error);
        }
    });

    test('TC103 - should complete email sign in flow', async () => {
        console.log('\n=== Starting Login Process ===');
        console.log('Current device type:', AppHelper.deviceType);
        console.log('Device IP:', process.env.FIRE_TV_IP || process.env.ANDROID_TV_IP);
        console.log('Device Port:', process.env.FIRE_TV_PORT || process.env.ANDROID_TV_PORT);
        console.log('Appium Port:', process.env.APPIUM_PORT);
        console.log('Appium Host:', process.env.APPIUM_HOST);
        console.log('App Package:', AppHelper.appPackage);
        
        try {
            console.log('\nAttempting to login to Philo...');
            const success = await AppHelper.loginToPhilo();
            console.log('Login process completed with result:', success);
            expect(success).toBe(true);
        } catch (error: unknown) {
            console.error('\n=== Login Process Failed ===');
            console.error('Error details:', error);
            if (error instanceof Error) {
                console.error('Error stack:', error.stack);
                throw new Error(`Login failed: ${error.message}`);
            }
            throw new Error('Login failed: Unknown error');
        }
    }, 180000); // Allow 180 seconds for the complete flow
}); 