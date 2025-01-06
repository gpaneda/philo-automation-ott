import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
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

//Create afterEach to exit the app then open it back up to home screen separate from afterAll

afterAll(async () => {
    try {
        if (driver) {
            console.log('Terminating app...');
            await driver.terminateApp('com.philo.philo');
            await driver.pause(2000);
            
            console.log('Cleaning up WebDriver session...');
            await driver.deleteSession();
            await new Promise(resolve => setTimeout(resolve, 10000));
            console.log('WebDriver session cleaned up successfully');
        }
    } catch (error) {
        console.error('Error in afterAll:', error);
    }
}, 30000);

describe('Navigation Tests', () => {
    test('TC106 - should display the Settings Page', async () => {
        try {
            await homeScreen.verifySettingsPage(settingsPage, topPage);
        } catch (error) {
            console.error('Settings page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC107 - should display the Guide Page', async () => {
        try {
            await homeScreen.navigateAndVerifyGuidePage(guidePage, topPage);
        } catch (error) {
            console.error('Error in TC107:', error);
            throw error;
        }
    }, 180000);

    test('TC108 - should display the Top Page', async () => {
        try {
            await homeScreen.verifyTopPage(topPage);
        } catch (error) {
            console.error('Error in TC108:', error);
            throw error;
        }
    }, 180000);

    test('TC109 - should display the Saved Page', async () => {
        try {
            await homeScreen.verifySavedPage(topPage);
        } catch (error) {
            console.error('Error in TC109:', error);
            throw error;
        }
    }, 180000);

    test('TC110 - should display the Search Page', async () => {
        try {
            await homeScreen.verifySearchPage(topPage);
        } catch (error) {
            console.error('Search page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC111 - should display the Top Free Movies category', async () => {
        try {
            await homeScreen.verifyTopFreeMovies(categoriesPage, topPage);
        } catch (error) {
            console.error('Top Free Movies category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC112 - should display the Top Free Shows category', async () => {
        try {
            await homeScreen.verifyTopFreeShows(categoriesPage, topPage);
        } catch (error) {
            console.error('Top Free Shows category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC113 - should display the Recommended category', async () => {
        try {
            await homeScreen.verifyRecommended(categoriesPage, topPage);
        } catch (error) {
            console.error('Recommended category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC115 - should display the Saved category', async () => {
        try {
            await homeScreen.verifySavedCategory(categoriesPage, topPage);
        } catch (error) {
            console.error('Saved category was not displayed:', error);
            throw error;
        }
    }, 180000);
    test('TC114 - should display the Trending Live category', async () => {
        try {
            await homeScreen.verifyTrendingLive(categoriesPage, topPage);
        } catch (error) {
            console.error('Trending Live category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC116 - should display the Movie Details Page', async () => {
        try {
            const verifiedTitles = await categoriesPage.verifyMultipleMovies(3, movieDetailsPage);
            expect(verifiedTitles.length).toBe(3);
            verifiedTitles.forEach(({categoryTitle, detailsTitle}) => {
                expect(categoryTitle).toBe(detailsTitle);
            });
        } catch (error) {
            console.error('Error in TC116:', error);
            throw error;
        }
    }, 180000);
}); 
