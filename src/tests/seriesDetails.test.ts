import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { CategoriesPage } from '../fireTVPages/categories.page';
import { SeriesDetailsPage } from '../fireTVPages/seriesDetails.page';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let driver: Browser<'async'>;
let homeScreen: HomeScreenPage;
let categoriesPage: CategoriesPage;
let seriesDetailsPage: SeriesDetailsPage;

beforeAll(async () => {
    try {
        // First verify required environment variables
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
        await driver.pause(5000); // Wait for app to fully load

        // Initialize page objects
        homeScreen = new HomeScreenPage(driver);
        categoriesPage = new CategoriesPage(driver);
        seriesDetailsPage = new SeriesDetailsPage(driver);
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
}, 120000);

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

afterEach(async () => {
    try {
        await driver.terminateApp('com.philo.philo');
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

test('TC119 - Verify Episodes Tab Navigation', async () => {
    try {
        // Step 1: Navigate to Top Free Shows and select series      
        await categoriesPage.goToTopFreeShows();
        await driver.pause(5000);
        await homeScreen.pressEnterButton();
        await driver.pause(5000);

        // Step 2: Verify we're on series details page and get title
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);

        // Step 3: Verify Episodes tab content
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
        // Step 1: Navigate to Top Free Shows and select series      
        await categoriesPage.goToTopFreeShows();
        await driver.pause(5000);
        await homeScreen.pressEnterButton();
        await driver.pause(5000);

        // Step 2: Verify we're on series details page
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);

        // Step 3: Verify Schedule tab content
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
        // Step 1: Navigate to Top Free Shows and select series      
        await categoriesPage.goToTopFreeShows();
        await driver.pause(5000);
        await homeScreen.pressEnterButton();
        await driver.pause(5000);

        // Step 2: Verify we're on series details page
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);

        // Step 3: Verify Related tab content
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
        // Step 1: Navigate to Top Free Shows and select series      
        await categoriesPage.goToTopFreeShows();
        await driver.pause(5000);
        await homeScreen.pressEnterButton();
        await driver.pause(5000);

        // Step 2: Verify we're on series details page
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);

        // Check if Extras tab exists
        const hasExtrasTab = await seriesDetailsPage.isExtrasTabPresent();
        if (!hasExtrasTab) {
            console.log('Extras tab not present, skipping test');
            return;
        }

        // Step 3: Verify Extras tab content
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
        // Step 1: Navigate to Top Free Shows and select series      
        await categoriesPage.goToTopFreeShows();
        await driver.pause(5000);
        await homeScreen.pressEnterButton();
        await driver.pause(5000);

        // Step 2: Verify we're on series details page
        await seriesDetailsPage.waitForLoaded();
        const seriesTitle = await seriesDetailsPage.getSeriesTitle();
        console.log('Found series:', seriesTitle);

        // Step 3: Verify Details tab content
        console.log('Verifying Details tab...');
        await seriesDetailsPage.goToDetails();
        await driver.pause(2000);
    } catch (error) {
        console.error('Error in details tab test:', error);
        throw error;
    }
}, 180000);