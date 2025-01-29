import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { LandingPage } from '../fireTVPages/landing.page';
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage as AndroidHomeScreenPage } from '../androidTVPages/homescreen.page';
import { LandingPage as AndroidLandingPage } from '../androidTVPages/landing.page';

describe('Landing Page Tests', () => {
    let driver: Browser<'async'>;
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
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 120000);

    afterAll(async () => {
        try {
            // Clean up app data after all tests
            console.log('Clearing app data after tests...');
            await AppHelper.clearAppData();

            if (driver) {
                await driver.terminateApp(appPackage);
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
            await driver.terminateApp(appPackage);
            await driver.pause(2000);
            await driver.activateApp(appPackage);
            await driver.pause(20000); // Longer wait for app to fully load
        } catch (error) {
            console.error('Error in beforeEach:', error);
            throw error;
        }
    }, 60000);

    test('TC101 - should display landing page buttons', async () => {
        await landingPage.verifyLandingPageElements();
    }, 60000);

    test('TC102 - should display channels after pressing the down button', async () => {
        await landingPage.verifyLandingPageElements();
        await homeScreenPage.pressDownButton();
        await driver.pause(5000);
        await landingPage.verifyLandingPageElements();
        await driver.pause(2000);
        await landingPage.verifyChannelsDisplayed();
    }, 60000);

    test('TC103 - should display login screen after pressing the Explore Free Channels button', async () => {
        await landingPage.verifyLandingPageElements();
        await homeScreenPage.pressDownButton();
        await driver.pause(3000);
        await homeScreenPage.pressRightButton();
        await homeScreenPage.pressEnterButton();
        await driver.pause(3000);
        await landingPage.verifyLoginScreenDisplayed();
    }, 60000);
}); 