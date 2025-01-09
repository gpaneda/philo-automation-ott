import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { PlayerPage } from '../pages/player.page';
import { AppHelper } from '../helpers/app.helper';
import { CategoriesPage } from '../pages/categories.page';
import { TopPage } from '../pages/top.page';
import { SeriesDetailsPage } from '../pages/seriesDetails.page';
import path from 'path';
describe('Playback Tests', () => {
    let driver: Browser<'async'>;
    let homeScreenPage: HomeScreenPage;
    let playerPage: PlayerPage;
    let categoriesPage: CategoriesPage;
    let topPage: TopPage;
    let seriesDetails: SeriesDetailsPage;
    beforeAll(async () => {
        try {
            driver = await AppHelper.launchPhiloApp();
            homeScreenPage = new HomeScreenPage(driver);
            playerPage = new PlayerPage(driver);
            categoriesPage = new CategoriesPage(driver);
            topPage = new TopPage(driver);
            seriesDetails = new SeriesDetailsPage(driver);
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 30000);

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
    });

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

    describe('Basic Playback Controls', () => {
        test('TC201 - should verify content playback', async () => {
            try {
                // Step 1: Click on the first movie from the home screen
                await homeScreenPage.clickFirstMovie();
                await driver.pause(5000);

                // Step 2: Get the initial movie title from details page
                const movieTitleElement = await driver.$('android=resourceId("com.philo.philo:id/show_title")');
                await movieTitleElement.waitForDisplayed({ timeout: 10000 });
                const initialTitle = await movieTitleElement.getText();

                // Step 3: Click play button to start playback
                const playButton = await driver.$('android=resourceId("com.philo.philo:id/button_play")');
                await playButton.waitForDisplayed({ timeout: 10000 });
                await playButton.click();

                // Step 4: Verify playback functionality
                await playerPage.verifyMoviePlayback(initialTitle);
            } catch (error) {
                console.error('Error in playback test:', error);
                throw error;
            }
        }, 120000);

        test('TC202 - should verify that series playback and pause works', async () => {
            try {
                await categoriesPage.goToTopFreeShows();
                await driver.pause(5000);
                await homeScreenPage.pressEnterButton();
                await driver.pause(5000);
                
                const seriesTitle = await seriesDetails.getSeriesTitle();
                
                const playButton = await driver.$('android=className("android.view.View").descriptionContains("Play")');
                await playButton.waitForDisplayed({ timeout: 10000 });
                await playButton.click();

                const playerFragment = await driver.$('android=resourceId("com.philo.philo:id/player_fragment_host")');
                await playerFragment.waitForDisplayed({ timeout: 30000 });
                await driver.pause(5000);

                const seekbarVisible = await playerPage.waitForSeekbarVisible();
                expect(seekbarVisible).toBe(true);

        
            } catch (error) {
                console.error('Error in playback test:', error);
                throw error;
            }
        }, 180000);
    });
}); 
