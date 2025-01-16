import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { CategoriesPage } from '../pages/categories.page';
import { MoviesDetailsPage } from '../pages/moviesDetails.page';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let driver: Browser<'async'>;
let homeScreen: HomeScreenPage;
let categoriesPage: CategoriesPage;
let moviesDetailsPage: MoviesDetailsPage;

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
        await driver.pause(5000); // Wait for app to fully load

        // Initialize page objects
        homeScreen = new HomeScreenPage(driver);
        categoriesPage = new CategoriesPage(driver);
        moviesDetailsPage = new MoviesDetailsPage(driver);
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

// Test cases will be added here
describe('Movies Details Page', () => {
    test('TC124 - Verify that user can click on a movie and see its details', async () => {
        await categoriesPage.goToTopFreeMovies();
        await categoriesPage.waitForMovieTilesLoaded();
        
        // Get all visible movie titles
        const titles = await categoriesPage.getVisibleMovieTitles();
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

    test('TC125 - should get the movie description, rating, rating advisories, release date, and channel name', async () => {
        await categoriesPage.goToTopFreeMovies();
        await driver.pause(2000); // Wait for content to load

        // Move focus to the desired movie tile
        await homeScreen.pressRightButton();
        await driver.pause(1000);

        // Get title of focused movie
        const titleBefore = await homeScreen.getSecondMovieTitle();
        console.log(`Title of the movie before: ${titleBefore}`);

        // Click on the movie
        await homeScreen.clickMovieTile();
        await driver.pause(2000); // Wait for details page to load

        // Get movie details
        const description = await moviesDetailsPage.getMovieDescription();
        console.log(`Description of the movie: ${description}`);
        //Get rating
        const rating = await moviesDetailsPage.getMovieRating();
        console.log(`Rating of the movie: ${rating}`);
        //Get rating advisories
        const ratingAdvisories = await moviesDetailsPage.getRatingAdvisories();
        console.log(`Rating advisories of the movie: ${ratingAdvisories}`);
        //Get release date
        const releaseDate = await moviesDetailsPage.getReleaseDate();
        console.log(`Release date of the movie: ${releaseDate}`);
    });
});
