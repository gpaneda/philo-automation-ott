import { Browser, ChainablePromiseElement, Element } from 'webdriverio';
import { BasePage } from './base.page';

export class PlayerPage extends BasePage {
    public selectors = {
        // Player Fragment
        playerFragment: 'android=resourceId("com.philo.philo.google:id/player_fragment_host")',
        modalFragment: 'android=resourceId("com.philo.philo.google:id/modal_fragment_host")',
        dialogFragment: 'android=resourceId("com.philo.philo.google:id/dialog_fragment_host")',
        fragmentHostOverlay: 'android=resourceId("com.philo.philo.google:id/fragment_host_overlay")',
        
        // Player Controls Root
        playerActivityRoot: 'android=resourceId("com.philo.philo.google:id/player_activity_root")',
        playerControlsRoot: 'android=resourceId("com.philo.philo.google:id/playerControls_root")',
        composeViewWrapper: 'android=resourceId("com.philo.philo.google:id/compose_view_wrapper")',

        // Player Controls
        playPauseButton: 'android=className("android.view.View").descriptionContains("Play")',
        playButton: 'android=className("android.view.View").descriptionContains("Play")',
        pauseButton: 'android=className("android.view.View").descriptionContains("Pause")',
        rewindButton: 'android=className("android.view.View").descriptionContains("Rewind")',
        fastForwardButton: 'android=className("android.view.View").descriptionContains("Forward")',
        progressBar: 'android=resourceId("com.philo.philo.google:id/seekbar_seekbar3")',
        currentTime: 'android=className("android.widget.TextView").textMatches("\\d+:\\d+")',
        duration: 'android=className("android.widget.TextView").textMatches("\\d+:\\d+")',

        // Subtitles
        subtitlesContainer: 'android=resourceId("com.philo.philo.google:id/exo_subtitles")',

        // Video Elements
        videoFrame: 'android=resourceId("com.philo.philo.google:id/video_frame")',
        videoSurface: 'android=resourceId("com.philo.philo.google:id/video_surface")',
        playbackRoot: 'android=resourceId("com.philo.philo.google:id/playback_root")',

        // Content Info Elements
        showTitle: 'android=className("android.widget.TextView").index(1)',  // "Tyler Perry's Sistas"
        episodeInfo: 'android=className("android.widget.TextView").index(2)',  // "S8 | E1 Dead Man Walking"
        thumbnailImage: 'android=className("android.widget.ImageView").descriptionContains("Tyler Perry")',

        // Action Buttons
        saveShowButton: 'android=className("android.view.View").descriptionContains("save show")',
        moreInfoButton: 'android=className("android.view.View").descriptionContains("More info")',
        optionsButton: 'android=className("android.view.View").descriptionContains("Options")',
        startOverButton: 'android=className("android.view.View").descriptionContains("Start over")',
        playNextButton: 'android=className("android.view.View").descriptionContains("Play next")',

        // Seekbar Elements
        seekbarRoot: 'android=resourceId("com.philo.philo.google:id/seekbar_root")',
        seekbar3: 'android=resourceId("com.philo.philo.google:id/seekbar_seekbar3")',
        seekbarContainer: 'android=resourceId("com.philo.philo.google:id/seekbar")'
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
        const element = await this.waitForElement(this.selectors.currentTime) as ChainablePromiseElement<Element<'async'>>;
        return element.getText();
    }

    async getDuration(): Promise<string> {
        const element = await this.waitForElement(this.selectors.duration) as ChainablePromiseElement<Element<'async'>>;
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
            const playButton = await this.waitForElement(this.selectors.playButton) as ChainablePromiseElement<Element<'async'>>;
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
        await this.click(this.selectors.fastForwardButton);
    }

    async seekBackward(): Promise<void> {
        await this.click(this.selectors.rewindButton);
    }

    async getCurrentPosition(): Promise<number> {
        const element = await this.waitForElement(this.selectors.progressBar) as ChainablePromiseElement<Element<'async'>>;
        const progress = await element.getAttribute('progress');
        return parseFloat(progress || '0');
    }   

    async getShowTitle(): Promise<string> {
        const element = await this.waitForElement(this.selectors.showTitle) as ChainablePromiseElement<Element<'async'>>;
        return element.getText();
    }

    async getEpisodeInfo(): Promise<string> {
        const element = await this.waitForElement(this.selectors.episodeInfo) as ChainablePromiseElement<Element<'async'>>;
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
        } catch (error) {
            console.error('Error verifying movie playback:', error);
            throw error;
        }
    }
} 
