import { Browser } from 'webdriverio';
import path from 'path';

// Importing local modules from index files
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage, PlayerPage, CategoriesPage, TopPage, SeriesDetailsPage, MoviesDetailsPage } from '../fireTVPages';
import { HomeScreenPage as AndroidHomeScreenPage, CategoriesPage as AndroidCategoriesPage, TopPage as AndroidTopPage, SeriesDetailsPage as AndroidSeriesDetailsPage, MoviesDetailsPage as AndroidMoviesDetailsPage, PlayerPage as AndroidPlayerPage } from '../androidTVPages';

describe('Playback Tests', () => {
    let driver: Browser<'async'>;
    let homeScreenPage: HomeScreenPage | AndroidHomeScreenPage;
    let categoriesPage: CategoriesPage | AndroidCategoriesPage;
    let topPage: TopPage | AndroidTopPage;
    let seriesDetails: SeriesDetailsPage | AndroidSeriesDetailsPage;
    let moviesDetails: MoviesDetailsPage | AndroidMoviesDetailsPage;
    let playerPage: PlayerPage | AndroidPlayerPage;

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
            await driver.pause(15000);  // Wait for player to load
            await playerPage.waitForAdsToFinish();
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
            await driver.pause(5000);
            await categoriesPage.goToTopFreeShows();
            await driver.pause(3000);
            await homeScreenPage.pressDownButton();
            await driver.pause(3000);
            await homeScreenPage.pressEnterButton();
            await driver.pause(3000);
            await seriesDetails.clickPlay();
            await driver.pause(15000);  // Wait for player to load
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

    beforeAll(async () => {
        try {
            const requiredEnvVars = [
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

            requiredEnvVars.forEach(envVar => {
                if (!process.env[envVar]) {
                    throw new Error(`Missing required environment variable: ${envVar}`);
                }
            });

            // Clear app data before starting test
            console.log('Clearing app data before test...');
            await AppHelper.clearAppData();
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Use the Apphelper to login to philo
            await AppHelper.loginToPhilo();
            
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Initialize driver and page objects with retry logic
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    driver = await AppHelper.initializeDriver();
                    // Verify driver connection
                    if (!driver.sessionId) {
                        throw new Error('No session ID found');
                    }
                    
                    // Initialize page objects
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
                    
                    // Wait for app to be fully loaded
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    break;
                } catch (error) {
                    retryCount++;
                    console.error(`Driver initialization attempt ${retryCount} failed:`, error);
                    if (retryCount === maxRetries) {
                        throw new Error(`Failed to initialize driver after ${maxRetries} attempts`);
                    }
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    }, 120000);

    beforeEach(async () => {
        try {
            console.log('Terminating app...');
            await driver.terminateApp(AppHelper.appPackage);
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            console.log('Activating app...');
            await driver.activateApp(AppHelper.appPackage);
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            // Verify driver connection is still active
            if (!driver.sessionId) {
                throw new Error('Lost driver session');
            }

            // Reinitialize page objects after app restart
            console.log('Reinitializing page objects...');
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
        } catch (error) {
            console.error('Error in beforeEach:', error);
            // Try to recover the session
            try {
                await driver.deleteSession();
                driver = await AppHelper.initializeDriver();
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                // Reinitialize page objects after session recovery
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
            } catch (recoveryError) {
                console.error('Failed to recover session:', recoveryError);
                throw error;
            }
        }
    }, 120000);

    // afterAll(async () => {
        // Clean up the driver session
        //await driver.deleteSession();
    //});

    describe('Basic Playback Controls', () => {
        test('TC201 - should verify content playback', async () => {
            try {
                await startMoviePlayback();
                await verifyPlayerControls();
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

                // Get initial position
                await playerPage.showPlayerControls();
                await driver.pause(2000);
                const initialPosition = await playerPage.getCurrentPosition();
                console.log('Initial position:', initialPosition);

                // Perform fast forward
                await playerPage.fastForward();
                await driver.pause(5000);

                // Get final position
                await playerPage.showPlayerControls();
                await driver.pause(2000);
                const finalPosition = await playerPage.getCurrentPosition();
                console.log('Final position:', finalPosition);

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

        test('TC205 - should verify ads trigger with multiple right keypresses', async () => {
            try {
                // Start movie playback using helper function
                await startMoviePlayback();

                // Check for ads during initial playback
                let adFound = await playerPage.isAdPlaying();
                if (!adFound) {
                    console.log('No ads during initial playback, will try right keypresses');
                    
                    // Try up to 10 times to trigger an ad with right keypresses
                    for (let i = 1; i <= 10; i++) {
                        console.log(`Attempt ${i} to trigger ad with right keypresses`);
                        
                        // Press right button 10 times
                        for (let j = 0; j < 10; j++) {
                            await playerPage.pressRightButton();
                            await playerPage.wait(1);
                        }

                        // Resume playback after seeking with explicit waits
                        console.log('Attempting to resume playback...');
                        await playerPage.wait(2); // Wait for seeking to settle
                        await playerPage.resumePlayback();
                        console.log('Resume playback command sent');
                        await playerPage.wait(5); // Wait for playback to stabilize

                        // Check if ad is playing
                        console.log('Checking for ad...');
                        adFound = await playerPage.isAdPlaying();
                        console.log(`Ad detection result: ${adFound}`);
                        if (adFound) {
                            console.log('Ad found! Breaking seek loop.');
                            break;
                        }
                    }
                }

                // Verify that an ad was found
                console.log('Final ad detection result:', adFound);
                expect(adFound).toBe(true);
            } catch (error) {
                console.error('Error in TC205:', error);
                throw error;
            }
        }, 300000);

        test('TC206 - Check if movie playback works', async () => {
            try {
                //Step 1: Navigate to Top Free Movies
                await categoriesPage.navigateToTopFreeMovies();
                //Step 2: Click on a movie tile
                await categoriesPage.clickMovieTile();
                //Step 3: Check and navigate for playback
                await moviesDetails.checkAndNavigateForPlayback();
                //Ste 4: wait for ads to finish
                await playerPage.waitForAdsToFinish();
                //Step 5: if ads does not exist, check if playback is ongoing
                const isPlaying = await playerPage.isPlaybackOngoing();
                if (!isPlaying) {
                    console.log('No ads, checking playback status...');
                    await playerPage.waitForPlayback();
                }
               
            } catch (error) {
                console.error('Error in TC206:', error);
                throw error;
            }
        }, 300000);

        test('TC207 - Check if series playback works', async () => {
            try {
                //Step 1: Navigate to Top Free Shows
                await categoriesPage.navigateToTopFreeShows();
                //Press right key to the next title
                await driver.pressKeyCode(22);
                //Step 2: Click on a series tile
                await categoriesPage.clickOnSeries();
                //Step 3: Check and navigate for playback
                await seriesDetails.checkAndNavigateForPlayback();
                //Ste 4: wait for ads to finish
                await playerPage.waitForAdsToFinish();
                //Step 5: if ads does not exist, check if playback is ongoing
                const isPlaying = await playerPage.isPlaybackOngoing();
                if (!isPlaying) {
                    console.log('No ads, checking playback status...');
                    await playerPage.waitForPlayback();
                }

            } catch (error) {
                console.error('Error in TC206:', error);
                throw error;
            }
        }, 300000);

    });
}); 
