"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesDetailsPage = void 0;
const base_page_1 = require("./base.page");
class MoviesDetailsPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            // Movie Information
            movieTitle: 'android=resourceId("com.philo.philo:id/show_title").className("android.widget.TextView")',
            movieDescription: 'android=resourceId("com.philo.philo:id/show_description").className("android.widget.TextView")',
            moviePoster: 'android=resourceId("com.philo.philo:id/big_tile_poster_image").className("android.widget.ImageView")',
            movieRating: 'android=resourceId("com.philo.philo:id/rating").className("android.widget.TextView")',
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
            // Navigation
            dismissButton: 'android=resourceId("com.philo.philo:id/big_tile_dismiss_text")'
        };
    }
    /**
     * Gets the movie title text
     * @returns Promise<string> The movie title
     */
    async getMovieTitle() {
        return await this.getText(this.selectors.movieTitle);
    }
    /**
     * Gets the movie description text
     * @returns Promise<string> The movie description
     */
    async getMovieDescription() {
        return await this.getText(this.selectors.movieDescription);
    }
    /**
     * Gets the movie rating (e.g., "R", "PG-13")
     * @returns Promise<string> The movie rating
     */
    async getMovieRating() {
        return await this.getText(this.selectors.movieRating);
    }
    /**
     * Gets the movie release date
     * @returns Promise<string> The release date
     */
    async getReleaseDate() {
        return await this.getText(this.selectors.releaseDate);
    }
    /**
     * Gets the rating advisories (content warnings)
     * @returns Promise<string> The rating advisories
     */
    async getRatingAdvisories() {
        return await this.getText(this.selectors.ratingAdvisories);
    }
    /**
     * Gets the channel name
     * @returns Promise<string> The channel name
     */
    async getChannelName() {
        return await this.getText(this.selectors.channelName);
    }
    /**
     * Clicks the play button to start the movie
     */
    async clickPlay() {
        await this.click(this.selectors.playButton);
    }
    /**
     * Clicks the save button to save/unsave the movie
     */
    async clickSave() {
        await this.click(this.selectors.saveButton);
    }
    /**
     * Clicks the channel button to view more content from the channel
     */
    async clickChannel() {
        await this.click(this.selectors.channelButton);
    }
    /**
     * Dismisses the movie details page and returns to the previous screen
     */
    async dismiss() {
        await this.click(this.selectors.dismissButton);
    }
    /**
     * Verifies if the movie details page is displayed
     * @returns Promise<boolean> True if the movie details page is displayed
     */
    async isDisplayed() {
        return await this.isElementDisplayed(this.selectors.movieTitle);
    }
    /**
     * Waits for the movie details page to be fully loaded
     */
    async waitForLoaded() {
        await this.waitForElement(this.selectors.movieTitle);
    }
    /**
     * Verifies if the movie title is displayed
     * @returns Promise<boolean> True if the movie title is displayed
     */
    async isShowTitleDisplayed() {
        return await this.isElementDisplayed(this.selectors.movieTitle);
    }
    /**
     * Waits for the movie title to be fully loaded
     */
    async waitForShowTitle() {
        await this.waitForElement(this.selectors.movieTitle);
    }
}
exports.MoviesDetailsPage = MoviesDetailsPage;
