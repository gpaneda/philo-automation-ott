import { AppHelper } from '../helpers/app.helper';
import { Browser, Element } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { GuidePage } from '../pages/guide.page';
import { SettingsPage } from '../pages/settings.page';
import { TopPage } from '../pages/top.page';
import path from 'path';
import fs from 'fs/promises';
import { CategoriesPage } from '../pages/categories.page';
import { MoviesDetailsPage } from '../pages/moviesDetails.page';
import { SeriesDetailsPage } from '../pages/seriesDetails.page';

let driver: Browser<'async'>;
let homeScreen: HomeScreenPage;
let guidePage: GuidePage;
let settingsPage: SettingsPage;
let topPage: TopPage;
let categoriesPage: CategoriesPage;
let movieDetailsPage: MoviesDetailsPage;
let seriesDetailsPage: SeriesDetailsPage;

// Define screenshot directories
const SCREENSHOT_BASE_DIR = path.join(process.cwd(), 'screenshots');
const REFERENCE_DIR = path.join(SCREENSHOT_BASE_DIR, 'reference');
const CURRENT_DIR = path.join(SCREENSHOT_BASE_DIR, 'current');
const DIFFERENCE_DIR = path.join(SCREENSHOT_BASE_DIR, 'difference');

// Create screenshot directories if they don't exist
async function ensureDirectories() {
    for (const dir of [REFERENCE_DIR, CURRENT_DIR, DIFFERENCE_DIR]) {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }
}

beforeAll(async () => {
    try {
        await ensureDirectories();
        driver = await AppHelper.launchPhiloApp();
        homeScreen = new HomeScreenPage(driver);
        guidePage = new GuidePage(driver);
        settingsPage = new SettingsPage(driver);
        topPage = new TopPage(driver);
        categoriesPage = new CategoriesPage(driver);
        movieDetailsPage = new MoviesDetailsPage(driver);
        seriesDetailsPage = new SeriesDetailsPage(driver);
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
}, 60000);

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
}, 30000);

describe('Navigation Tests', () => {
    test('TC106 - should display the Settings Page', async () => {
        try {
            // 1. Navigate to and verify Settings page
            await homeScreen.verifySettingsPage(settingsPage, topPage);
        } catch (error) {
            console.error('Settings page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC107 - should display the Guide Page', async () => {
        try {
            // 1. Navigate to and verify Guide page
            await homeScreen.navigateAndVerifyGuidePage(guidePage, topPage);
        } catch (error) {
            console.error('Error in TC107:', error);
            throw error;
        }
    }, 180000);

    test('TC108 - should display the Top Page', async () => {
        try {
            // 1. Navigate to and verify Top page
            await homeScreen.verifyTopPage(topPage);
        } catch (error) {
            console.error('Error in TC108:', error);
            throw error;
        }
    }, 180000);

    test('TC109 - should display the Saved Page', async () => {
        try {
            // 1. Navigate to and verify Saved page
            await homeScreen.verifySavedPage(topPage);
        } catch (error) {
            console.error('Error in TC109:', error);
            throw error;
        }
    }, 180000);

    test('TC110 - should display the Search Page', async () => {
        try {
            // 1. Navigate to and verify Search page
            await homeScreen.verifySearchPage(topPage);
        } catch (error) {
            console.error('Search page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC111 - should display the Top Free Movies category', async () => {
        try {
            // 1. Navigate to and verify Top Free Movies category
            await homeScreen.verifyTopFreeMovies(categoriesPage, topPage);
        } catch (error) {
            console.error('Top Free Movies category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC112 - should display the Top Free Shows category', async () => {
        try {
            // 1. Navigate to and verify Top Free Shows category
            await homeScreen.verifyTopFreeShows(categoriesPage, topPage);
        } catch (error) {
            console.error('Top Free Shows category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC113 - should display the Recommended category', async () => {
        try {
            // 1. Navigate to and verify Recommended category
            await homeScreen.verifyRecommended(categoriesPage, topPage);
        } catch (error) {
            console.error('Recommended category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC115 - should display the Saved category', async () => {
        try {
            // 1. Navigate to and verify Saved category
            await homeScreen.verifySavedCategory(categoriesPage, topPage);
        } catch (error) {
            console.error('Saved category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC114 - should display the Trending Live category', async () => {
        try {
            // 1. Navigate to and verify Trending Live category
            await homeScreen.verifyTrendingLive(categoriesPage, topPage);
        } catch (error) {
            console.error('Trending Live category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC116 - should display the Movie Details Page', async () => {
        try {
            // 1. Verify multiple movies and their details
            const verifiedTitles = await categoriesPage.verifyMultipleMovies(3, movieDetailsPage);
            
            // 2. Verify the number of movies checked
            expect(verifiedTitles.length).toBe(3);
            
            // 3. Verify titles match between category and details pages
            verifiedTitles.forEach(({categoryTitle, detailsTitle}) => {
                expect(categoryTitle).toBe(detailsTitle);
            });
        } catch (error) {
            console.error('Error in TC116:', error);
            throw error;
        }
    }, 180000);

    test('TC117 - should log all category rows', async () => {
        try {
            // 1. Verify home screen is open
            await homeScreen.verifyHomeScreenElements();

            // Create log file
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const logPath = path.join(process.cwd(), 'logs');
            await fs.mkdir(logPath, { recursive: true });
            const logFile = path.join(logPath, `categories_${timestamp}.log`);

            // Write initial timestamp
            await fs.writeFile(logFile, `Starting category scan at ${timestamp}\n\n`);

            // Scan all categories
            const foundCategories = await homeScreen.scanContentCategories();

            // Log final summary
            const summary = `\n=== Scan Complete ===
Total categories found: ${foundCategories.length}

All Categories found:
${foundCategories.join('\n')}`;
            
            await fs.appendFile(logFile, summary);
            console.log('Scan complete. Found', foundCategories.length, 'categories');

        } catch (error) {
            console.error('Error logging categories:', error);
            throw error;
        }
    }, 180000);
}); 
