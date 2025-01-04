import { GmailHelper } from '../helpers/gmail.helper';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

describe('Gmail Helper Tests', () => {
    beforeAll(() => {
        // Verify required environment variables are present
        const requiredEnvVars = [
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET',
            'GMAIL_REDIRECT_URI',
            'GMAIL_REFRESH_TOKEN'
        ];

        requiredEnvVars.forEach(envVar => {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        });
    });

    test('should process Philo sign-in email', async () => {
        console.log('\n=== Testing Philo Sign-in Process ===');
        try {
            const success = await GmailHelper.processSignInEmail();
            
            // We don't always expect success (email might not be there yet)
            // but we expect the function to run without errors
            expect(typeof success).toBe('boolean');
            
            if (success) {
                console.log('✅ Successfully processed sign-in email');
            } else {
                console.log('ℹ️ No sign-in email to process');
            }
        } catch (error) {
            console.error('❌ Sign-in process failed:', error);
            throw error;
        }
    }, 30000);

    test('should handle missing emails gracefully', async () => {
        console.log('\n=== Testing Error Handling ===');
        try {
            // Wait a bit to ensure no new emails
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const success = await GmailHelper.processSignInEmail();
            expect(success).toBe(false);
            console.log('✅ Properly handled missing email case');
        } catch (error) {
            console.error('❌ Error handling test failed:', error);
            throw error;
        }
    });
}); 