import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { LandingPage } from '../fireTVPages/landing.page';
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage as AndroidHomeScreenPage } from '../androidTVPages/homescreen.page';
import { LandingPage as AndroidLandingPage } from '../androidTVPages/landing.page';

const APP_TERMINATION_DELAY = 2000;
const APP_ACTIVATION_DELAY = 20000;
const APP_DATA_CLEAR_DELAY = 10000;

describe('Landing Page Tests', () => {
    let driver: Browser;
    let landingPage: LandingPage | AndroidLandingPage;
    let homeScreenPage: HomeScreenPage | AndroidHomeScreenPage;
    let appPackage: string;

    beforeAll(async () => {
        try {
            // Clear app data before starting tests
            console.log('Clearing app data before tests...');
            await AppHelper.clearAppData();
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Initialize driver and page objects
            driver = await AppHelper.launchPhiloApp();
            
            // Set up correct page objects and app package based on device type
            if (AppHelper.deviceType === 'androidTV') {
                console.log('Using Android TV page objects');
                landingPage = new AndroidLandingPage(driver);
                homeScreenPage = new AndroidHomeScreenPage(driver);
                appPackage = 'com.philo.philo.google';
            } else {
                console.log('Using Fire TV page objects');
                landingPage = new LandingPage(driver);
                homeScreenPage = new HomeScreenPage(driver);
                appPackage = 'com.philo.philo';
            }
        } catch (error: unknown) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 120000);

    const terminateAndActivateApp = async () => {
        await driver.terminateApp(appPackage);
        await driver.pause(APP_TERMINATION_DELAY);
        await driver.activateApp(appPackage);
        await driver.pause(APP_ACTIVATION_DELAY);
    };

    beforeEach(async () => {
        try {
            await terminateAndActivateApp();
        } catch (error: unknown) {
            console.error('Error in beforeEach:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to activate app: ${error.message}`);
            }
            throw new Error('Failed to activate app: Unknown error');
        }
    }, 60000);

    afterAll(async () => {
        try {
            console.log('Clearing app data after tests...');
            await AppHelper.clearAppData();
            if (driver) {
                await driver.terminateApp(appPackage);
                await driver.pause(APP_TERMINATION_DELAY);
                await driver.deleteSession();
                await new Promise(resolve => setTimeout(resolve, APP_DATA_CLEAR_DELAY));
            }
        } catch (error: unknown) {
            console.error('Error in afterAll:', error);
        }
    });

    test('TC101 - should display landing page buttons', async () => {
        try {
            await landingPage.verifyLandingPageElements();
        } catch (error: unknown) {
            console.error('Error in TC101:', error);
            if (error instanceof Error) {
                throw new Error(`TC101 failed: ${error.message}`);
            }
            throw new Error('TC101 failed: Unknown error');
        }
    }, 60000);

    test('TC102 - should display channels after pressing the down button', async () => {
        try {
            await landingPage.verifyLandingPageElements();
            await homeScreenPage.pressDownButton();
            await driver.pause(5000);
            await landingPage.verifyLandingPageElements();
            await driver.pause(2000);
            await landingPage.verifyChannelsDisplayed();
        } catch (error: unknown) {
            console.error('Error in TC102:', error);
            if (error instanceof Error) {
                throw new Error(`TC102 failed: ${error.message}`);
            }
            throw new Error('TC102 failed: Unknown error');
        }
    }, 60000);

    test('TC103 - should display login screen after pressing the Explore Free Channels button', async () => {
        try {
            await landingPage.verifyLandingPageElements();
            await homeScreenPage.pressDownButton();
            await driver.pause(3000);
            await homeScreenPage.pressRightButton();
            await homeScreenPage.pressEnterButton();
            await driver.pause(3000);
            await landingPage.verifyLoginScreenDisplayed();
        } catch (error: unknown) {
            console.error('Error in TC103:', error);
            if (error instanceof Error) {
                throw new Error(`TC103 failed: ${error.message}`);
            }
            throw new Error('TC103 failed: Unknown error');
        }
    }, 60000);
}); 