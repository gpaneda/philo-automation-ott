import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { PlayerPage } from '../pages/player.page';
import { AppHelper } from '../helpers/app.helper';
import { CategoriesPage } from '../pages/categories.page';
import { TopPage } from '../pages/top.page';
import { SeriesDetailsPage } from '../pages/seriesDetails.page';
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
                await homeScreenPage.clickFirstMovie();
                await driver.pause(5000);

                const movieTitleElement = await driver.$('android=resourceId("com.philo.philo:id/show_title")');
                await movieTitleElement.waitForDisplayed({ timeout: 10000 });
                const initialTitle = await movieTitleElement.getText();

                const playButton = await driver.$('android=resourceId("com.philo.philo:id/button_play")');
                await playButton.waitForDisplayed({ timeout: 10000 });
                await playButton.click();

                await playerPage.waitForLoaded();
                await driver.pause(5000);

                const isPlaying = await playerPage.isPlaying();
                expect(isPlaying).toBe(true);

                await playerPage.togglePlayPause();
                await driver.pause(2000);

                const seekbar = await driver.$('android=resourceId("com.philo.philo:id/seekbar_seekbar3")');
                await seekbar.waitForDisplayed({ timeout: 10000 });

                await driver.pause(5000);

                const movieTitleFromPlayer = await playerPage.getShowTitle();
                expect(movieTitleFromPlayer).toBe(initialTitle);
            } catch (error) {
                console.error('Error in playback test:', error);
                throw error;
            }
        }, 120000);

        test.only('TC202 - should verify that series playback and pause works', async () => {
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

                const isPlaying = await playerPage.isPlaying();
                expect(isPlaying).toBe(true);

                await driver.pressKeyCode(66);
                await driver.pause(2000);
                await driver.pressKeyCode(66);
                await driver.pause(2000);

                const seekbar = await driver.$('android=resourceId("com.philo.philo:id/seekbar_seekbar3")');
                await seekbar.waitForDisplayed({ timeout: 10000 });
                await driver.pause(2000);

                const seriesTitleFromPlayer = await playerPage.getShowTitle();
                console.error('Title seen in player:', seriesTitleFromPlayer);
            } catch (error) {
                console.error('Error in playback test:', error);
                throw error;
            }
        }, 180000);
    });
}); 
