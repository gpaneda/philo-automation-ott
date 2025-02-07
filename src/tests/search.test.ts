import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import WebSocketHelper from '../utils/WebSocketHelper';
import { HomeScreenPage, CategoriesPage, SearchPage, PlayerPage, MoviesDetailsPage } from '../fireTVPages';
import { HomeScreenPage as AndroidHomeScreenPage, CategoriesPage as AndroidCategoriesPage, SearchPage as AndroidSearchPage, PlayerPage as AndroidPlayerPage, MoviesDetailsPage as AndroidMoviesDetailsPage } from '../androidTVPages';
import path from 'path';
import fs from 'fs/promises';

const APP_TERMINATION_DELAY = 2000;
const APP_ACTIVATION_DELAY = 5000;

let driver: Browser;
let homeScreen: HomeScreenPage | AndroidHomeScreenPage;
let categoriesPage: CategoriesPage | AndroidCategoriesPage;
let searchPage: SearchPage | AndroidSearchPage;
let playerPage: PlayerPage | AndroidPlayerPage;
let moviesDetailsPage: MoviesDetailsPage | AndroidMoviesDetailsPage;
let webSocketHelper: WebSocketHelper;

// Helper function to terminate and activate the app
const terminateAndActivateApp = async () => {
    await driver.terminateApp(AppHelper.appPackage);
    await driver.pause(APP_TERMINATION_DELAY);
    await driver.activateApp(AppHelper.appPackage);
    await driver.pause(APP_ACTIVATION_DELAY);
};

beforeAll(async () => {
    try {
        // Create screenshots directory if it doesn't exist
        const screenshotsDir = path.join(process.cwd(), 'screenshots', 'debug');
        await fs.mkdir(screenshotsDir, { recursive: true });

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
            playerPage = new AndroidPlayerPage(driver);
            homeScreen = new AndroidHomeScreenPage(driver);
            categoriesPage = new AndroidCategoriesPage(driver);
            searchPage = new AndroidSearchPage(driver);
            moviesDetailsPage = new AndroidMoviesDetailsPage(driver, playerPage as AndroidPlayerPage);
        } else {
            playerPage = new PlayerPage(driver);
            homeScreen = new HomeScreenPage(driver);
            categoriesPage = new CategoriesPage(driver);
            searchPage = new SearchPage(driver);
            moviesDetailsPage = new MoviesDetailsPage(driver, playerPage as PlayerPage);
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

describe('Search Test', () => {
    test('TC501 - should display Search Results for Series', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
            await searchPage.enterSearchTerm('Series');
            await driver.pause(3000);
            await homeScreen.pressEnterButton();

            // Verify that the search results display Channels, Shows, Episodes Header Text
            const headerTexts = await searchPage.getHeaderText();
            console.log('Header Texts:', headerTexts);
            expect(headerTexts).toContain('Shows');
        } catch (error) {
            console.error('Error in TC501:', error);
            throw error;
        }
    }, 180000);

    test('TC502 - should display Search Results for Movies', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
            await searchPage.enterSearchTerm('Movies');
            await driver.pause(3000);
            await homeScreen.pressEnterButton();

            // Verify that the search results display Channels, Shows, Episodes Header Text
            const headerTexts = await searchPage.getHeaderText();
            console.log('Header Texts:', headerTexts);
            expect(headerTexts).toContain('Movies');
        } catch (error) {
            console.error('Error in TC502:', error);
            throw error;
        }
    }, 180000);

    test('TC503 - should display Search Results for Channels', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
            await searchPage.enterSearchTerm('AMC');
            await driver.pause(3000);
            await homeScreen.pressEnterButton();

            // Verify that the search results display Channels, Shows, Episodes Header Text
            const headerTexts = await searchPage.getHeaderText();
            console.log('Header Texts:', headerTexts);
            expect(headerTexts).toContain('Channels');

            // Goes to Keyboard
            for (let i = 0; i < 2; i++) {
                await homeScreen.pressDownButton();
            }
            // Press right button until channels row is in focus and go to channels row
            for (let i = 0; i < 7; i++) {
                await homeScreen.pressRightButton();
            }
            await driver.pause(3000);
            await searchPage.interactWithSearchResults();
            // Check if Channels Text is displayed
            expect(await searchPage.isElementDisplayed(searchPage.labelTileGroup)).toBe(true);
            console.log('Channels Text is displayed');
        } catch (error) {
            console.error('Error in TC503:', error);
            throw error;
        }
    }, 180000);

    test('TC504 - should display Empty State when no results are found', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
            // Enter a search term that does not exist
            await searchPage.enterSearchTerm('skdhfkadfkjdfhak');
            await driver.pause(3000);
            await homeScreen.pressEnterButton();

            // Expect Channels, Shows, Episodes, Movies does not exist - header text is empty    
            const headerTexts = await searchPage.getHeaderText();
            console.log('Header Texts:', headerTexts);
            expect(headerTexts).not.toContain('Channels');
            expect(headerTexts).not.toContain('Shows');
            expect(headerTexts).not.toContain('Episodes');
            expect(headerTexts).not.toContain('Movies');
            console.log('Empty State is displayed');
        } catch (error) {
            console.error('Error in TC504:', error);
            throw error;
        }
    }, 180000);

    test('TC505 - should display Search Results for Specific Title', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
            await searchPage.enterSearchTerm('The Walking Dead');
            await driver.pause(3000);
            await homeScreen.pressEnterButton();

            // Verify that the search results display Channels, Shows, Episodes Header Text
            const headerTexts = await searchPage.getHeaderText();
            console.log('Header Texts:', headerTexts);
            expect(headerTexts).toContain('Shows');

            // Goes to Keyboard
            for (let i = 0; i < 2; i++) {
                await homeScreen.pressDownButton();
            }
            // Press right button until channels row is in focus and go to channels row
            for (let i = 0; i < 7; i++) {
                await homeScreen.pressRightButton();
            }
            await driver.pause(3000);
            await searchPage.interactWithSearchResults();
            // Press Enter Button
            await homeScreen.pressEnterButton();
            // Verify that any of the Walking Dead shows are displayed
            const possibleElements = [
                'topShowsWalkingDeadUniverse',
                'fearTheWalkingDead',
                'theWalkingDead',
                'theWalkingDeadDarylDixon',
                'theWalkingDeadWorldBeyond'
            ] as const;

            let foundShow = false;
            for (const elementName of possibleElements) {
                try {
                    console.log(`Checking for element: ${elementName}`);
                    const element = await searchPage.getElement(elementName);
                    const isVisible = await element.isDisplayed();
                    console.log(`Element ${elementName} visibility:`, isVisible);
                    if (isVisible) {
                        foundShow = true;
                        console.log(`Found visible show: ${elementName}`);
                        break;
                    }
                } catch (error) {
                    console.log(`Element ${elementName} not found:`, error.message);
                    continue;
                }
            }

            expect(foundShow).toBe(true);
        } catch (error) {
            console.error('Error in TC505:', error);
            throw error;
        }
    }, 180000);
});


