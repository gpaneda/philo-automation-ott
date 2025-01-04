import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class SeriesDetailsPage extends BasePage {
    public selectors = {
        // Series Information
        seriesTitle: 'android=resourceId("com.philo.philo:id/show_title")',
        seriesDescription: 'android=resourceId("com.philo.philo:id/show_description")',
        seriesBackgroundImage: 'android=resourceId("com.philo.philo:id/big_tile_background_image_view")',
        seriesBackgroundVideo: 'android=resourceId("com.philo.philo:id/big_tile_background_video_view")',
        
        // Metadata
        releaseYear: 'android=className("android.widget.TextView").text("2010")',
        seasonCount: 'android=className("android.widget.TextView").text("11 Seasons")',
        contentRating: 'android=className("android.widget.TextView").text("TV-MA")',
        
        // Action Buttons
        playButton: 'android=className("android.view.View").descriptionContains("Play")',
        playButtonText: 'android=className("android.widget.TextView").textContains("Play")',
        saveButton: 'android=className("android.view.View").descriptionContains("Save")',
        saveButtonText: 'android=className("android.widget.TextView").text("Save")',
        channelButton: 'android=className("android.view.View").descriptionContains("View")',
        
        // Navigation Tabs
        episodesTab: 'android=className("android.widget.TextView").text("Episodes")',
        scheduleTab: 'android=className("android.widget.TextView").text("Schedule")',
        relatedTab: 'android=className("android.widget.TextView").text("Related")',
        extrasTab: 'android=className("android.widget.TextView").text("Extras")',
        detailsTab: 'android=className("android.widget.TextView").text("Details")',
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Gets the series title
     * @returns Promise<string> The series title
     */
    async getSeriesTitle(): Promise<string> {
        return await this.getText(this.selectors.seriesTitle);
    }

    /**
     * Gets the series description
     * @returns Promise<string> The series description
     */
    async getSeriesDescription(): Promise<string> {
        return await this.getText(this.selectors.seriesDescription);
    }

    /**
     * Gets the release year
     * @returns Promise<string> The release year
     */
    async getReleaseYear(): Promise<string> {
        return await this.getText(this.selectors.releaseYear);
    }

    /**
     * Gets the number of seasons
     * @returns Promise<string> The season count
     */
    async getSeasonCount(): Promise<string> {
        return await this.getText(this.selectors.seasonCount);
    }

    /**
     * Gets the content rating
     * @returns Promise<string> The content rating
     */
    async getContentRating(): Promise<string> {
        return await this.getText(this.selectors.contentRating);
    }

    /**
     * Clicks the play button
     */
    async clickPlay(): Promise<void> {
        await this.click(this.selectors.playButton);
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
} 