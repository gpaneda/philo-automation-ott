import { AppHelper } from '../helpers/app.helper';
import type { Browser } from 'webdriverio';
// Importing local modules from index files

import { HomeScreenPage, PlayerPage, CategoriesPage, TopPage, MoviesDetailsPage } from '../fireTVPages';
import { HomeScreenPage as AndroidHomeScreenPage, CategoriesPage as AndroidCategoriesPage, TopPage as AndroidTopPage, MoviesDetailsPage as AndroidMoviesDetailsPage, PlayerPage as AndroidPlayerPage } from '../androidTVPages';

import path from 'path';
import fs from 'fs/promises';

import { GuidePage as AndroidGuidePage, GuidePage } from '../androidTVPages/guide.page';
import { SettingsPage as AndroidSettingsPage, SettingsPage } from '../androidTVPages/settings.page';

let driver: Browser;
let homeScreen: HomeScreenPage | AndroidHomeScreenPage;
let guidePage: GuidePage | AndroidGuidePage;
let settingsPage: SettingsPage | AndroidSettingsPage;
let topPage: TopPage | AndroidTopPage;
let categoriesPage: CategoriesPage | AndroidCategoriesPage;
let movieDetailsPage: MoviesDetailsPage | AndroidMoviesDetailsPage;
let playerPage: PlayerPage | AndroidPlayerPage;
// Define screenshot directories
const SCREENSHOT_BASE_DIR = path.join(process.cwd(), 'screenshots');
const REFERENCE_DIR = path.join(SCREENSHOT_BASE_DIR, 'reference');
const CURRENT_DIR = path.join(SCREENSHOT_BASE_DIR, 'current');
const DIFFERENCE_DIR = path.join(SCREENSHOT_BASE_DIR, 'difference');

// Create screenshot directories if they don't exist
async function ensureDirectories() {
    const dirs = [REFERENCE_DIR, CURRENT_DIR, DIFFERENCE_DIR];
    await Promise.all(dirs.map(async (dir) => {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }));
}

async function initializeDriverAndPages() {
    driver = await AppHelper.initializeDriver();
    if (AppHelper.deviceType === 'androidTV') {
        playerPage = new AndroidPlayerPage(driver);
        homeScreen = new AndroidHomeScreenPage(driver);
        categoriesPage = new AndroidCategoriesPage(driver);
        settingsPage = new AndroidSettingsPage(driver);
        topPage = new AndroidTopPage(driver);
        guidePage = new AndroidGuidePage(driver);
        movieDetailsPage = new AndroidMoviesDetailsPage(driver, playerPage as AndroidPlayerPage);
    } else {
        playerPage = new PlayerPage(driver);
        homeScreen = new HomeScreenPage(driver);
        categoriesPage = new CategoriesPage(driver);
        guidePage = new GuidePage(driver);
        settingsPage = new SettingsPage(driver);
        topPage = new TopPage(driver);
        movieDetailsPage = new MoviesDetailsPage(driver, playerPage as PlayerPage);
    }
}

async function verifyEnvVars(requiredEnvVars: string[]) {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
}

async function logError(message: string, error: any) {
    console.error(message, error);
    // Optionally, log to a file or monitoring system
}

beforeAll(async () => {
    
    try {


        const requiredEnvVars = [
            'FIRE_TV_IP',
            'FIRE_TV_PORT',
            'PHILO_EMAIL',
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET',
            'GMAIL_REFRESH_TOKEN',
            'GMAIL_ACCESS_TOKEN',
            'PHILO_EMAIL_2',
            'PHILO_EMAIL_3',
            'ANDROID_TV_IP',
            'ANDROID_TV_PORT'
        ];

        await verifyEnvVars(requiredEnvVars);
        await AppHelper.clearAppData();
        
        const loginSuccess = await AppHelper.loginToPhilo();
        if (!loginSuccess) throw new Error('Failed to login to Philo');

        await initializeDriverAndPages();
    } catch (error) {
        await logError('Error in beforeAll:', error);
        throw error;
    }
}, 120000);

beforeEach(async () => {
    try {
        await driver.terminateApp(AppHelper.appPackage);
        await driver.pause(2000);
        await driver.activateApp(AppHelper.appPackage);
        await driver.pause(5000);
    } catch (error) {
        await logError('Error in beforeEach:', error);
        throw error;
    }
});

afterAll(async () => {
    // Clean up app data after test
    console.log('Clearing app data after test...');
    await AppHelper.clearAppData();
});

describe('Navigation Tests', () => {
    
    test('TC106 - should display the Settings Page', async () => {
        try {
            // Step 1: Navigate to and verify Settings page
            await homeScreen.pressUpButton();
            await driver.pause(3000);
            await homeScreen.navigateToSettings();
            expect(await settingsPage.isSignInInformationDisplayed()).toBe(true);
        } catch (error) {
            await logError('Settings page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC107 - should display the Guide Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await driver.pause(3000);
            await homeScreen.navigateToGuide();
            expect(await guidePage.isFreeChannelsDisplayed()).toBe(true);
            // Step 1: Navigate to and verify Guide page
            //console.log('Step 1: Navigating to and verifying Guide page');
            //await homeScreen.navigateAndVerifyGuidePage(guidePage, topPage);
        } catch (error) {
            await logError('Guide page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC108 - should display the Top Page', async () => {
        try {
            // Step 1: Navigate to and verify Top page
            console.log('Step 1: Navigating to and verifying Top page');
            await homeScreen.verifyTopPage(topPage);
        } catch (error) {
            await logError('Error in TC108:', error);
            throw error;
        }
    }, 180000);

    test('TC109 - should display the Saved Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await driver.pause(3000);
            await homeScreen.navigateToSaved();
            expect(await homeScreen.isElementDisplayed(homeScreen.selectors.topNavSaved)).toBe(true);
        } catch (error) {
            await logError('Saved page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC110 - should display the Search Page', async () => {
        try {
            // Step 1: Navigate to and verify Search page
            //console.log('Step 1: Navigating to and verifying Search page');
            //await homeScreen.verifySearchPage(topPage);
            await homeScreen.pressUpButton();
            await driver.pause(3000);
            await homeScreen.navigateToSearch();
            expect(await homeScreen.isElementDisplayed(homeScreen.selectors.topNavSearch)).toBe(true);
        } catch (error) {
            await logError('Search page was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC111 - should display the Top Free Movies category', async () => {
        try {
            // Step 1: Navigate to and verify Top Free Movies category
            console.log('Step 1: Navigating to and verifying Top Free Movies category');
            await driver.pause(5000);
            await homeScreen.verifyTopFreeMovies(categoriesPage, topPage);
        } catch (error) {
            await logError('Top Free Movies category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC112 - should display the Top Free Shows category', async () => {
        try {
            // Step 1: Navigate to and verify Top Free Shows category
            console.log('Step 1: Navigating to and verifying Top Free Shows category');
            await driver.pause(5000);
            await homeScreen.verifyTopFreeShows(categoriesPage, topPage);
        } catch (error) {
            await logError('Top Free Shows category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC113 - should display the Recommended category', async () => {
        try {
            // Step 1: Navigate to and verify Recommended category
            console.log('Step 1: Navigating to and verifying Recommended category');
            await homeScreen.verifyRecommended(categoriesPage, topPage);
        } catch (error) {
            await logError('Recommended category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC115 - should display the Saved category', async () => {
        try {
            // Step 1: Navigate to and verify Saved category
            console.log('Step 1: Navigating to and verifying Saved category');
            await homeScreen.verifySavedCategory(categoriesPage, topPage);
        } catch (error) {
            await logError('Saved category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test('TC114 - should display the Trending Live category', async () => {
        try {
            // Step 1: Navigate to and verify Trending Live category
            console.log('Step 1: Navigating to and verifying Trending Live category');
            await homeScreen.verifyTrendingLive(categoriesPage, topPage);
        } catch (error) {
            await logError('Trending Live category was not displayed:', error);
            throw error;
        }
    }, 180000);

    test.only('TC116 - should display the Movie Details Page', async () => {
        try {
            // Step 1: Verify multiple movies and their details
            console.log('Step 1: Verifying multiple movies and their details');
            await driver.pause(5000);
            const verifiedTitles = await categoriesPage.verifyMultipleMovies(3, movieDetailsPage);
            
            // Step 2: Verify the number of movies checked
            console.log('Step 2: Verifying number of movies checked');
            expect(verifiedTitles.length).toBe(3);
            
            // Step 3: Verify titles match between category and details pages
            console.log('Step 3: Verifying title matches');
            verifiedTitles.forEach(({categoryTitle, detailsTitle}) => {
                expect(categoryTitle).toBe(detailsTitle);
            });
        } catch (error) {
            await logError('Error in TC116:', error);
            throw error;
        }
    }, 180000);

    test('TC117 - should log all category rows', async () => {
        try {
            // Step 1: Verify home screen is open
            console.log('Step 1: Verifying home screen is open');
            await homeScreen.verifyHomeScreenElements();

            // Step 2: Create log file
            console.log('Step 2: Creating log file');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const logPath = path.join(process.cwd(), 'logs');
            await fs.mkdir(logPath, { recursive: true });
            const logFile = path.join(logPath, `categories_${timestamp}.log`);
            await fs.writeFile(logFile, `Starting category scan at ${timestamp}\n\n`);

            // Step 3: Scan all categories
            console.log('Step 3: Scanning all categories');
            const foundCategories = await homeScreen.scanContentCategories();

            // Step 4: Log final summary
            console.log('Step 4: Logging final summary');
            const summary = `\n=== Scan Complete ===\nTotal categories found: ${foundCategories.length}\n\nAll Categories found:\n${foundCategories.join('\n')}`;
            await fs.appendFile(logFile, summary);
            console.log('Scan complete. Found', foundCategories.length, 'categories');
        } catch (error) {
            await logError('Error logging categories:', error);
            throw error;
        }
    }, 180000);

    test('TC118 - should log all movie titles in Top Free Movies row', async () => {
        try {
            // Step 1: Verify home screen is open
            console.log('Step 1: Verifying home screen is open');
            await homeScreen.verifyHomeScreenElements();

            // Step 2: Create log file
            console.log('Step 2: Creating log file');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const logPath = path.join(process.cwd(), 'logs');
            await fs.mkdir(logPath, { recursive: true });
            const logFile = path.join(logPath, `movie_titles_${timestamp}.log`);
            await fs.writeFile(logFile, `Starting movie title scan at ${timestamp}\n\n`);

            // Step 3: Navigate to Top Free Movies row
            console.log('Step 3: Navigating to Top Free Movies row');
            const found = await homeScreen.findCategory('Top Free Movies');
            if (!found) {
                throw new Error('Top Free Movies category not found');
            }

            // Step 4: Position at start of row
            console.log('Step 4: Positioning at start of row');
            await homeScreen.pressDownButton();
            await driver.pause(2000);
            await homeScreen.pressUpButton();
            await driver.pause(2000);
            for (let i = 0; i < 5; i++) {
                await homeScreen.pressLeftButton();
                await driver.pause(1000);
            }

            // Step 5: Scan through row and collect titles
            console.log('Step 5: Scanning through row and collecting titles');
            const movieTitles: string[] = [];
            let previousTitle = '';
            let samePositionCount = 0;
            const maxAttempts = 30;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const focusedElement = await driver.$('android=focused(true)');
                const title = await focusedElement.getAttribute('content-desc');

                if (title) {
                    await fs.appendFile(logFile, `\nPress ${attempt + 1}: Found movie "${title}"\n`);
                    
                    if (!movieTitles.includes(title)) {
                        movieTitles.push(title);
                        await fs.appendFile(logFile, `*** New movie added to list ***\n`);
                    }

                    if (title === previousTitle) {
                        samePositionCount++;
                        if (samePositionCount >= 3) {
                            await fs.appendFile(logFile, `\nReached end of row (same title "${title}" found 3 times)\n`);
                            break;
                        }
                    } else {
                        samePositionCount = 0;
                    }
                    previousTitle = title;
                }

                await homeScreen.pressRightButton();
                await driver.pause(1500);
            }

            // Step 6: Log final summary
            console.log('Step 6: Logging final summary');
            const summary = `\n=== Scan Complete ===\nTotal unique movies found: ${movieTitles.length}\n\nAll Movies in order of discovery:\n${movieTitles.join('\n')}`;
            await fs.appendFile(logFile, summary);
            console.log('Scan complete. Found', movieTitles.length, 'movies');
        } catch (error) {
            await logError('Error scanning movie titles:', error);
            throw error;
        }
    }, 180000);
}); 
