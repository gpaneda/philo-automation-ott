import { Browser } from 'webdriverio';
import { BasePage } from '../pages/base.page';
import { HomeScreenPage } from '../pages/homescreen.page';
import { SettingsPage } from '../pages/settings.page';
import { AppHelper } from '../helpers/app.helper';

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
                await driver.pause(2000);
                await driver.deleteSession();
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } catch (error) {
            console.error('Error in afterAll:', error);
        }
    });

    test('TC101 - should display landing page buttons', async () => {
        try {
            await driver.pause(15000);
            await basePage.verifyLandingPageElements();
        } catch (error) {
            console.error('Landing page buttons were not displayed:', error);
            throw error;
        }
    });

    test('TC102 - should display channels after pressing the down button once', async () => {
        try {
            await homeScreenPage.pressDownButton();
            await driver.pause(5000);
            await basePage.verifyChannelsDisplayed();
        } catch (error) {
            console.error('TC102 failed:', error);
            throw error;
        }
    });

    test('TC103 - should display login screen after pressing the Explore Free Channels button', async () => {
        try {
            await homeScreenPage.pressDownButton();
            await driver.pause(5000);
            await basePage.pressExploreFreeChannelsButton();
            await driver.pause(5000);
            await basePage.verifyLoginScreenDisplayed();
        } catch (error) {
            console.error('TC103 failed:', error);
            throw error;
        }
    });
}); 