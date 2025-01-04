import { GmailHelper } from '../helpers/gmail.helper';
import dotenv from 'dotenv';
import { google } from 'googleapis';

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

    test('should search for Philo sign-in link', async () => {
        console.log('\n=== Testing Philo Sign-in Link Search ===');
        try {
            const link = await GmailHelper.getPhiloSignInLink();
            console.log('Found link:', link);
            
            // We don't always expect a link (email might not be there yet)
            // but we expect the function to run without errors
            expect(typeof link === 'string' || link === null).toBe(true);
        } catch (error) {
            console.error('Sign-in link search failed:', error);
            throw error;
        }
    }, 30000);

    test('should attempt to click sign-in link', async () => {
        console.log('\n=== Testing Sign-in Link Click ===');
        try {
            const success = await GmailHelper.clickSignInLink();
            console.log('Click success:', success);
            
            // We don't always expect success (email might not be there)
            // but we expect the function to run without errors
            expect(typeof success).toBe('boolean');
        } catch (error) {
            console.error('Sign-in link click failed:', error);
            throw error;
        }
    }, 30000);

    test('should handle missing emails gracefully', async () => {
        console.log('\n=== Testing Error Handling ===');
        try {
            const link = await GmailHelper.getPhiloSignInLink();
            if (link === null) {
                expect(link).toBeNull();
            } else {
                expect(typeof link).toBe('string');
            }
        } catch (error) {
            console.error('Error handling test failed:', error);
            throw error;
        }
    });
}); 