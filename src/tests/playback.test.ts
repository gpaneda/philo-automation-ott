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
    let driver: Browser;
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
        try {
            driver = await AppHelper.initializeDriver();
            if (!driver.sessionId) {
                throw new Error('No session ID found');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to initialize driver: ${error.message}`);
            }
            throw new Error('Failed to initialize driver: Unknown error');
        }
    };

    const initializePageObjects = () => {
        try {
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to initialize page objects: ${error.message}`);
            }
            throw new Error('Failed to initialize page objects: Unknown error');
        }
    };

    const waitForAppToLoad = async () => {
        await new Promise(resolve => setTimeout(resolve, 10000));
    };

    const clearAppData = async () => {
        try {
            console.log('Clearing app data before test...');
            await AppHelper.clearAppData();
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to clear app data: ${error.message}`);
            }
            throw new Error('Failed to clear app data: Unknown error');
        }
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
        } catch (error: unknown) {
            console.error('Failed to get playback position:', error);
            if (error instanceof Error) {
                throw new Error(`Could not retrieve playback position: ${error.message}`);
            }
            throw new Error('Could not retrieve playback position: Unknown error');
        }
    }

    /**
     * Validates that the WebDriver session is active
     * @param {string} context Description of where the validation is occurring
     * @throws {Error} If no active session is found
     */
    async function validateSession(context: string) {
        try {
            if (!await driver.sessionId) {
                throw new Error(`No active session found in ${context}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Session validation failed in ${context}: ${error.message}`);
            }
            throw new Error(`Session validation failed in ${context}: Unknown error`);
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
        } catch (error: unknown) {
            console.error('Error in beforeAll:', error);
            if (error instanceof Error) {
                throw new Error(`Failed in beforeAll: ${error.message}`);
            }
            throw new Error('Failed in beforeAll: Unknown error');
        }
    }, TIMEOUT);

    beforeEach(async () => {
        try {
            await validateSession('beforeEach');
            await clearAppData();
            await waitForAppToLoad();
        } catch (error: unknown) {
            console.error('Error in beforeEach:', error);
            if (error instanceof Error) {
                throw new Error(`Failed in beforeEach: ${error.message}`);
            }
            throw new Error('Failed in beforeEach: Unknown error');
        }
    });

    afterEach(async () => {
        try {
            await validateSession('afterEach');
            await driver.terminateApp(AppHelper.appPackage);
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error: unknown) {
            console.error('Error in afterEach:', error);
        }
    });

    afterAll(async () => {
        try {
            if (driver) {
                await driver.deleteSession();
            }
        } catch (error: unknown) {
            console.error('Error in afterAll:', error);
        }
    });

    describe('Basic Playback Controls', () => {
        const checkPlayback = async (isSeries: boolean) => {
            await categoriesPage.navigateToTopFreeShows();
            if (isSeries) {
                await categoriesPage.clickOnSeries();
                await seriesDetails.checkAndNavigateForPlayback();
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

        test.only('TC200 - Check if movie playback works', async () => {
            await checkPlaybackForTopFreeMovies(false);
        }, TIMEOUT);

        test('TC201 - Check if series playback works', async () => {
            await checkPlayback(true);
        }, TIMEOUT);

        test('TC202 - Check if movie playback and pause works', async () => {
            await checkPlaybackForTopFreeMovies(false);
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

        test('TC204 - should verify rewind playback works', async () => {
            await checkPlaybackForTopFreeMovies(false);
            await playerPage.fastForward(); // Seek forward first
            const initialPosition = await playerPage.getCurrentPosition();
            await playerPage.rewind(); // Seek backward
            const finalPosition = await playerPage.getCurrentPosition();
            expect(finalPosition).toBeLessThan(initialPosition);
        }, TIMEOUT);

        test('TC205 - should verify ads trigger with multiple right keypresses', async () => {
            await checkPlaybackForTopFreeMovies(false);
            let adFound = await playerPage.isAdPlaying();
            if (!adFound) {
                for (let i = 0; i < 10; i++) {
                    await playerPage.fastForward();
                    adFound = await playerPage.isAdPlaying();
                    if (adFound) break;
                    await playerPage.wait(1);
                    if (!adFound) {
                        await playerPage.resumePlayback();
                    }
                }
            }
            expect(adFound).toBe(true);
        }, TIMEOUT);
    });
}); 
