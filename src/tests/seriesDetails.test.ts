import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { CategoriesPage } from '../pages/categories.page';
import { SeriesDetailsPage } from '../pages/seriesDetails.page';

let driver: WebdriverIO.Browser;
let homeScreen: HomeScreenPage;
let categoriesPage: CategoriesPage;
let seriesDetailsPage: SeriesDetailsPage;

beforeAll(async () => {
    try {
        driver = await AppHelper.launchPhiloApp();
        homeScreen = new HomeScreenPage(driver);
        categoriesPage = new CategoriesPage(driver);
        seriesDetailsPage = new SeriesDetailsPage(driver);
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
}, 60000);

beforeEach(async () => {
    try {
        // Get a fresh driver instance
        driver = await AppHelper.launchPhiloApp();
        // Reinitialize page objects with new driver
        homeScreen = new HomeScreenPage(driver);
        categoriesPage = new CategoriesPage(driver);
        seriesDetailsPage = new SeriesDetailsPage(driver);
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
    try {
        if (driver) {
            await driver.terminateApp('com.philo.philo');
            await driver.pause(2000);
            await driver.deleteSession();
            await driver.pause(10000);
        }
    } catch (error) {
        console.error('Error in afterAll:', error);
    } finally {
        if (driver) {
            try {
                await driver.deleteSession();
            } catch (e) {
                // Ignore errors during force close
            }
        }
    }
}, 30000);

describe('Series Details Tests', () => {
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
}); 