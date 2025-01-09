"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesDetailsPage = void 0;
const base_page_1 = require("./base.page");
class SeriesDetailsPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            // Series Information - Using index-based selectors from XML structure
            seriesTitle: 'android=className("android.widget.TextView").index(1)',
            seriesDescription: 'android=className("android.widget.TextView").index(5)',
            releaseYear: 'android=className("android.widget.TextView").index(2)',
            seasonCount: 'android=className("android.widget.TextView").index(3)',
            rating: 'android=className("android.widget.TextView").index(4)',
            seriesPoster: 'android=resourceId("com.philo.philo:id/big_tile_poster_image").className("android.widget.ImageView")',
            // Channel Information
            channelLogo: 'android=resourceId("com.philo.philo:id/big_tile_channel_logo").className("android.widget.ImageView")',
            channelButton: 'android=resourceId("com.philo.philo:id/button_channel").className("android.view.ViewGroup")',
            channelName: 'android=resourceId("com.philo.philo:id/label_channel").className("android.widget.TextView")',
            // Action Buttons
            playButton: 'android=className("android.view.View").descriptionContains("Play")',
            saveButton: 'android=className("android.view.View").descriptionContains("Save")',
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
    }
    /**
     * Gets the series title
     * @returns Promise<string> The series title
     */
    async getSeriesTitle() {
        const element = await this.waitForElement(this.selectors.seriesTitle);
        return element.getText();
    }
    /**
     * Gets the series description
     * @returns Promise<string> The series description
     */
    async getSeriesDescription() {
        const element = await this.waitForElement(this.selectors.seriesDescription);
        return element.getText();
    }
    /**
     * Gets the release year
     * @returns Promise<string> The release year
     */
    async getReleaseYear() {
        const element = await this.waitForElement(this.selectors.releaseYear);
        return element.getText();
    }
    /**
     * Gets the number of seasons
     * @returns Promise<string> The season count
     */
    async getSeasonCount() {
        const element = await this.waitForElement(this.selectors.seasonCount);
        return element.getText();
    }
    /**
     * Gets the content rating
     * @returns Promise<string> The content rating
     */
    async getContentRating() {
        const element = await this.waitForElement(this.selectors.rating);
        return element.getText();
    }
    /**
     * Clicks the play button
     */
    async clickPlay() {
        await this.click(this.selectors.playButton);
    }
    /**
     * Clicks the save button
     */
    async clickSave() {
        await this.click(this.selectors.saveButton);
    }
    /**
     * Clicks the channel button
     */
    async clickChannel() {
        await this.click(this.selectors.channelButton);
    }
    /**
     * Navigates to Episodes tab
     */
    async goToEpisodes() {
        await this.click(this.selectors.episodesTab);
    }
    /**
     * Navigates to Schedule tab
     */
    async goToSchedule() {
        await this.click(this.selectors.scheduleTab);
    }
    /**
     * Navigates to Related tab
     */
    async goToRelated() {
        await this.click(this.selectors.relatedTab);
    }
    /**
     * Navigates to Extras tab
     */
    async goToExtras() {
        await this.click(this.selectors.extrasTab);
    }
    /**
     * Navigates to Details tab
     */
    async goToDetails() {
        await this.click(this.selectors.detailsTab);
    }
    /**
     * Verifies if the series details page is displayed
     * @returns Promise<boolean> True if the series details page is displayed
     */
    async isDisplayed() {
        return await this.isElementDisplayed(this.selectors.seriesTitle);
    }
    /**
     * Waits for the series details page to be fully loaded
     */
    async waitForLoaded() {
        await this.waitForElement(this.selectors.seriesTitle);
    }
    /**
     * Clicks on the series poster
     */
    async clickOnSeries() {
        await this.click(this.selectors.seriesPoster);
    }
}
exports.SeriesDetailsPage = SeriesDetailsPage;
