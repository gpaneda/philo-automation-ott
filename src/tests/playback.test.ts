import { Browser } from 'webdriverio';
import path from 'path';

// Importing local modules from index files
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage, PlayerPage, CategoriesPage, TopPage, SeriesDetailsPage, MoviesDetailsPage } from '../fireTVPages';
import { HomeScreenPage as AndroidHomeScreenPage, CategoriesPage as AndroidCategoriesPage, TopPage as AndroidTopPage, SeriesDetailsPage as AndroidSeriesDetailsPage, MoviesDetailsPage as AndroidMoviesDetailsPage, PlayerPage as AndroidPlayerPage } from '../androidTVPages';

const TIMEOUT = 500000; // 8 minutes
const REQUIRED_ENV_VARS = [
    'GMAIL_CLIENT_ID',
    'GMAIL_CLIENT_SECRET',
    'GMAIL_REDIRECT_URI',
    'GMAIL_REFRESH_TOKEN',
    'PHILO_EMAIL',
    'PHILO_EMAIL_2',
    'PHILO_EMAIL_3',
    'ANDROID_TV_IP',
    'ANDROID_TV_PORT'
];

jest.setTimeout(TIMEOUT);

describe('Playback Tests', () => {
    let driver: Browser<'async'>;
    let homeScreenPage: HomeScreenPage | AndroidHomeScreenPage;
    let categoriesPage: CategoriesPage | AndroidCategoriesPage;
    let topPage: TopPage | AndroidTopPage;
    let seriesDetails: SeriesDetailsPage | AndroidSeriesDetailsPage;
    let moviesDetails: MoviesDetailsPage | AndroidMoviesDetailsPage;
    let playerPage: PlayerPage | AndroidPlayerPage;

    // Helper methods for common playback operations
    const validateEnvVars = () => {
        REQUIRED_ENV_VARS.forEach(envVar => {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        });
    };

    const initializeDriver = async () => {
        driver = await AppHelper.initializeDriver();
        if (!driver.sessionId) {
            throw new Error('No session ID found');
        }
    };

    const initializePageObjects = () => {
        if (AppHelper.deviceType === 'androidTV') {
            homeScreenPage = new AndroidHomeScreenPage(driver);
            categoriesPage = new AndroidCategoriesPage(driver);
            topPage = new AndroidTopPage(driver);
            seriesDetails = new AndroidSeriesDetailsPage(driver);
            playerPage = new AndroidPlayerPage(driver);
            moviesDetails = new AndroidMoviesDetailsPage(driver, playerPage);
        } else {
            homeScreenPage = new HomeScreenPage(driver);
            playerPage = new PlayerPage(driver);
            categoriesPage = new CategoriesPage(driver);
            topPage = new TopPage(driver);
            seriesDetails = new SeriesDetailsPage(driver);
            moviesDetails = new MoviesDetailsPage(driver, playerPage);
        }
    };

    const waitForAppToLoad = async () => {
        await new Promise(resolve => setTimeout(resolve, 10000));
    };

    const clearAppData = async () => {
        console.log('Clearing app data before test...');
        await AppHelper.clearAppData();
        await new Promise(resolve => setTimeout(resolve, 5000));
    };

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
     * Verifies player controls are in the expected state
     * @throws {Error} If player controls are not in expected state
     */
    async function verifyPlayerControls() {
        try {
            console.log('Starting player controls verification...');
            
            // Determine the platform type
            const isAndroidTV = AppHelper.deviceType === 'androidTV';
            console.log(`Device type: ${isAndroidTV ? 'Android TV' : 'Fire TV'}`);

            // Use platform-specific identifiers for player_fragment_host
            const playerFragmentSelector = isAndroidTV 
                ? 'android=resourceId("com.philo.philo.google:id/player_fragment_host")' 
                : 'android=resourceId("com.philo.philo:id/player_fragment_host")';

            console.log('Waiting for player fragment...');
            const playerFragment = await driver.$(playerFragmentSelector);
            await playerFragment.waitForDisplayed({ timeout: 30000 });
            console.log('Player fragment found');
            
            // Give the player UI time to stabilize
            await driver.pause(5000);

            // Show player controls explicitly
            console.log('Showing player controls...');
            await playerPage.showPlayerControls();
            await driver.pause(2000);

            // Try multiple times to get the seekbar visible
            console.log('Checking seekbar visibility...');
            const seekbarVisible = await playerPage.waitForSeekbarVisible(10); // Increased max attempts
            
            if (!seekbarVisible) {
                console.log('Seekbar not visible, trying one more time...');
                // Try one more time with a fresh controls display
                await playerPage.showPlayerControls();
                await driver.pause(2000);
                const secondAttempt = await playerPage.waitForSeekbarVisible(5);
                
                if (!secondAttempt) {
                    throw new Error('Seekbar not visible after multiple attempts');
                }
            }

            console.log('Player controls verification completed successfully');
        } catch (error) {
            console.error('Failed to verify player controls:', error);
            throw new Error(`Player controls verification failed: ${error.message}`);
        }
    }

    const checkPlaybackForTopFreeMovies = async (isSeries: boolean) => {
        await categoriesPage.navigateToTopFreeMovies(); // Navigate to Top Free Movies
        if (isSeries) {
            await categoriesPage.clickOnSeries();
        } else {
            await categoriesPage.clickMovieTile();
        }
        await moviesDetails.checkAndNavigateForPlayback();
        await playerPage.waitForAdsToFinish();
        const isPlaying = await playerPage.isPlaybackOngoing();
        if (!isPlaying) {
            console.log('No ads, checking playback status...');
            await playerPage.waitForPlayback();
        }
    };

    beforeAll(async () => {
        try {
            validateEnvVars();
            await clearAppData();
            await AppHelper.loginToPhilo();
            await waitForAppToLoad();

            await initializeDriver();
            initializePageObjects();
            await waitForAppToLoad();
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, TIMEOUT);

    beforeEach(async () => {
        try {
            console.log('Terminating app...');
            await driver.terminateApp(AppHelper.appPackage);
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            console.log('Activating app...');
            await driver.activateApp(AppHelper.appPackage);
            await waitForAppToLoad();
            
            // Verify driver connection is still active
            if (!driver.sessionId) {
                throw new Error('Lost driver session');
            }

            // Reinitialize page objects after app restart
            console.log('Reinitializing page objects...');
            initializePageObjects();
        } catch (error) {
            console.error('Error in beforeEach:', error);
            // Try to recover the session
            try {
                await driver.deleteSession();
                driver = await AppHelper.initializeDriver();
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                // Reinitialize page objects after session recovery
                initializePageObjects();
            } catch (recoveryError) {
                console.error('Failed to recover session:', recoveryError);
                throw error;
            }
        }
    }, TIMEOUT);

    afterAll(async () => {
        // Clean up the driver session
        await driver.deleteSession();
        await AppHelper.clearAppData();
    });

    describe('Basic Playback Controls', () => {
        const checkPlayback = async (isSeries: boolean) => {
            await categoriesPage.navigateToTopFreeShows();
            if (isSeries) {
                await categoriesPage.clickOnSeries();
            } else {
                await categoriesPage.clickMovieTile();
            }
            await moviesDetails.checkAndNavigateForPlayback();
            await playerPage.waitForAdsToFinish();
            const isPlaying = await playerPage.isPlaybackOngoing();
            if (!isPlaying) {
                console.log('No ads, checking playback status...');
                await playerPage.waitForPlayback();
            }
        };

        test('TC200 - Check if movie playback works', async () => {
            await checkPlaybackForTopFreeMovies(false);
        }, TIMEOUT);

        test('TC201 - Check if series playback works', async () => {
            await checkPlayback(true);
        }, TIMEOUT);

        test('TC202 - Check if series playback and pause works', async () => {
            await checkPlayback(true);
            await playerPage.pressEnter(); // Pause playback
            const isPaused = await playerPage.waitForSeekbarVisible();
            expect(isPaused).toBe(true);
        }, TIMEOUT);

        test('TC203 - should verify forward playback works', async () => {
            await checkPlaybackForTopFreeMovies(false);
            await playerPage.togglePlayPause();
            const initialPosition = await playerPage.getCurrentPosition();
            await playerPage.fastForward();
            const finalPosition = await playerPage.getCurrentPosition();
            expect(finalPosition).toBeGreaterThan(initialPosition);
        }, TIMEOUT);

        test.only('TC204 - should verify rewind playback works', async () => {
            await checkPlaybackForTopFreeMovies(false);
            await playerPage.fastForward(); // Seek forward first
            const initialPosition = await playerPage.getCurrentPosition();
            await playerPage.rewind(); // Seek backward
            const finalPosition = await playerPage.getCurrentPosition();
            expect(finalPosition).toBeLessThan(initialPosition);
        }, TIMEOUT);

        test('TC205 - should verify ads trigger with multiple right keypresses', async () => {
            await checkPlayback(false);
            let adFound = await playerPage.isAdPlaying();
            if (!adFound) {
                for (let i = 0; i < 10; i++) {
                    await playerPage.pressRightButton();
                    await playerPage.wait(1);
                    await playerPage.resumePlayback();
                    adFound = await playerPage.isAdPlaying();
                    if (adFound) break;
                }
            }
            expect(adFound).toBe(true);
        }, TIMEOUT);
    });
}); 
