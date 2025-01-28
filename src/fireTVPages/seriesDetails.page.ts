import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class SeriesDetailsPage extends BasePage {
    public selectors = {
        // Series Information
        seriesTitle: 'android=new UiSelector().className("android.widget.TextView").textMatches(".*")',
        seriesYear: 'android=new UiSelector().className("android.widget.TextView").textMatches("\\d{4}")',
        seriesSeasons: 'android=new UiSelector().className("android.widget.TextView").textMatches("\\d+ Seasons?")',
        seriesRating: 'android=new UiSelector().className("android.widget.TextView").textMatches("TV-.*")',
        seriesDescription: 'android=new UiSelector().className("android.widget.TextView").textMatches(".*").index(5)',
        seriesPoster: 'android=new UiSelector().className("android.widget.ImageView").descriptionMatches(".*")',
        
        // Channel Information
        channelLogo: 'android=resourceId("com.philo.philo:id/big_tile_channel_logo").className("android.widget.ImageView")',
        channelButton: 'android=resourceId("com.philo.philo:id/button_channel").className("android.view.ViewGroup")',
        channelName: 'android=resourceId("com.philo.philo:id/label_channel").className("android.widget.TextView")',
        
        // Action Buttons
        playButton: 'android=new UiSelector().className("android.view.View").description("Play")',
        resumeButton: 'android=new UiSelector().className("android.widget.TextView").text("Resume")',
        saveButton: 'android=new UiSelector().className("android.view.View").descriptionContains("Save")',
        
        // Navigation Tabs
        episodesTab: 'android=className("android.widget.TextView").text("Episodes")',
        scheduleTab: 'android=className("android.widget.TextView").text("Schedule")',
        relatedTab: 'android=className("android.widget.TextView").text("Related")',
        extrasTab: 'android=className("android.widget.TextView").text("Extras")',
        detailsTab: 'android=className("android.widget.TextView").text("Details")',
        
        // Background Elements
        backgroundImage: 'android=resourceId("com.philo.philo:id/big_tile_background_image_view").className("android.widget.ImageView")',
        backgroundVideo: 'android=resourceId("com.philo.philo:id/big_tile_background_video_view").className("android.widget.FrameLayout")',
        backgroundGradient: 'android=resourceId("com.philo.philo:id/big_tile_gradient_layer_view").className("android.view.View")',
        
        // Container Elements
        detailsContainer: 'android=resourceId("com.philo.philo:id/big_tile_item_details_container").className("android.view.ViewGroup")',
        otherInfoContainer: 'android=resourceId("com.philo.philo:id/other_information_container").className("android.view.ViewGroup")',
        buttonsContainer: 'android=resourceId("com.philo.philo:id/big_tile_buttons_container").className("android.view.ViewGroup")',
        
        // Navigation
        dismissButton: 'android=resourceId("com.philo.philo:id/big_tile_dismiss_text")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Gets the series title
     * @returns Promise<string> The series title
     */
    async getSeriesTitle(): Promise<string> {
        const element = await this.waitForElement(this.selectors.seriesTitle);
        return element.getText();
    }

    async findPlayableSeries(maxAttempts: number = 5): Promise<boolean> {
        console.log('Looking for a series with Play or Resume button...');
        return await this.findPlayableTitle(maxAttempts);
    }

    async clickPlay(): Promise<void> {
        try {
            // First try to click Resume if it exists
            const resumeExists = await this.isElementDisplayed(this.selectors.resumeButton);
            if (resumeExists) {
                await this.click(this.selectors.resumeButton);
                return;
            }
        } catch (error) {
            // If Resume doesn't exist, try Play button
            try {
                await this.click(this.selectors.playButton);
            } catch (playError) {
                // If neither button works, try to find a playable series
                const found = await this.findPlayableSeries();
                if (!found) {
                    throw new Error('Could not find a playable series');
                }
                // Try clicking play again on the new series
                await this.clickPlay();
            }
        }
    }

    /**
     * Clicks the save button
     */
    async clickSave(): Promise<void> {
        await this.click(this.selectors.saveButton);
    }

    /**
     * Clicks the channel button
     */
    async clickChannel(): Promise<void> {
        await this.click(this.selectors.channelButton);
    }

    /**
     * Navigates to Episodes tab
     */
    async goToEpisodes(): Promise<void> {
        await this.click(this.selectors.episodesTab);
    }

    /**
     * Navigates to Schedule tab
     */
    async goToSchedule(): Promise<void> {
        await this.click(this.selectors.scheduleTab);
    }

    /**
     * Navigates to Related tab
     */
    async goToRelated(): Promise<void> {
        await this.click(this.selectors.relatedTab);
    }

    /**
     * Navigates to Extras tab
     */
    async goToExtras(): Promise<void> {
        await this.click(this.selectors.extrasTab);
    }

    /**
     * Navigates to Details tab
     */
    async goToDetails(): Promise<void> {
        await this.click(this.selectors.detailsTab);
    }

    /**
     * Verifies if the series details page is displayed
     * @returns Promise<boolean> True if the series details page is displayed
     */
    async isDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.seriesTitle);
    }

    /**
     * Waits for the series details page to be fully loaded
     */
    async waitForLoaded(): Promise<void> {
        await this.waitForElement(this.selectors.seriesTitle);
    }
    /**
     * Clicks on the series poster
     */
    async clickOnSeries(): Promise<void> {
        await this.click(this.selectors.seriesPoster);
    }

    /**
     * Checks if the Extras tab is present
     * @returns Promise<boolean> True if the Extras tab is present
     */
    async isExtrasTabPresent(): Promise<boolean> {
        try {
            return await this.isElementDisplayed(this.selectors.extrasTab);
        } catch (error) {
            return false;
        }
    }
} 
