import { Browser, ChainablePromiseElement } from 'webdriverio';
import { BasePage } from './base.page';

export class PlayerPage extends BasePage {
    public selectors = {
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
        showTitle: 'android=resourceId("com.philo.philo:id/show_title")',
        episodeInfo: 'android=resourceId("com.philo.philo:id/subtitle")',

        // Action Buttons
        saveShowButton: 'android=content-desc("Save show")',
        moreInfoButton: 'android=content-desc("More info")',
        optionsButton: 'android=content-desc("Options")',
        startOverButton: 'android=content-desc("Start over")',
        jumpToLiveButton: 'android=content-desc("Jump to live")',
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
    }

    async fastForward(): Promise<void> {
        await this.click(this.selectors.fastForwardButton);
    }

    async rewind(): Promise<void> {
        await this.click(this.selectors.rewindButton);
    }

    async getCurrentTime(): Promise<string> {
        const element = await this.waitForElement(this.selectors.currentTime);
        return element.getText();
    }

    async getDuration(): Promise<string> {
        const element = await this.waitForElement(this.selectors.duration);
        return element.getText();
    }

    async areSubtitlesDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.subtitlesContainer);
    }

    async verifyPlayerControls(): Promise<void> {
        await this.verifyElementDisplayed(this.selectors.playPauseButton);
        await this.verifyElementDisplayed(this.selectors.rewindButton);
        await this.verifyElementDisplayed(this.selectors.fastForwardButton);
        await this.verifyElementDisplayed(this.selectors.progressBar);
    }

    async showPlayerControls(): Promise<void> {
        await this.driver.pressKeyCode(66); // Enter key code
        await this.verifyPlayerControls();
    }

    async startPlayback(): Promise<boolean> {
        try {
            const playButton = await this.waitForElement(this.selectors.playButton);
            await playButton.click();
            await this.driver.pause(5000);
            return true;
        } catch (e) {
            return false;
        }
    }

    async waitForPlayback(timeout: number = 10000): Promise<void> {
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
        await this.click(this.selectors.fastForwardButton);
    }

    async seekBackward(): Promise<void> {
        await this.click(this.selectors.rewindButton);
    }

    async getCurrentPosition(): Promise<number> {
        const element = await this.waitForElement(this.selectors.progressBar);
        const progress = await element.getAttribute('progress');
        return parseFloat(progress || '0');
    }   

    async getShowTitle(): Promise<string> {
        const element = await this.waitForElement(this.selectors.showTitle);
        return element.getText();
    }

    async getEpisodeInfo(): Promise<string> {
        const element = await this.waitForElement(this.selectors.episodeInfo);
        return element.getText();
    }

    async waitForSeekbarVisible(maxAttempts: number = 5): Promise<boolean> {
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

    async verifyMoviePlayback(initialTitle: string): Promise<void> {
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

            const movieTitleFromPlayer = await this.getShowTitle();
            if (movieTitleFromPlayer !== initialTitle) {
                throw new Error(`Title mismatch. Expected: ${initialTitle}, Got: ${movieTitleFromPlayer}`);
            }
        } catch (error) {
            console.error('Error verifying movie playback:', error);
            throw error;
        }
    }
} 
