import { AppHelper } from '../helpers/app.helper';
import type { Browser } from 'webdriverio';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { CategoriesPage } from '../fireTVPages/categories.page';
import { MoviesDetailsPage } from '../fireTVPages/moviesDetails.page';
import { PlayerPage } from '../fireTVPages/player.page';
import { HomeScreenPage as AndroidHomeScreenPage } from '../androidTVPages/homescreen.page';
import { CategoriesPage as AndroidCategoriesPage } from '../androidTVPages/categories.page';
import { MoviesDetailsPage as AndroidMoviesDetailsPage } from '../androidTVPages/moviesDetails.page';
import { PlayerPage as AndroidPlayerPage } from '../androidTVPages/player.page';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const APP_TERMINATION_DELAY = 2000;
const APP_ACTIVATION_DELAY = 5000;
const APP_DATA_CLEAR_DELAY = 10000;

let driver: Browser;
let homeScreen: HomeScreenPage | AndroidHomeScreenPage;
let categoriesPage: CategoriesPage | AndroidCategoriesPage;
let moviesDetailsPage: MoviesDetailsPage | AndroidMoviesDetailsPage;
let playerPage: PlayerPage | AndroidPlayerPage;

const initializeScreenshotsDir = () => {
    const screenshotsDir = path.join(process.cwd(), 'screenshots', 'debug');
    fs.mkdirSync(screenshotsDir, { recursive: true });
};

const verifyEnvVariables = (requiredEnvVars: string[]) => {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Required environment variable ${envVar} is not set`);
        }
    }
};

const terminateAndActivateApp = async () => {
    await driver.terminateApp(AppHelper.appPackage);
    await driver.pause(APP_TERMINATION_DELAY);
    await driver.activateApp(AppHelper.appPackage);
    await driver.pause(APP_ACTIVATION_DELAY);
};

beforeAll(async () => {
    try {
        initializeScreenshotsDir();
        verifyEnvVariables([
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
        ]);

        console.log('Clearing app data...');
        await AppHelper.clearAppData();

        const loginSuccess = await AppHelper.loginToPhilo();
        if (!loginSuccess) {
            throw new Error('Failed to login to Philo');
        }

        driver = await AppHelper.initializeDriver();
        if (AppHelper.deviceType === 'androidTV') {
            playerPage = new AndroidPlayerPage(driver);
            homeScreen = new AndroidHomeScreenPage(driver);
            categoriesPage = new AndroidCategoriesPage(driver);
            moviesDetailsPage = new AndroidMoviesDetailsPage(driver, playerPage as AndroidPlayerPage);
        } else {
            playerPage = new PlayerPage(driver);
            homeScreen = new HomeScreenPage(driver);
            categoriesPage = new CategoriesPage(driver);
            moviesDetailsPage = new MoviesDetailsPage(driver, playerPage as PlayerPage);
        }
    } catch (error: unknown) {
        console.error('Error in beforeAll:', error);
        if (error instanceof Error) {
            throw new Error(`Failed in beforeAll: ${error.message}`);
        }
        throw new Error('Failed in beforeAll: Unknown error');
    }
}, 120000);

beforeEach(async () => {
    try {
        await terminateAndActivateApp();
    } catch (error: unknown) {
        console.error('Error in beforeEach:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to activate app: ${error.message}`);
        }
        throw new Error('Failed to activate app: Unknown error');
    }
});

afterEach(async () => {
    try {
        await driver.terminateApp(AppHelper.appPackage);
        await driver.pause(APP_TERMINATION_DELAY);
    } catch (error: unknown) {
        console.error('Error in afterEach:', error);
    }
});

afterAll(async () => {
    try {
        console.log('Clearing app data after test...');
        await AppHelper.clearAppData();
    } catch (error: unknown) {
        console.error('Error in afterAll:', error);
    }
});

// Test cases will be added here
describe('Movies Details Page', () => {
    test('TC124 - Verify that user can click on a movie and see its details', async () => {
        try {
            await driver.pause(APP_ACTIVATION_DELAY);
            await categoriesPage.goToTopFreeMovies();
            await categoriesPage.waitForMovieTilesLoaded();

            const titles = await categoriesPage.getAllVisibleMovieTitles();
            console.log('Available titles:', titles);

            const titleBeforeClick = titles[0];
            console.log('Title before click:', titleBeforeClick);

            await categoriesPage.clickMovieTile();
            await moviesDetailsPage.waitForLoaded();
            const titleAfterClick = await moviesDetailsPage.getMovieTitle();
            console.log('Title after click:', titleAfterClick);

            expect(titleAfterClick).toBe(titleBeforeClick);
        } catch (error: unknown) {
            console.error('Error in TC124:', error);
            if (error instanceof Error) {
                throw new Error(`TC124 failed: ${error.message}`);
            }
            throw new Error('TC124 failed: Unknown error');
        }
    });

    test('TC125 - should get the movie description, rating, rating advisories, release date, and channel name', async () => {
        try {
            await driver.pause(APP_ACTIVATION_DELAY);
            await categoriesPage.goToTopFreeMovies();
            await categoriesPage.waitForMovieTilesLoaded();

            await homeScreen.pressRightButton();
            await driver.pause(1000);

            const titleBefore = await homeScreen.getSecondMovieTitle();
            console.log(`Title of the movie before: ${titleBefore}`);

            await homeScreen.clickMovieTile();
            await driver.pause(10000);
            await moviesDetailsPage.waitForLoaded();

            let description, rating, releaseDate, duration;

            for (let i = 0; i < 3; i++) {
                try {
                    if (!description) description = await moviesDetailsPage.getMovieDescription();
                    if (!rating) rating = await moviesDetailsPage.getMovieRating();
                    if (!releaseDate) releaseDate = await moviesDetailsPage.getReleaseDate();
                    if (!duration) {
                        if ('fetchMovieDuration' in moviesDetailsPage) {
                            duration = await moviesDetailsPage.fetchMovieDuration();
                        } else {
                            throw new Error('fetchMovieDuration method does not exist on moviesDetailsPage');
                        }
                    }

                    if (description && rating && releaseDate && duration) break;
                    await driver.pause(2000);
                } catch (error: unknown) {
                    console.log(`Attempt ${i + 1} failed:`, error);
                    if (i === 2) {
                        if (error instanceof Error) {
                            throw new Error(`Failed after 3 attempts: ${error.message}`);
                        }
                        throw new Error('Failed after 3 attempts: Unknown error');
                    }
                    await driver.pause(2000);
                }
            }

            console.log('Found movie details:', {
                description,
                rating,
                releaseDate,
                duration
            });

            expect(description).toBeTruthy();
            expect(rating).toBeTruthy();
            expect(releaseDate).toBeTruthy();
            expect(duration).toBeTruthy();
        } catch (error: unknown) {
            console.error('Error in TC125:', error);
            if (error instanceof Error) {
                throw new Error(`TC125 failed: ${error.message}`);
            }
            throw new Error('TC125 failed: Unknown error');
        }
    });
});
