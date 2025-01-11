import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { LandingPage } from '../pages/landing.page';
import { AppHelper } from '../helpers/app.helper';

describe('Landing Page', () => {
    let driver: Browser<'async'>;
    let landingPage: LandingPage;
    let homeScreenPage: HomeScreenPage;

    beforeEach(async () => {
        try {
            driver = await AppHelper.launchPhiloApp();
            landingPage = new LandingPage(driver);
            homeScreenPage = new HomeScreenPage(driver);
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
            await landingPage.verifyLandingPageElements();
        } catch (error) {
            console.error('Landing page buttons were not displayed:', error);
            throw error;
        }
    });

    test('TC102 - should display channels after pressing the down button once', async () => {
        try {
            await homeScreenPage.pressDownButton();
            await driver.pause(5000);
            await landingPage.verifyChannelsDisplayed();
        } catch (error) {
            console.error('TC102 failed:', error);
            throw error;
        }
    });

    test('TC103 - should display login screen after pressing the Explore Free Channels button', async () => {
        try {
            await homeScreenPage.pressDownButton();
            await driver.pause(5000);
            await landingPage.pressExploreFreeChannelsButton();
            await driver.pause(5000);
            await landingPage.verifyLoginScreenDisplayed();
        } catch (error) {
            console.error('TC103 failed:', error);
            throw error;
        }
    });
}); 