import { Browser, Element } from 'webdriverio';
import { BasePage } from './base.page';

export class PlayerPage extends BasePage {
    /**
     * Checks if the play button is displayed
     * @returns Promise<boolean> True if the play button is displayed
     */
    async isPlayButtonDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.playButton);
    }
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
        showTitle: 'android=resourceId("com.philo.philo:id/title")',
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

    /**
     * Waits for the player to be loaded
     */
    async waitForLoaded(): Promise<void> {
        try {
            const playerFragment = await this.driver.$('android=resourceId("com.philo.philo:id/player_fragment_host")');
            await playerFragment.waitForDisplayed({ timeout: 30000 });
        } catch (error) {
            console.error('Error waiting for player to load:', error);
            throw error;
        }
    }

    /**
     * Checks if the player is displayed
     * @returns Promise<boolean> True if the player is displayed
     */
    async isDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.playerFragment);
    }

    /**
     * Plays or pauses the video
     */
    async togglePlayPause(): Promise<void> {
        try {
            await this.driver.pressKeyCode(66);
        } catch (error) {
            console.error('Error toggling play/pause:', error);
            throw error;
        }
    }

    /**
     * Fast forwards the video
     */
    async fastForward(): Promise<void> {
        await this.click(this.selectors.fastForwardButton);
    }

    /**
     * Rewinds the video
     */
    async rewind(): Promise<void> {
        await this.click(this.selectors.rewindButton);
    }

    /**
     * Gets the current playback time
     * @returns Promise<string> The current time in MM:SS format
     */
    async getCurrentTime(): Promise<string> {
        const element = await this.waitForElement(this.selectors.currentTime);
        return element.getText();
    }

    /**
     * Gets the total duration of the video
     * @returns Promise<string> The total duration in MM:SS format
     */
    async getDuration(): Promise<string> {
        const element = await this.waitForElement(this.selectors.duration);
        return element.getText();
    }

    /**
     * Checks if subtitles are displayed
     * @returns Promise<boolean> True if subtitles are displayed
     */
    async areSubtitlesDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.subtitlesContainer);
    }

    /**
     * Verifies player controls are displayed
     */
    async verifyPlayerControls(): Promise<void> {
        await this.verifyElementDisplayed(this.selectors.playPauseButton);
        await this.verifyElementDisplayed(this.selectors.rewindButton);
        await this.verifyElementDisplayed(this.selectors.fastForwardButton);
        await this.verifyElementDisplayed(this.selectors.progressBar);
    }

    /**
     * Shows player controls by pressing select/enter button
     */
    async showPlayerControls(): Promise<void> {
        await this.driver.pressKeyCode(66); // Enter key code
        await this.verifyPlayerControls();
    }

    /**
     * Checks if video is currently playing
     * @returns Promise<boolean> True if video is playing, false if paused
     */
    async isPlaying(): Promise<boolean> {
        try {
            const playbackState = await this.driver.execute('mobile: isPlaying');
            return playbackState;
        } catch (error) {
            console.error('Error checking playback state:', error);
            throw error;
        }
    }


    /**
     * Starts playback from the current screen
     * @returns Promise<boolean> True if playback started successfully
     */
    async startPlayback(): Promise<boolean> {
        try {
            // Wait for and click play button
            const playButton = await this.waitForElement(this.selectors.playButton, 10000);
            await playButton.click();
            await this.driver.pause(5000);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Waits for playback to start
     * @param timeout Timeout in milliseconds (default: 10000)
     */
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
        const element = await this.waitForElement(this.selectors.progressBar) as Element<'async'>;
        const progress = await element.getAttribute('progress');
        return parseFloat(progress || '0');
    }   

    /**
     * Gets the show title text
     * @returns Promise<string> The show title
     */
    async getShowTitle(): Promise<string> {
        try {
            const showTitleElement = await this.driver.$('android=resourceId("com.philo.philo:id/show_title")');
            if (await showTitleElement.isDisplayed()) {
                return await showTitleElement.getText();
            }
            throw new Error('Could not find show title element');
        } catch (error) {
            console.error('Error getting show title:', error);
            throw error;
        }
    }

    /**
     * Gets the episode information text
     * @returns Promise<string> The episode information
     */
    async getEpisodeInfo(): Promise<string> {
        const element = await this.waitForElement(this.selectors.episodeInfo);
        return element.getText();
    }

    /**
     * Waits for seekbar to become visible by pressing Enter key repeatedly
     * @param maxAttempts Maximum number of attempts to try (default: 5)
     * @returns Promise<boolean> True if seekbar became visible
     */
    async waitForSeekbarVisible(maxAttempts: number = 5): Promise<boolean> {
        let seekbarVisible = false;
        let attempts = 0;

        while (!seekbarVisible && attempts < maxAttempts) {
            await this.driver.pressKeyCode(66); // Enter key
            await this.driver.pause(2000);
            
            try {
                const seekbar = await this.driver.$('android=resourceId("com.philo.philo:id/seekbar_seekbar3")');
                seekbarVisible = await seekbar.isDisplayed();
            } catch (e) {
                seekbarVisible = false;
            }
            attempts++;
        }

        return seekbarVisible;
    }

    /**
     * Verifies movie playback functionality
     * @param initialTitle The initial title to compare with
     * @returns Promise<void>
     */
    async verifyMoviePlayback(initialTitle: string): Promise<void> {
        try {
            // Wait for player to load
            await this.waitForLoaded();
            await this.driver.pause(5000);

            // Test pause functionality
            await this.togglePlayPause();
            await this.driver.pause(2000);

            // Verify seekbar is displayed while paused
            const seekbar = await this.driver.$('android=resourceId("com.philo.philo:id/seekbar_seekbar3")');
            await seekbar.waitForDisplayed({ timeout: 10000 });

            await this.driver.pause(5000);

            // Verify the movie title matches
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
