import { Browser, ChainablePromiseElement } from 'webdriverio';
import { BasePage } from './base.page';

const KEYCODE_ENTER = 66;
const KEYCODE_DPAD_RIGHT = 22;
const KEYCODE_DPAD_LEFT = 21;
const KEYCODE_BACK = 4; // Android back button keycode

export class PlayerPage extends BasePage {
    public selectors = {
        // Player Fragment
        playerFragment: 'android=resourceId("com.philo.philo.google:id/player_fragment_host")',
        modalFragment: 'android=resourceId("com.philo.philo.google:id/modal_fragment_host")',
        dialogFragment: 'android=resourceId("com.philo.philo.google:id/dialog_fragment_host")',
        adOverlay: 'android=text("Advertisements")',

        // Player Controls
        playPauseButton: 'android=resourceId("com.philo.philo.google:id/playerControls_playPauseButton")',
        playButton: 'android=resourceId("com.philo.philo.google:id/playerControls_playButton")',
        pauseButton: 'android=resourceId("com.philo.philo.google:id/playerControls_pauseButton")',
        rewindButton: 'android=resourceId("com.philo.philo.google:id/playerControls_rewindButton")',
        resumeButton: 'android=resourceId("com.philo.philo.google:id/playerControls_resumeButton")',
        fastForwardButton: 'android=resourceId("com.philo.philo.google:id/playerControls_fastForwardButton")',
        progressBar: 'android=resourceId("com.philo.philo.google:id/playerControls_progressBar")',
        currentTime: 'android=resourceId("com.philo.philo.google:id/playerControls_currentTime")',
        duration: 'android=resourceId("com.philo.philo.google:id/playerControls_duration")',

        // Subtitles
        subtitlesContainer: 'android=resourceId("com.philo.philo.google:id/subtitles_container")',

        // Video Elements
        videoFrame: 'android=resourceId("com.philo.philo.google:id/video_frame")',
        videoSurface: 'android=resourceId("com.philo.philo.google:id/video_surface")',
        playbackRoot: 'android=resourceId("com.philo.philo.google:id/playback_root")',

        // Player UI Elements
        playerActivityRoot: 'android=resourceId("com.philo.philo.google:id/player_activity_root")',
        playerControlsRoot: 'android=resourceId("com.philo.philo.google:id/playerControls_root")',
        composeViewWrapper: 'android=resourceId("com.philo.philo.google:id/compose_view_wrapper")',

        // Seekbar Elements
        seekbarRoot: 'android=resourceId("com.philo.philo:id/seekbar_root")',
        seekbar3: 'android=new UiSelector().resourceId("com.philo.philo.google:id/seekbar_seekbar3").className("com.philo.philo.playerCranston.ui.SeekBar3")',
        seekbarContainer: 'android=resourceId("com.philo.philo.google:id/seekbar")',

        // Content Info Elements
        showTitle: 'android=resourceId("com.philo.philo.google:id/show_title").className("android.widget.TextView")',
        episodeInfo: 'android=resourceId("com.philo.philo.google:id/subtitle")',

        // Action Buttons
        saveShowButton: 'android=content-desc("Save show")',
        moreInfoButton: 'android=content-desc("More info")',
        optionsButton: 'android=content-desc("Options")',
        startOverButton: 'android=content-desc("Start over")',
        jumpToLiveButton: 'android=content-desc("Jump to live")',

        // Ad Elements
        adOverlayRoot: 'android=resourceId("com.philo.philo.google:id/ad_overlay_root")',
        adText: 'android=resourceId("com.philo.philo.google:id/advertisements")',
        adRemainingTime: 'android=resourceId("com.philo.philo.google:id/remaining_time")',
        adFfwdDisabled: 'android=resourceId("com.philo.philo.google:id/icon_ffwd_disable")',
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    async waitForLoaded(): Promise<void> {
        await this.verifyElementDisplayed(this.selectors.playerFragment);
    }

    async isDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.playerFragment);
    }

    async togglePlayPause(): Promise<void> {
        await this.driver.pressKeyCode(66);
        await this.driver.pause(2000);
    }

    async fastForward(): Promise<void> {
        try {
            // Just show controls and use keyboard navigation
            await this.showPlayerControls();
            await this.driver.pause(2000);

            // Press right key multiple times
            console.log('Starting fast forward...');
            for (let i = 0; i < 10; i++) {
                await this.driver.pressKeyCode(22); // Right key
                await this.driver.pause(200);
            }

            // Press Enter to confirm
            await this.driver.pressKeyCode(66);
            await this.driver.pause(2000);
        } catch (error) {
            console.error('Error during fast forward:', error);
            throw error;
        }
    }

    async rewind(): Promise<void> {
        try {
            // Just show controls and use keyboard navigation
            await this.showPlayerControls();
            await this.driver.pause(2000);

            // Press left key multiple times
            console.log('Starting rewind...');
            for (let i = 0; i < 10; i++) {
                await this.driver.pressKeyCode(21); // Left key
                await this.driver.pause(200);
            }

            // Press Enter to confirm
            await this.driver.pressKeyCode(66);
            await this.driver.pause(2000);
        } catch (error) {
            console.error('Error during rewind:', error);
            throw error;
        }
    }

    async getCurrentTime(): Promise<string> {
        const element = await this.waitForElement(this.selectors.currentTime) as unknown as ChainablePromiseElement<any>;
        return element.getText();
    }

    async getDuration(): Promise<string> {
        const element = await this.waitForElement(this.selectors.duration) as unknown as ChainablePromiseElement<any>;
        return element.getText();
    }

    async areSubtitlesDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.subtitlesContainer);
    }

    async waitForAdsToFinish(): Promise<void> {
        try {
            // Check for any ad overlay elements
            const hasAdOverlay = await this.isElementDisplayed(this.selectors.adOverlayRoot) ||
                await this.isElementDisplayed(this.selectors.adText);

            if (hasAdOverlay) {
                console.log('Ad overlay found, waiting for ad to finish...');

                // Wait until both the ad overlay and text are gone
                await this.driver.waitUntil(async () => {
                    const adOverlayGone = !(await this.isElementDisplayed(this.selectors.adOverlayRoot));
                    const adTextGone = !(await this.isElementDisplayed(this.selectors.adText));
                    return adOverlayGone && adTextGone;
                }, {
                    timeout: 240000,
                    timeoutMsg: 'Advertisement did not finish after 4 minutes',
                    interval: 2000
                });

                console.log('Ad finished playing');
                // Give a moment for player to stabilize after ad
                await this.driver.pause(2000);
            } else {
                console.log('No ad overlay found');
            }
        } catch (error) {
            console.log('Error checking for ads:', error);
            // Don't throw the error as ads might not be present
        }
    }

    async verifyPlayerControls(): Promise<void> {
        await this.verifyElementDisplayed(this.selectors.rewindButton);
        await this.verifyElementDisplayed(this.selectors.fastForwardButton);
        await this.verifyElementDisplayed(this.selectors.progressBar);
    }

    async showPlayerControls(): Promise<void> {
        await this.driver.pressKeyCode(66); // Enter key code
        await this.driver.pause(2000); // Short pause for controls to appear
    }

    async startPlayback(): Promise<boolean> {
        try {
            const playButton = await this.waitForElement(this.selectors.playButton) as unknown as ChainablePromiseElement<any>;
            await playButton.click();
            await this.driver.pause(5000);
            return true;
        } catch (e) {
            return false;
        }
    }

    async waitForPlayback(timeout = 10000): Promise<void> {
        await this.waitForElement(this.selectors.pauseButton, timeout);
    }

    async isPlayButtonVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.playButton);
    }

    async isPauseButtonVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.pauseButton);
    }

    async isProgressBarVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.progressBar);
    }

    async isRewindButtonVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.rewindButton);
    }

    async isFastForwardButtonVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.fastForwardButton);
    }

    async isSubtitlesContainerVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.subtitlesContainer);
    }

    async isCurrentTimeVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.currentTime);
    }

    async isDurationVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.duration);
    }

    async seekForward(): Promise<void> {
        try {
            // Just show controls and use keyboard navigation
            await this.showPlayerControls();
            await this.driver.pause(2000);

            // Press right key multiple times
            console.log('Starting seek forward...');
            for (let i = 0; i < 10; i++) {
                await this.driver.pressKeyCode(22); // Right key
                await this.driver.pause(200);
            }

            // Press Enter to confirm
            await this.driver.pressKeyCode(66);
            await this.driver.pause(2000);
        } catch (error) {
            console.error('Error during seek forward:', error);
            throw error;
        }
    }

    async seekBackward(): Promise<void> {
        await this.click(this.selectors.rewindButton);
    }

    async getCurrentPosition(): Promise<number> {
        try {
            // Show controls to make sure seekbar is visible
            await this.showPlayerControls();
            await this.driver.pause(2000);

            let attempts = 0;
            const maxAttempts = 5;
            while (attempts < maxAttempts) {
                try {
                    const element = await this.waitForElement(this.selectors.seekbar3, 10000);
                    if (!element) {
                        throw new Error('Seekbar element not found');
                    }

                    // Get the content description which contains the time info
                    const contentDesc = await element.getAttribute('content-desc');
                    console.log('Seekbar content description:', contentDesc);

                    // Parse time from format "X minutes Y seconds of A hours B minutes [C seconds]"
                    const match = contentDesc.match(/(\d+) minutes? (\d+) seconds? of (?:(\d+) hours? )?(\d+) minutes?(?: (\d+) seconds?)?/);
                    if (!match) {
                        throw new Error('Could not parse time from content description');
                    }

                    // Convert current time to seconds
                    const currentMinutes = parseInt(match[1]);
                    const currentSeconds = parseInt(match[2]);
                    const currentTotal = (currentMinutes * 60) + currentSeconds;

                    // Convert total time to seconds
                    const totalHours = parseInt(match[3] || '0');
                    const totalMinutes = parseInt(match[4]);
                    const totalSeconds = parseInt(match[5] || '0'); // Default to 0 if not present
                    const totalTime = (totalHours * 3600) + (totalMinutes * 60) + totalSeconds;

                    // Calculate percentage
                    const percentage = (currentTotal / totalTime) * 100;
                    console.log('Current time:', currentTotal, 'Total time:', totalTime, 'Percentage:', percentage);

                    return percentage;
                } catch (error: any) {
                    console.log(`Attempt ${attempts + 1} failed:`, error.message);
                    attempts++;
                    if (attempts === maxAttempts) {
                        throw error;
                    }
                    // Try showing controls again
                    await this.showPlayerControls();
                    await this.driver.pause(2000);
                }
            }
            throw new Error('Could not get current position after multiple attempts');
        } catch (error: any) {
            console.error('Error getting current position:', error.message);
            throw error;
        }
    }

    async getShowTitle(): Promise<string> {
        const element = await this.waitForElement(this.selectors.showTitle);
        return element.getText();
    }

    async getEpisodeInfo(): Promise<string> {
        const element = await this.waitForElement(this.selectors.episodeInfo) as unknown as ChainablePromiseElement<any>;
        return element.getText();
    }

    async waitForSeekbarVisible(maxAttempts = 5): Promise<boolean> {
        let seekbarVisible = false;
        let attempts = 0;

        while (!seekbarVisible && attempts < maxAttempts) {
            await this.driver.pressKeyCode(66); // Enter key
            await this.driver.pause(2000);

            try {
                seekbarVisible = await this.isElementDisplayed(this.selectors.seekbar3);
            } catch (e) {
                seekbarVisible = false;
            }
            attempts++;
        }

        return seekbarVisible;
    }

    async verifyMoviePlayback(): Promise<void> {
        try {
            await this.waitForLoaded();

            // Wait for any ads to finish first
            await this.waitForAdsToFinish();

            // Now that ads are done, show and verify controls
            await this.showPlayerControls();

            const seekbarVisible = await this.waitForSeekbarVisible();
            if (!seekbarVisible) {
                throw new Error('Seekbar did not become visible');
            }

            // Additional pause to ensure playback is stable
            await this.driver.pause(2000);
        } catch (error) {
            console.error('Error verifying movie playback:', error);
            throw error;
        }
    }

    async seekRewind(): Promise<void> {
        try {
            // Just show controls and use keyboard navigation
            await this.showPlayerControls();
            await this.driver.pause(2000);

            // Press left key multiple times
            console.log('Starting seek rewind...');
            for (let i = 0; i < 10; i++) {
                await this.driver.pressKeyCode(21); // Left key
                await this.driver.pause(200);
            }

            // Press Enter to confirm
            await this.driver.pressKeyCode(66);
            await this.driver.pause(2000);
        } catch (error) {
            console.error('Error during seek rewind:', error);
            throw error;
        }
    }

    /**
     * Checks if an ad is currently playing
     * @returns {Promise<boolean>} True if ad is playing, false otherwise
     */
    async isAdPlaying(): Promise<boolean> {
        try {
            // Check for ad text element
            const adTextPresent = await this.isElementDisplayed(this.selectors.adText);
            if (adTextPresent) {
                console.log('Ad detected via ad text element');
                return true;
            }

            // Check for ad overlay
            const adOverlayPresent = await this.isElementDisplayed(this.selectors.adOverlay);
            if (adOverlayPresent) {
                console.log('Ad detected via ad overlay element');
                return true;
            }

            // Check for ad remaining time element
            const adRemainingPresent = await this.isElementDisplayed(this.selectors.adRemainingTime);
            if (adRemainingPresent) {
                console.log('Ad detected via remaining time element');
                return true;
            }

            return false;
        } catch (error) {
            console.log('Error checking for ad:', error);
            return false;
        }
    }

    async pressRightButton() {
        await this.driver.pressKeyCode(22); // 22 is the keycode for KEYCODE_DPAD_RIGHT
    }

    async wait(seconds: number) {
        await this.driver.pause(seconds * 1000);
    }

    async resumePlayback() {
        await this.driver.pressKeyCode(66); // 66 is the keycode for KEYCODE_ENTER
    }

    /**
* Checks for the visibility of the play or resume button after navigating back.
* If neither button is visible, it navigates back, presses the right key,
* and checks again until one of the buttons is found or a maximum number of attempts is reached.
* Once a button is found, it proceeds with playback.
* 
* @throws {Error} If there are issues during navigation or visibility checks.
*/
    public async checkAndNavigateForPlayback(maxAttempts = 5): Promise<void> {
        try {
            let attempts = 0;
            let isPlaying = false;

            while (!isPlaying && attempts < maxAttempts) {
                // Check for play or resume button visibility
                const playVisible = await this.isElementVisible(this.selectors.playButton);
                const resumeVisible = await this.isElementVisible(this.selectors.resumeButton);

                if (playVisible) {
                    await this.clickElement(this.selectors.playButton);
                    isPlaying = true; // Playback initiated
                } else if (resumeVisible) {
                    await this.clickElement(this.selectors.resumeButton);
                    isPlaying = true; // Playback resumed
                } else {
                    // Neither button is visible, navigate back
                    await this.driver.pressKeyCode(KEYCODE_BACK);
                    await this.driver.pause(2000); // Wait for the previous screen to load

                    // Press right key to navigate to the details page again
                    await this.driver.pressKeyCode(KEYCODE_DPAD_RIGHT);
                    await this.driver.pressKeyCode(KEYCODE_ENTER); // Enter the details page
                    await this.driver.pause(2000); // Wait for the details page to load
                }

                attempts++; // Increment the attempt counter
            }

            if (!isPlaying) {
                console.error('Failed to find play or resume button after maximum attempts.');
                throw new Error('Playback initiation failed after multiple attempts.');
            }
        } catch (error: any) {
            console.error('Error in checkAndNavigateForPlayback:', error);
            throw new Error(`Failed to check and navigate for playback: ${error.message}`);
        }
    }
    async isPlaybackOngoing(): Promise<boolean> {
        const isPlaying = await this.isElementDisplayed(this.selectors.playerFragment);
        return isPlaying;
    }


    public async clickElement(selector: string): Promise < void> {
    try {
        const element = await this.driver.$(selector);
        await element.click();
    } catch(error) {
        console.error(`Error clicking element ${selector}:`, error);
        throw new Error(`Failed to click element: ${selector}`);
    }

    }

    public async isElementVisible(selector: string): Promise < boolean > {
            try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed();
            } catch(error) {
            console.error(`Error checking visibility of element ${selector}:`, error);
            return false;
        }
    }

    public async pressEnter(): Promise<void> {
        await this.driver.pressKeyCode(KEYCODE_ENTER);
    }

    async performSeekOperation(direction: 'forward' | 'rewind'): Promise<{ initial: number; final: number }> {
        const initialPosition = await this.getCurrentPosition();
        console.log(`Starting seek ${direction}...`);

        if (direction === 'forward') {
            await this.fastForward();
        } else {
            await this.rewind();
        }

        await this.driver.pause(5000); // Wait for the seek to complete
        const finalPosition = await this.getCurrentPosition();
        return { initial: initialPosition, final: finalPosition };
    }
}
