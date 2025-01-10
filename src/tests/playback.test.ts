import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { PlayerPage } from '../pages/player.page';
import { AppHelper } from '../helpers/app.helper';
import { CategoriesPage } from '../pages/categories.page';
import { TopPage } from '../pages/top.page';
import { SeriesDetailsPage } from '../pages/seriesDetails.page';
import { MoviesDetailsPage } from '../pages/moviesDetails.page';
import path from 'path';

describe('Playback Tests', () => {
    let driver: Browser<'async'>;
    let homeScreenPage: HomeScreenPage;
    let playerPage: PlayerPage;
    let categoriesPage: CategoriesPage;
    let topPage: TopPage;
    let seriesDetails: SeriesDetailsPage;
    let moviesDetails: MoviesDetailsPage;

    beforeAll(async () => {
        try {
            driver = await AppHelper.launchPhiloApp();
            homeScreenPage = new HomeScreenPage(driver);
            playerPage = new PlayerPage(driver);
            categoriesPage = new CategoriesPage(driver);
            topPage = new TopPage(driver);
            seriesDetails = new SeriesDetailsPage(driver);
            moviesDetails = new MoviesDetailsPage(driver);
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 120000);

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
    }, 60000);

    describe('Basic Playback Controls', () => {
        test('TC201 - should verify content playback', async () => {
            try {
                // Step 1: Click on the first movie from the home screen
                await homeScreenPage.clickFirstMovie();
                await driver.pause(5000);

                // Step 2:Enter the details page    
                await homeScreenPage.pressEnterButton();
                await driver.pause(5000);

                // Step 3: Click play button to start playback
                await moviesDetails.clickPlay();

                // Step 4: Verify playback functionality
                await playerPage.verifyMoviePlayback();
            } catch (error) {
                console.error('Error in playback test:', error);
                throw error;
            }
        }, 120000);

        test('TC202 - should verify that series playback and pause works', async () => {
            try {
                await categoriesPage.goToTopFreeShows();
                await driver.pause(3000);
                //press down to select the first show
                await homeScreenPage.pressDownButton();
                await driver.pause(3000);
                //press enter to select the first show
                await homeScreenPage.pressEnterButton();
                await driver.pause(3000);
                
                await seriesDetails.clickPlay();

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

        test.only('TC203 - should verify forward playback works', async () => {
            try {
                // Step 1: Click on the first movie from the home screen
                await homeScreenPage.clickFirstMovie();
                await driver.pause(5000);

                // Step 2: Enter the details page    
                await homeScreenPage.pressEnterButton();
                await driver.pause(5000);

                // Step 3: Press Play
                await moviesDetails.clickPlay();
                await driver.pause(5000);

                // Step 4: Verify playback functionality
                await playerPage.verifyMoviePlayback();
                await driver.pause(10000); // Wait longer for playback to start

                // Step 5: Make sure controls are visible and get initial position
                await playerPage.showPlayerControls();
                await driver.pause(2000);

                const initialPosition = await playerPage.getCurrentPosition();
                console.log('Initial position (%):', initialPosition);
                expect(initialPosition).toBeGreaterThanOrEqual(0);
                expect(initialPosition).toBeLessThanOrEqual(100);

                // Step 6: Seek forward
                console.log('Starting seek forward...');
                await playerPage.seekForward();
                await driver.pause(5000);

                // Step 7: Get final position
                await playerPage.showPlayerControls();
                await driver.pause(2000);

                const finalPosition = await playerPage.getCurrentPosition();
                console.log('Final position (%):', finalPosition);
                expect(finalPosition).toBeGreaterThan(initialPosition);
                expect(finalPosition).toBeLessThanOrEqual(100);

                console.log('Position change:', finalPosition - initialPosition);
            } catch (error) {
                console.error('Error in playback test:', error);
                throw error;
            }
        }, 120000);
    });
}); 
