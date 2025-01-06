import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class SeriesDetailsPage extends BasePage {
    public selectors = {
        // Series Information
        seriesTitle: 'android=resourceId("com.philo.philo:id/show_title").className("android.widget.TextView")',
        seriesDescription: 'android=resourceId("com.philo.philo:id/show_description").className("android.widget.TextView")',
        seriesPoster: 'android=resourceId("com.philo.philo:id/big_tile_poster_image").className("android.widget.ImageView")',
        seriesRating: 'android=resourceId("com.philo.philo:id/rating").className("android.widget.TextView")',
        releaseDate: 'android=resourceId("com.philo.philo:id/release_date").className("android.widget.TextView")',
        ratingAdvisories: 'android=resourceId("com.philo.philo:id/rating_advisories").className("android.widget.TextView")',
        
        // Channel Information
        channelLogo: 'android=resourceId("com.philo.philo:id/big_tile_channel_logo").className("android.widget.ImageView")',
        channelButton: 'android=resourceId("com.philo.philo:id/button_channel").className("android.view.ViewGroup")',
        channelName: 'android=resourceId("com.philo.philo:id/label_channel").className("android.widget.TextView")',
        
        // Action Buttons
        playButton: 'android=resourceId("com.philo.philo:id/button_play").className("android.widget.LinearLayout")',
        playLabel: 'android=resourceId("com.philo.philo:id/label_play").className("android.widget.TextView")',
        saveButton: 'android=resourceId("com.philo.philo:id/button_save").className("android.widget.FrameLayout")',
        saveLabel: 'android=resourceId("com.philo.philo:id/label_save").className("android.widget.TextView")',
        
        // Background Elements
        backgroundImage: 'android=resourceId("com.philo.philo:id/big_tile_background_image_view").className("android.widget.ImageView")',
        backgroundVideo: 'android=resourceId("com.philo.philo:id/big_tile_background_video_view").className("android.widget.FrameLayout")',
        backgroundGradient: 'android=resourceId("com.philo.philo:id/big_tile_gradient_layer_view").className("android.view.View")',
        
        // Container Elements
        detailsContainer: 'android=resourceId("com.philo.philo:id/big_tile_item_details_container").className("android.view.ViewGroup")',
        otherInfoContainer: 'android=resourceId("com.philo.philo:id/other_information_container").className("android.view.ViewGroup")',
        buttonsContainer: 'android=resourceId("com.philo.philo:id/big_tile_buttons_container").className("android.view.ViewGroup")',
        
        // Navigation Tabs
        episodesTab: 'android=className("android.widget.TextView").text("Episodes")',
        scheduleTab: 'android=className("android.widget.TextView").text("Schedule")',
        relatedTab: 'android=className("android.widget.TextView").text("Related")',
        extrasTab: 'android=className("android.widget.TextView").text("Extras")',
        detailsTab: 'android=className("android.widget.TextView").text("Details")',
        
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
        return await this.getText(this.selectors.releaseDate);
    }

    /**
     * Gets the number of seasons
     * @returns Promise<string> The season count
     */
    async getSeasonCount(): Promise<string> {
        const element = await this.driver.$('android=className("android.widget.TextView").text("11 Seasons")');
        return await element.getText();
    }

    /**
     * Gets the content rating
     * @returns Promise<string> The content rating
     */
    async getContentRating(): Promise<string> {
        return await this.getText(this.selectors.ratingAdvisories);
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
    /**
     * Clicks on the series poster
     */
    async clickOnSeries(): Promise<void> {
        await this.click(this.selectors.seriesPoster);
    }
} 
