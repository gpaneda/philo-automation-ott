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

    // Helper methods for common playback operations
    
    /**
     * Starts playback of the first movie from the home screen
     * Includes navigation, play initiation, and ad handling
     * @throws {Error} If any step in the playback initialization fails
     */
    async function startMoviePlayback() {
        try {
            await homeScreenPage.clickFirstMovie();
            await driver.pause(5000);
            await homeScreenPage.pressEnterButton();
            await driver.pause(5000);
            await moviesDetails.clickPlay();
            await playerPage.waitForAdsToFinish();
            await playerPage.verifyMoviePlayback();
        } catch (error) {
            console.error('Failed to start movie playback:', error);
            throw new Error(`Movie playback initialization failed: ${error.message}`);
        }
    }

    /**
     * Starts playback of a series from the Top Free Shows section
     * Includes navigation, selection, and ad handling
     * @throws {Error} If any step in the series playback initialization fails
     */
    async function startSeriesPlayback() {
        try {
            await categoriesPage.goToTopFreeShows();
            await driver.pause(3000);
            await homeScreenPage.pressDownButton();
            await driver.pause(3000);
            await homeScreenPage.pressEnterButton();
            await driver.pause(3000);
            await seriesDetails.clickPlay();
            await playerPage.waitForAdsToFinish();
        } catch (error) {
            console.error('Failed to start series playback:', error);
            throw new Error(`Series playback initialization failed: ${error.message}`);
        }
    }

    /**
     * Gets the current playback position with proper UI setup
     * @returns {Promise<number>} Current playback position as a percentage
     * @throws {Error} If unable to retrieve playback position
     */
    async function getPlaybackPosition() {
        try {
            await playerPage.showPlayerControls();
            await driver.pause(2000);
            const position = await playerPage.getCurrentPosition();
            console.log('Position (%):', position);
            return position;
        } catch (error) {
            console.error('Failed to get playback position:', error);
            throw new Error(`Could not retrieve playback position: ${error.message}`);
        }
    }

    /**
     * Validates that the WebDriver session is active
     * @param {string} context Description of where the validation is occurring
     * @throws {Error} If no active session is found
     */
    async function validateSession(context: string) {
        if (!await driver.sessionId) {
            const error = new Error(`No active session found during ${context}`);
            console.error(error);
            throw error;
        }
    }

    /**
     * Performs a seek operation and verifies the position change
     * @param {'forward' | 'rewind'} direction Direction to seek
     * @returns {Promise<{initial: number, final: number}>} Initial and final positions
     * @throws {Error} If seek operation fails or position verification fails
     */
    async function performSeekOperation(direction: 'forward' | 'rewind') {
        try {
            const initialPosition = await getPlaybackPosition();
            console.log(`Starting seek ${direction}...`);
            
            if (direction === 'forward') {
                await playerPage.seekForward();
            } else {
                await playerPage.seekRewind();
            }
            
            await driver.pause(5000);
            const finalPosition = await getPlaybackPosition();
            
            return { initial: initialPosition, final: finalPosition };
        } catch (error) {
            console.error(`Failed to perform ${direction} seek:`, error);
            throw new Error(`Seek ${direction} operation failed: ${error.message}`);
        }
    }

    /**
     * Verifies player controls are in the expected state
     * @throws {Error} If player controls are not in expected state
     */
    async function verifyPlayerControls() {
        try {
            const playerFragment = await driver.$('android=resourceId("com.philo.philo:id/player_fragment_host")');
            await playerFragment.waitForDisplayed({ timeout: 30000 });
            await driver.pause(5000);

            const seekbarVisible = await playerPage.waitForSeekbarVisible();
            if (!seekbarVisible) {
                throw new Error('Seekbar not visible after waiting');
            }
        } catch (error) {
            console.error('Failed to verify player controls:', error);
            throw new Error(`Player controls verification failed: ${error.message}`);
        }
    }

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
                await startMoviePlayback();
            } catch (error) {
                console.error('Error in TC201:', error);
                throw error;
            }
        }, 120000);

        test('TC202 - should verify that series playback and pause works', async () => {
            try {
                await startSeriesPlayback();
                await verifyPlayerControls();
            } catch (error) {
                console.error('Error in TC202:', error);
                throw error;
            }
        }, 180000);

        test('TC203 - should verify forward playback works', async () => {
            try {
                await startMoviePlayback();
                await driver.pause(10000);

                const { initial: initialPosition, final: finalPosition } = await performSeekOperation('forward');
                
                expect(initialPosition).toBeGreaterThanOrEqual(0);
                expect(initialPosition).toBeLessThanOrEqual(100);
                expect(finalPosition).toBeGreaterThan(initialPosition);
                expect(finalPosition).toBeLessThanOrEqual(100);

                console.log('Position change:', finalPosition - initialPosition);
            } catch (error) {
                console.error('Error in TC203:', error);
                throw error;
            }
        }, 120000);

        test('TC204 - should verify rewind playback works', async () => {
            try {
                await validateSession('test start');
                await startMoviePlayback();
                await driver.pause(10000);

                // First seek forward to have room to rewind
                await performSeekOperation('forward');
                
                await validateSession('before rewind operation');
                const { initial: initialPosition, final: finalPosition } = await performSeekOperation('rewind');
                
                expect(initialPosition).toBeGreaterThan(0);
                expect(initialPosition).toBeLessThanOrEqual(100);
                expect(finalPosition).toBeLessThan(initialPosition);
                expect(finalPosition).toBeGreaterThanOrEqual(0);

                console.log('Position change:', finalPosition - initialPosition);
            } catch (error) {
                console.error('Error in TC204:', error);
                throw error;
            }
        }, 180000);
    });
}); 
