import { GmailHelper } from '../helpers/gmail.helper';
import dotenv from 'dotenv';
import { gmail_v1 } from 'googleapis';
import { TestReporter } from '../utils/TestReporter';

// Load environment variables
dotenv.config();

describe('Gmail Helper Tests', () => {
    beforeAll(async () => {
        try {
            await TestReporter.init();
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
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    });

    test('should process Philo sign-in email', async () => {
        try {
            console.log('\n=== Testing Philo Sign-in Process ===');
            const success = await GmailHelper.processSignInEmail();
            
            expect(typeof success).toBe('boolean');
            
            if (success) {
                console.log('✅ Successfully processed sign-in email');
            } else {
                console.log('ℹ️ No sign-in email to process');
            }
            
            await TestReporter.logTestResult('Gmail_ProcessSignIn', 'pass');
        } catch (error) {
            await TestReporter.logTestResult('Gmail_ProcessSignIn', 'fail', error as Error);
            console.error('❌ Sign-in process failed:', error);
            throw error;
        }
    }, 30000);

    test('should handle missing emails gracefully', async () => {
        try {
            console.log('\n=== Testing Error Handling ===');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const success = await GmailHelper.processSignInEmail();
            expect(success).toBe(false);
            console.log('✅ Properly handled missing email case');
            
            await TestReporter.logTestResult('Gmail_HandleMissingEmails', 'pass');
        } catch (error) {
            await TestReporter.logTestResult('Gmail_HandleMissingEmails', 'fail', error as Error);
            console.error('❌ Error handling test failed:', error);
            throw error;
        }
    }, 30000);
}); 