import { Browser } from 'webdriverio';
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
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Waits for the player to be loaded
     */
    async waitForLoaded(): Promise<void> {
        await this.waitForElement(this.selectors.playerFragment);
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
        await this.click(this.selectors.playPauseButton);
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
            // If pause button is visible, video is playing
            return await this.isElementDisplayed(this.selectors.pauseButton);
        } catch (e) {
            // If pause button is not visible, video is paused
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
} 