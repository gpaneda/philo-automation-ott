"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesDetailsPage = void 0;
const base_page_1 = require("./base.page");
class SeriesDetailsPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
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
    }
    /**
     * Gets the series title
     * @returns Promise<string> The series title
     */
    async getSeriesTitle() {
        const element = await this.waitForElement(this.selectors.seriesTitle);
        return element.getText();
    }
    async findPlayableSeries(maxAttempts = 5) {
        console.log('Looking for a series with Play or Resume button...');
        return await this.findPlayableTitle(maxAttempts);
    }
    async clickPlay() {
        try {
            // First try to click Resume if it exists
            const resumeExists = await this.isElementDisplayed(this.selectors.resumeButton);
            if (resumeExists) {
                await this.click(this.selectors.resumeButton);
                return;
            }
        }
        catch (error) {
            // If Resume doesn't exist, try Play button
            try {
                await this.click(this.selectors.playButton);
            }
            catch (playError) {
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
    /**
     * Checks if the Extras tab is present
     * @returns Promise<boolean> True if the Extras tab is present
     */
    async isExtrasTabPresent() {
        try {
            return await this.isElementDisplayed(this.selectors.extrasTab);
        }
        catch (error) {
            return false;
        }
    }
}
exports.SeriesDetailsPage = SeriesDetailsPage;
