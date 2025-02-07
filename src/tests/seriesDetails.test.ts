import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import dotenv from 'dotenv';
import path from 'path';

import { HomeScreenPage, CategoriesPage, SeriesDetailsPage } from '../fireTVPages'

import { HomeScreenPage as AndroidHomeScreenPage, CategoriesPage as AndroidCategoriesPage, SeriesDetailsPage as AndroidSeriesDetailsPage } from '../androidTVPages';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const APP_TERMINATION_DELAY = 2000;
const APP_ACTIVATION_DELAY = 5000;

let driver: Browser;
let homeScreen: HomeScreenPage | AndroidHomeScreenPage;
let categoriesPage: CategoriesPage | AndroidCategoriesPage;
let seriesDetailsPage: SeriesDetailsPage | AndroidSeriesDetailsPage;

// Helper function to terminate and activate the app
const terminateAndActivateApp = async () => {
    await driver.terminateApp(AppHelper.appPackage);
    await driver.pause(APP_TERMINATION_DELAY);
    await driver.activateApp(AppHelper.appPackage);
    await driver.pause(APP_ACTIVATION_DELAY);
};

beforeAll(async () => {
    try {
        // Verify required environment variables
        const requiredEnvVars = [
            'FIRE_TV_IP',
            'FIRE_TV_PORT',
            'PHILO_EMAIL',
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET',
            'GMAIL_REFRESH_TOKEN',
            'GMAIL_REDIRECT_URI',
            'PHILO_EMAIL_2',
            'PHILO_EMAIL_3',
            'ANDROID_TV_IP',
            'ANDROID_TV_PORT'
        ];

        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Required environment variable ${envVar} is not set`);
            }
        }

        // Clear app data before starting
        console.log('Clearing app data...');
        await AppHelper.clearAppData();

        // Login to Philo and get the initialized driver
        const loginSuccess = await AppHelper.loginToPhilo();
        if (!loginSuccess) {
            throw new Error('Failed to login to Philo');
        }

        // Get the already initialized driver
        driver = await AppHelper.initializeDriver();
        // Set up correct page objects and app package based on device type
        if (AppHelper.deviceType === 'androidTV') {
            homeScreen = new AndroidHomeScreenPage(driver);
            categoriesPage = new AndroidCategoriesPage(driver);
            seriesDetailsPage = new AndroidSeriesDetailsPage(driver);
        } else {
            homeScreen = new HomeScreenPage(driver);
            categoriesPage = new CategoriesPage(driver);
            seriesDetailsPage = new SeriesDetailsPage(driver);
        }
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
}, 120000);

beforeEach(async () => {
    try {
        await terminateAndActivateApp();
    } catch (error) {
        console.error('Error in beforeEach:', error);
        throw error;
    }
});

afterEach(async () => {
    try {
        await driver.terminateApp(AppHelper.appPackage);
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in afterEach:', error);
    }
});

afterAll(async () => {
    // Clean up app data after test
    console.log('Clearing app data after test...');
    await AppHelper.clearAppData();
});

const navigateToTopFreeShows = async () => {
    await categoriesPage.goToTopFreeShows();
    await driver.pause(5000);
    await homeScreen.pressEnterButton();
    await driver.pause(5000);
};

test('TC119 - Verify Episodes Tab Navigation', async () => {
    try {
        await navigateToTopFreeShows();
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);
        console.log('Verifying Episodes tab...');
        await seriesDetailsPage.goToEpisodes();
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in episodes tab test:', error);
        throw error;
    }
}, 180000);

test('TC120 - Verify Schedule Tab Navigation', async () => {
    try {
        await categoriesPage.navigateToCategory(categoriesPage.selectors.topFreeShows, 2);
        await driver.pause(5000);
        await homeScreen.pressDownButton();
        await homeScreen.pressEnterButton();
        await driver.pause(5000);
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);
        console.log('Verifying Schedule tab...');
        await seriesDetailsPage.goToSchedule();
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in schedule tab test:', error);
        throw error;
    }
}, 180000);

test('TC121 - Verify Related Tab Navigation', async () => {
    try {
        await categoriesPage.navigateToCategory(categoriesPage.selectors.topFreeShows, 2);
        await driver.pause(5000);
        await homeScreen.pressDownButton();
        await homeScreen.pressRightButton();
        await homeScreen.pressEnterButton();
        await driver.pause(5000);
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);
        console.log('Verifying Related tab...');
        await seriesDetailsPage.goToRelated();
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in related tab test:', error);
        throw error;
    }
}, 180000);

test('TC122 - Verify Extras Tab Navigation', async () => {
    try {
        await categoriesPage.navigateToCategory(categoriesPage.selectors.topFreeShows, 2);
        await driver.pause(5000);
        await homeScreen.pressDownButton();
        await homeScreen.pressRightButton();
        await homeScreen.pressRightButton();
        await homeScreen.pressEnterButton();
        await driver.pause(5000);
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);
        const hasExtrasTab = await seriesDetailsPage.isExtrasTabPresent();
        if (!hasExtrasTab) {
            console.log('Extras tab not present, skipping test');
            return;
        }
        console.log('Verifying Extras tab...');
        await seriesDetailsPage.goToExtras();
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in extras tab test:', error);
        throw error;
    }
}, 180000);

test('TC123 - Verify Details Tab Navigation', async () => {
    try {
        await categoriesPage.navigateToCategory(categoriesPage.selectors.topFreeShows, 2);
        await driver.pause(5000);
        await homeScreen.pressEnterButton();
        await homeScreen.pressDownButton();
        await homeScreen.pressRightButton();
        await homeScreen.pressDownButton();
        await homeScreen.pressEnterButton();
        await driver.pause(5000);
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);
        console.log('Verifying Details tab...');
        await seriesDetailsPage.goToDetails();
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in details tab test:', error);
        throw error;
    }
}, 180000);