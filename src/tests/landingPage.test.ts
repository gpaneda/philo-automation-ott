import { Browser } from 'webdriverio';
import { BasePage } from '../pages/base.page';
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage } from '../pages/homescreen.page';
import { SettingsPage } from '../pages/settings.page';

jest.setTimeout(90000); // Set global timeout

describe('Landing Page', () => {
    let driver: Browser<'async'>;
    let basePage: BasePage;
    let homeScreenPage: HomeScreenPage;
    let settingsPage: SettingsPage;

    beforeEach(async () => {
        try {
            driver = await AppHelper.launchPhiloApp();
            basePage = new BasePage(driver);
            homeScreenPage = new HomeScreenPage(driver);
            settingsPage = new SettingsPage(driver);
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 30000);

    afterEach(async () => {
        try {
            if (driver) {
                await driver.terminateApp('com.philo.philo');
                await driver.deleteSession();
            }
        } catch (error) {
            console.error('Error in afterAll:', error);
        }
    });

    beforeEach(async () => {
        // Add a small delay before each test to ensure app is stable
        await driver.pause(2000);
    });

    afterEach(async () => {
        // Add cleanup after each test if needed
        await driver.pause(1000);
    });

    // Test Case 101 - Verify landing page buttons are displayed
    test('TC101 - should display landing page buttons', async () => {
        await driver.pause(15000);
        await basePage.verifyLandingPageElements();
    });

    // Test Case 102 - Verify channels are displayed after pressing the down button once
    test('TC102 - should display channels after pressing the down button once', async () => {
        try {
            await homeScreenPage.pressDownButton();
            // Wait for any animations to complete
            await driver.pause(5000);
            await basePage.verifyChannelsDisplayed();
        } catch (error) {
            console.error('TC102 failed:', error);
            throw error;
        }
    });

    // Test Case 103 - Verify that the Login Screen is displayed after pressing the Explore Free Channels button
    test('TC103 - should display login screen after pressing the Explore Free Channels button', async () => {
        try {
            await homeScreenPage.pressDownButton();
            // Wait for any animations to complete
            await driver.pause(5000);
            await basePage.pressExploreFreeChannelsButton();
            // Wait for navigation to complete
            await driver.pause(5000);
            //Check if the login screen is displayed
            await basePage.verifyLoginScreenDisplayed();
        } catch (error) {
            console.error('TC103 failed:', error);
            throw error;
        }
    });
}); 