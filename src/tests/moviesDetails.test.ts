import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { CategoriesPage } from '../fireTVPages/categories.page';
import { MoviesDetailsPage } from '../fireTVPages/moviesDetails.page';
import { HomeScreenPage as AndroidHomeScreenPage } from '../androidTVPages/homescreen.page';
import { CategoriesPage as AndroidCategoriesPage } from '../androidTVPages/categories.page';
import { MoviesDetailsPage as AndroidMoviesDetailsPage } from '../androidTVPages/moviesDetails.page';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';


// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let driver: Browser<'async'>;
let homeScreen: HomeScreenPage | AndroidHomeScreenPage;
let categoriesPage: CategoriesPage | AndroidCategoriesPage;
let moviesDetailsPage: MoviesDetailsPage | AndroidMoviesDetailsPage;

beforeAll(async () => {
    try {
        // Create screenshots directory if it doesn't exist
        const screenshotsDir = path.join(process.cwd(), 'screenshots', 'debug');
        fs.mkdirSync(screenshotsDir, { recursive: true });

        // First verify required environment variables
        const requiredEnvVars = [
            'FIRE_TV_IP',
            'FIRE_TV_PORT',
            'PHILO_EMAIL',
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET',
            'GMAIL_REFRESH_TOKEN',
            'GMAIL_REDIRECT_URI'
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
            moviesDetailsPage = new AndroidMoviesDetailsPage(driver);
        } else {
            homeScreen = new HomeScreenPage(driver);
            categoriesPage = new CategoriesPage(driver);
            moviesDetailsPage = new MoviesDetailsPage(driver);
        }
    } catch (error) {
        console.error('Error in beforeAll:', error);
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
        console.error('Error in beforeEach:', error);
        throw error;
    }
});

//afterEach(async () => {
    //try {
        //await driver.terminateApp(AppHelper.appPackage);
        //await driver.pause(2000);
    //} catch (error) {
        //console.error('Error in afterEach:', error);
    //}
//});

//afterAll(async () => {
    // Clean up app data after test
    //console.log('Clearing app data after test...');
    //await AppHelper.clearAppData();
//});

// Test cases will be added here
describe('Movies Details Page', () => {
    test('TC124 - Verify that user can click on a movie and see its details', async () => {
        await driver.pause(5000);
        await categoriesPage.goToTopFreeMovies();
        await categoriesPage.waitForMovieTilesLoaded();

        // Get all visible movie titles
        const titles = await categoriesPage.getAllVisibleMovieTitles();
        console.log('Available titles:', titles);

        // Get the first movie title
        const titleBeforeClick = titles[0];
        console.log('Title before click:', titleBeforeClick);

        // Click on the movie tile
        await categoriesPage.clickMovieTile();

        // Wait for movie details page to load and get the title
        await moviesDetailsPage.waitForLoaded();
        const titleAfterClick = await moviesDetailsPage.getMovieTitle();
        console.log('Title after click:', titleAfterClick);

        expect(titleAfterClick).toBe(titleBeforeClick);
    });

    test.only('TC125 - should get the movie description, rating, rating advisories, release date, and channel name', async () => {
        await driver.pause(5000);
        await categoriesPage.goToTopFreeMovies();
        await categoriesPage.waitForMovieTilesLoaded();

        // Move focus to the desired movie tile
        await homeScreen.pressRightButton();
        await driver.pause(1000);

        // Get title of focused movie
        const titleBefore = await homeScreen.getSecondMovieTitle();
        console.log(`Title of the movie before: ${titleBefore}`);

        // Click on the movie
        await homeScreen.clickMovieTile();
        
        // Add longer wait for movie details page to load and animations to complete
        await driver.pause(10000);
        
        // Wait for movie details page to load
        await moviesDetailsPage.waitForLoaded();

        //Verify that the movie title is displayed
        const movieTitle = await moviesDetailsPage.getMovieTitle();
        expect(movieTitle).toBe(titleBefore);
        //Verify that the movie description is displayed
        const movieDescription = await moviesDetailsPage.getMovieDescription();
        expect(movieDescription).toBeTruthy();
        //Verify that the movie release year is displayed
        const movieReleaseYear = await moviesDetailsPage.getReleaseDate();
        expect(movieReleaseYear).toBeTruthy();
     


        //add a screenshot then save it to screenshots/debug
        const screenshot = await driver.takeScreenshot();   
        const screenshotPath = path.join(process.cwd(), 'screenshots', 'debug', 'moviesDetails.png');
        fs.writeFileSync(screenshotPath, screenshot);
        await driver.pause(5000);
    });
});
