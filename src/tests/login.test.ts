import { GmailHelper } from '../helpers/gmail.helper';
import { AppHelper } from '../helpers/app.helper';
import { LoginPage } from '../pages/login.page';
import { Browser } from 'webdriverio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

describe('Open Philo App', () => {
    let driver: Browser<'async'>;
    let loginPage: LoginPage;

    beforeAll(async () => {
        try {
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

            // Initialize the driver
            driver = await AppHelper.launchPhiloApp();
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 30000);

    afterAll(async () => {
        try {
            if (driver) {
                await driver.terminateApp('com.philo.philo');
                await driver.pause(2000);
                await driver.deleteSession();
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } catch (error) {
            console.error('Error in afterAll:', error);
        }
    });

    beforeEach(async () => {
        try {
            await driver.terminateApp('com.philo.philo');
            await driver.pause(2000);
            await driver.activateApp('com.philo.philo');
            await driver.pause(5000);
        } catch (error) {
            console.error('Error in beforeEach:', error);
            throw error;
        }
    });

    test('TC103 - should complete email sign in flow', async () => {
        try {
            console.log('\n=== Testing Enhanced Philo Sign-in Process ===');
            console.log('Step 1: Searching for existing Philo emails...');
            await GmailHelper.searchPhiloEmails();
            
            console.log('\nStep 2: Triggering sign-in email...');
            
            // Click sign in button and enter email
            await driver.pause(2000);
            await driver.$('android=text("Sign in")').click();
            
            loginPage = new LoginPage(driver);
            await loginPage.clearInput();
            await loginPage.enterEmailFromEnv();
            await loginPage.clickOnSubmitButton();
            
            // Wait for email to be sent
            console.log('Waiting for email to be delivered...');
            await driver.pause(10000);
            
            console.log('\nStep 3: Searching for new Philo emails...');
            await GmailHelper.searchPhiloEmails();
            
            console.log('\nStep 4: Processing sign-in email with enhanced flow...');
            const success = await GmailHelper.processSignInEmail();
            expect(success).toBe(true);
            
            if (success) {
                console.log('✅ Successfully processed sign-in email with enhanced flow');
                
                // Wait for the app to handle the web confirmation and return to the profile selection screen
                console.log('Step 5: Waiting for app to complete sign-in...');
                await driver.pause(10000);
                const profilesTitle = await driver.$('android=resourceId("com.philo.philo:id/profiles_title")');
                await profilesTitle.waitForDisplayed({ timeout: 20000 });
                expect(await profilesTitle.isDisplayed()).toBe(true);
                
                const profileAvatar = await driver.$('android=resourceId("com.philo.philo:id/avatar")');
                await profileAvatar.waitForDisplayed({ timeout: 5000 });
                expect(await profileAvatar.isDisplayed()).toBe(true);

                // Click on the profile title to enter homescreen
                console.log('Step 6: Clicking profile to enter homescreen...');
                await profileAvatar.click();
                
                console.log('✅ Successfully verified app sign-in completion');
            } else {
                console.log('❌ Enhanced sign-in process failed');
                throw new Error('Sign-in process failed');
            }
        } catch (error) {
            console.error('❌ Enhanced sign-in process failed:', error);
            throw error;
        }
    }, 120000); // Allow 120 seconds for the complete flow
}); 