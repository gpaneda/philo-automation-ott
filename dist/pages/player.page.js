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
            // Player Controls
            playPauseButton: 'android=resourceId("com.philo.philo:id/exo_play_pause")',
            playButton: 'android=resourceId("com.philo.philo:id/exo_play")',
            pauseButton: 'android=resourceId("com.philo.philo:id/exo_pause")',
            rewindButton: 'android=resourceId("com.philo.philo:id/exo_rew")',
            fastForwardButton: 'android=resourceId("com.philo.philo:id/exo_ffwd")',
            progressBar: 'android=resourceId("com.philo.philo:id/exo_progress")',
            currentTime: 'android=resourceId("com.philo.philo:id/exo_position")',
            duration: 'android=resourceId("com.philo.philo:id/exo_duration")',
            // Subtitles
            subtitlesContainer: 'android=resourceId("com.philo.philo:id/exo_subtitles")',
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
            seekbar3: 'android=resourceId("com.philo.philo:id/seekbar_seekbar3")',
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
    }
    async fastForward() {
        await this.click(this.selectors.fastForwardButton);
    }
    async rewind() {
        await this.click(this.selectors.rewindButton);
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
    async verifyPlayerControls() {
        await this.verifyElementDisplayed(this.selectors.playPauseButton);
        await this.verifyElementDisplayed(this.selectors.rewindButton);
        await this.verifyElementDisplayed(this.selectors.fastForwardButton);
        await this.verifyElementDisplayed(this.selectors.progressBar);
    }
    async showPlayerControls() {
        await this.driver.pressKeyCode(66); // Enter key code
        await this.verifyPlayerControls();
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
        await this.click(this.selectors.fastForwardButton);
    }
    async seekBackward() {
        await this.click(this.selectors.rewindButton);
    }
    async getCurrentPosition() {
        const element = await this.waitForElement(this.selectors.progressBar);
        const progress = await element.getAttribute('progress');
        return parseFloat(progress || '0');
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
    async verifyMoviePlayback(initialTitle) {
        try {
            await this.waitForLoaded();
            await this.driver.pause(5000);
            await this.togglePlayPause();
            await this.driver.pause(2000);
            const seekbarVisible = await this.waitForSeekbarVisible();
            if (!seekbarVisible) {
                throw new Error('Seekbar did not become visible');
            }
            await this.driver.pause(5000);
        }
        catch (error) {
            console.error('Error verifying movie playback:', error);
            throw error;
        }
    }
}
exports.PlayerPage = PlayerPage;
