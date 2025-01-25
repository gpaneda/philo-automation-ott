import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { SettingsPage } from '../pages/settings.page';
import { TopPage } from '../pages/top.page';

import { CategoriesPage } from '../pages/categories.page';
import { MoviesDetailsPage } from '../pages/moviesDetails.page';
import { SearchPage } from '../pages/search.page';
import { preProcessFile } from 'typescript';

let driver: Browser<'async'>;
let homeScreen: HomeScreenPage;
let settingsPage: SettingsPage;
let topPage: TopPage;
let categoriesPage: CategoriesPage;
let movieDetailsPage: MoviesDetailsPage;
let searchPage: SearchPage;

beforeAll(async () => {
    try {
        const requiredEnvVars = [
            'FIRE_TV_IP',
            'FIRE_TV_PORT',
            'PHILO_EMAIL',
            'GMAIL_CLIENT_ID',
            'GMAIL_CLIENT_SECRET',
            'GMAIL_REFRESH_TOKEN',
            'GMAIL_ACCESS_TOKEN'
        ];

        // Verify all required environment variables are set
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        }

        // Clear app data and login to Philo
        await AppHelper.clearAppData();
        const loginSuccess = await AppHelper.loginToPhilo();
        if (!loginSuccess) {
            throw new Error('Failed to login to Philo');
        }

        // Initialize driver and page objects
        driver = await AppHelper.initializeDriver();
        homeScreen = new HomeScreenPage(driver);
        settingsPage = new SettingsPage(driver);
        topPage = new TopPage(driver);
        categoriesPage = new CategoriesPage(driver);
        movieDetailsPage = new MoviesDetailsPage(driver);
        searchPage = new SearchPage(driver);

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
afterAll(async () => {
    // Clean up app data after test
    console.log('Clearing app data after test...');
    await AppHelper.clearAppData();
});

describe('Search Test', () => {
    test('TC501 - should display Search Results for Series', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
            } catch (error) {
                console.error('Search page was not displayed:', error);
                throw error;
            }

            await searchPage.enterSearchTerm('Series');
            await driver.pause(3000);
            await homeScreen.pressEnterButton();

            //Verify that the search results displays Channels, Shows, Episodes Header Text
            const headerTexts = await searchPage.getHeaderText();
            console.log('Header Texts:', headerTexts);
            expect(headerTexts).toContain('Shows');
        }, 180000);

    test('TC502 - should display Search Results for Movies', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
        } catch (error) {
            console.error('Search page was not displayed:', error);
            throw error;
        }

        await searchPage.enterSearchTerm('Movies');
        await driver.pause(3000);
        await homeScreen.pressEnterButton();

        //Verify that the search results displays Channels, Shows, Episodes Header Text
        const headerTexts = await searchPage.getHeaderText();
        console.log('Header Texts:', headerTexts);
        expect(headerTexts).toContain('Movies');
    }, 180000);

    test('TC503 - should display Search Results for Channels', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
        } catch (error) {
            console.error('Search page was not displayed:', error);
            throw error;
        }

        await searchPage.enterSearchTerm('AMC');
        await driver.pause(3000);
        await homeScreen.pressEnterButton();

        //Verify that the search results displays Channels, Shows, Episodes Header Text
        const headerTexts = await searchPage.getHeaderText();
        console.log('Header Texts:', headerTexts);
        expect(headerTexts).toContain('Channels');
        
        //Goes to Keyboard
        for (let i = 0; i < 2; i++) {
            await homeScreen.pressDownButton();
        }
        //Press right button until channels row is in focus and go to channels row
        for (let i = 0; i < 7; i++) {
            await homeScreen.pressRightButton();
        }
        await driver.pause(3000);
        await searchPage.interactWithSearchResults();
        //Check if Channels Text is displayed
        expect(await searchPage.isElementDisplayed(searchPage.labelTileGroup)).toBe(true);
        //Add console log to check if Channels Text is displayed
        console.log('Channels Text is displayed');
    }, 180000);

    test('TC504 - should display Empty State when no results are found', async () => {
        try {
            await searchPage.navigateToSearchAndVerify();
        } catch (error) {
            console.error('Search page was not displayed:', error);
            throw error;
        }
        //Enter a search term that does not exist
        await searchPage.enterSearchTerm('skdhfkadfkjdfhak');
        await driver.pause(3000);
        await homeScreen.pressEnterButton();

        //Expect Channels, Shows, Episodes, Movies does not exist - header text is empty    
        const headerTexts = await searchPage.getHeaderText();
        console.log('Header Texts:', headerTexts);
        expect(headerTexts).not.toContain('Channels');
        expect(headerTexts).not.toContain('Shows');
        expect(headerTexts).not.toContain('Episodes');
        expect(headerTexts).not.toContain('Movies');
        //Add console log to check if Empty State is displayed
        console.log('Empty State is displayed');
    }, 180000);

});


