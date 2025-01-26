"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPage = void 0;
const base_page_1 = require("./base.page");
class PlayerPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            // Player Fragment
            playerFragment: 'android=resourceId("com.philo.philo:id/player_fragment_host")',
            modalFragment: 'android=resourceId("com.philo.philo:id/modal_fragment_host")',
            dialogFragment: 'android=resourceId("com.philo.philo:id/dialog_fragment_host")',
            adOverlay: 'android=text("Advertisements")',
            // Player Controls
            playPauseButton: 'android=resourceId("com.philo.philo:id/playerControls_playPauseButton")',
            playButton: 'android=resourceId("com.philo.philo:id/playerControls_playButton")',
            pauseButton: 'android=resourceId("com.philo.philo:id/playerControls_pauseButton")',
            rewindButton: 'android=resourceId("com.philo.philo:id/playerControls_rewindButton")',
            fastForwardButton: 'android=resourceId("com.philo.philo:id/playerControls_fastForwardButton")',
            progressBar: 'android=resourceId("com.philo.philo:id/playerControls_progressBar")',
            currentTime: 'android=resourceId("com.philo.philo:id/playerControls_currentTime")',
            duration: 'android=resourceId("com.philo.philo:id/playerControls_duration")',
            // Subtitles
            subtitlesContainer: 'android=resourceId("com.philo.philo:id/subtitles_container")',
            // Video Elements
            videoFrame: 'android=resourceId("com.philo.philo:id/video_frame")',
            videoSurface: 'android=resourceId("com.philo.philo:id/video_surface")',
            playbackRoot: 'android=resourceId("com.philo.philo:id/playback_root")',
            // Player UI Elements
            playerActivityRoot: 'android=resourceId("com.philo.philo:id/player_activity_root")',
            playerControlsRoot: 'android=resourceId("com.philo.philo:id/playerControls_root")',
            composeViewWrapper: 'android=resourceId("com.philo.philo:id/compose_view_wrapper")',
            // Seekbar Elements
            seekbarRoot: 'android=resourceId("com.philo.philo:id/seekbar_root")',
            seekbar3: 'android=new UiSelector().resourceId("com.philo.philo:id/seekbar_seekbar3").className("com.philo.philo.playerCranston.ui.SeekBar3")',
            seekbarContainer: 'android=resourceId("com.philo.philo:id/seekbar")',
            // Content Info Elements
            showTitle: 'android=resourceId("com.philo.philo:id/show_title").className("android.widget.TextView")',
            episodeInfo: 'android=resourceId("com.philo.philo:id/subtitle")',
            // Action Buttons
            saveShowButton: 'android=content-desc("Save show")',
            moreInfoButton: 'android=content-desc("More info")',
            optionsButton: 'android=content-desc("Options")',
            startOverButton: 'android=content-desc("Start over")',
            jumpToLiveButton: 'android=content-desc("Jump to live")',
            // Ad Elements
            adOverlayRoot: 'android=resourceId("com.philo.philo:id/ad_overlay_root")',
            adText: 'android=resourceId("com.philo.philo:id/advertisements")',
            adRemainingTime: 'android=resourceId("com.philo.philo:id/remaining_time")',
            adFfwdDisabled: 'android=resourceId("com.philo.philo:id/icon_ffwd_disable")',
        };
    }
    async waitForLoaded() {
        await this.verifyElementDisplayed(this.selectors.playerFragment);
    }
    async isDisplayed() {
        return await this.isElementDisplayed(this.selectors.playerFragment);
    }
    async togglePlayPause() {
        await this.driver.pressKeyCode(66);
        await this.driver.pause(2000);
    }
    async fastForward() {
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
        }
        catch (error) {
            console.error('Error during fast forward:', error);
            throw error;
        }
    }
    async rewind() {
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
        }
        catch (error) {
            console.error('Error during rewind:', error);
            throw error;
        }
    }
    async getCurrentTime() {
        const element = await this.waitForElement(this.selectors.currentTime);
        return element.getText();
    }
    async getDuration() {
        const element = await this.waitForElement(this.selectors.duration);
        return element.getText();
    }
    async areSubtitlesDisplayed() {
        return await this.isElementDisplayed(this.selectors.subtitlesContainer);
    }
    async waitForAdsToFinish() {
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
            }
            else {
                console.log('No ad overlay found');
            }
        }
        catch (error) {
            console.log('Error checking for ads:', error);
            // Don't throw the error as ads might not be present
        }
    }
    async verifyPlayerControls() {
        await this.verifyElementDisplayed(this.selectors.rewindButton);
        await this.verifyElementDisplayed(this.selectors.fastForwardButton);
        await this.verifyElementDisplayed(this.selectors.progressBar);
    }
    async showPlayerControls() {
        await this.driver.pressKeyCode(66); // Enter key code
        await this.driver.pause(2000); // Short pause for controls to appear
    }
    async startPlayback() {
        try {
            const playButton = await this.waitForElement(this.selectors.playButton);
            await playButton.click();
            await this.driver.pause(5000);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async waitForPlayback(timeout = 10000) {
        await this.waitForElement(this.selectors.pauseButton, timeout);
    }
    async isPlayButtonVisible() {
        return await this.isElementDisplayed(this.selectors.playButton);
    }
    async isPauseButtonVisible() {
        return await this.isElementDisplayed(this.selectors.pauseButton);
    }
    async isProgressBarVisible() {
        return await this.isElementDisplayed(this.selectors.progressBar);
    }
    async isRewindButtonVisible() {
        return await this.isElementDisplayed(this.selectors.rewindButton);
    }
    async isFastForwardButtonVisible() {
        return await this.isElementDisplayed(this.selectors.fastForwardButton);
    }
    async isSubtitlesContainerVisible() {
        return await this.isElementDisplayed(this.selectors.subtitlesContainer);
    }
    async isCurrentTimeVisible() {
        return await this.isElementDisplayed(this.selectors.currentTime);
    }
    async isDurationVisible() {
        return await this.isElementDisplayed(this.selectors.duration);
    }
    async seekForward() {
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
        }
        catch (error) {
            console.error('Error during seek forward:', error);
            throw error;
        }
    }
    async seekBackward() {
        await this.click(this.selectors.rewindButton);
    }
    async getCurrentPosition() {
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
                }
                catch (error) {
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
        }
        catch (error) {
            console.error('Error getting current position:', error.message);
            throw error;
        }
    }
    async getShowTitle() {
        const element = await this.waitForElement(this.selectors.showTitle);
        return element.getText();
    }
    async getEpisodeInfo() {
        const element = await this.waitForElement(this.selectors.episodeInfo);
        return element.getText();
    }
    async waitForSeekbarVisible(maxAttempts = 5) {
        let seekbarVisible = false;
        let attempts = 0;
        while (!seekbarVisible && attempts < maxAttempts) {
            await this.driver.pressKeyCode(66); // Enter key
            await this.driver.pause(2000);
            try {
                seekbarVisible = await this.isElementDisplayed(this.selectors.seekbar3);
            }
            catch (e) {
                seekbarVisible = false;
            }
            attempts++;
        }
        return seekbarVisible;
    }
    async verifyMoviePlayback() {
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
        }
        catch (error) {
            console.error('Error verifying movie playback:', error);
            throw error;
        }
    }
    async seekRewind() {
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
        }
        catch (error) {
            console.error('Error during seek rewind:', error);
            throw error;
        }
    }
    /**
     * Checks if an ad is currently playing
     * @returns {Promise<boolean>} True if ad is playing, false otherwise
     */
    async isAdPlaying() {
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
        }
        catch (error) {
            console.log('Error checking for ad:', error);
            return false;
        }
    }
    async pressRightButton() {
        await this.driver.pressKeyCode(22); // 22 is the keycode for KEYCODE_DPAD_RIGHT
    }
    async wait(seconds) {
        await this.driver.pause(seconds * 1000);
    }
    async resumePlayback() {
        await this.driver.pressKeyCode(66); // 66 is the keycode for KEYCODE_ENTER
    }
}
exports.PlayerPage = PlayerPage;
