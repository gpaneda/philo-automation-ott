"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHelper = void 0;
const webdriverio_1 = require("webdriverio");
const capabilities_1 = require("../config/capabilities");
const child_process_1 = require("child_process");
const gmail_helper_1 = require("./gmail.helper");
const login_page_1 = require("../pages/login.page");
class AppHelper {
    static async initializeDriver() {
        if (!this.driver) {
            try {
                console.log('Initializing WebDriver with capabilities:', JSON.stringify(capabilities_1.fireTVCapabilities, null, 2));
                this.driver = await (0, webdriverio_1.remote)({
                    hostname: 'localhost',
                    port: 4723,
                    logLevel: 'info',
                    path: '/wd/hub',
                    capabilities: capabilities_1.fireTVCapabilities,
                    connectionRetryTimeout: 120000,
                    connectionRetryCount: 5
                });
                console.log('WebDriver initialized successfully');
            }
            catch (error) {
                console.error('Failed to initialize WebDriver:', error);
                throw error;
            }
        }
        return this.driver;
    }
    static async launchPhiloApp() {
        console.log('Attempting to launch Philo app...');
        const driver = await this.initializeDriver();
        try {
            console.log('Starting Philo activity...');
            await driver.startActivity('com.philo.philo', 'com.philo.philo.app.activity.MainActivity');
            console.log('Waiting for app to launch...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Increased wait time to 10 seconds
            console.log('App launch completed');
            return driver;
        }
        catch (error) {
            console.error('Failed to launch Philo app:', error);
            throw error;
        }
    }
    static async clearAppData() {
        const deviceId = capabilities_1.fireTVCapabilities['appium:udid'];
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`adb -s ${deviceId} shell pm clear com.philo.philo`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Failed to clear app data:', stderr);
                    reject(error);
                }
                else {
                    console.log('App data cleared successfully');
                    resolve();
                }
            });
        });
    }
    static async loginToPhilo() {
        try {
            console.log('\n=== Starting Philo Sign-in Process ===');
            // Initialize driver if not already initialized
            const driver = await this.launchPhiloApp();
            // Search for existing emails first
            console.log('Step 1: Searching for existing Philo emails...');
            await gmail_helper_1.GmailHelper.searchPhiloEmails();
            console.log('\nStep 2: Triggering sign-in email...');
            await driver.pause(2000);
            await driver.$('android=text("Sign in")').click();
            // Enter email and submit
            const loginPage = new login_page_1.LoginPage(driver);
            await loginPage.clearInput();
            await loginPage.enterEmailFromEnv();
            await loginPage.clickOnSubmitButton();
            // Wait for email to be sent and process it
            console.log('Waiting for email to be delivered...');
            await driver.pause(10000);
            console.log('\nStep 3: Processing sign-in email...');
            const success = await gmail_helper_1.GmailHelper.processSignInEmail();
            if (success) {
                console.log('✅ Successfully processed sign-in email');
                // Wait for app to complete sign-in
                console.log('Step 4: Waiting for app to complete sign-in...');
                await driver.pause(10000);
                // Verify profile selection screen
                const profilesTitle = await driver.$('android=resourceId("com.philo.philo:id/profiles_title")');
                await profilesTitle.waitForDisplayed({ timeout: 20000 });
                // Click profile to enter homescreen
                const profileAvatar = await driver.$('android=resourceId("com.philo.philo:id/avatar")');
                await profileAvatar.waitForDisplayed({ timeout: 5000 });
                await profileAvatar.click();
                console.log('✅ Successfully completed sign-in process');
                return true;
            }
            console.log('❌ Sign-in process failed');
            return false;
        }
        catch (error) {
            console.error('❌ Error during sign-in process:', error);
            return false;
        }
    }
}
exports.AppHelper = AppHelper;
