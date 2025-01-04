import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class MoviesDetailsPage extends BasePage {
    public selectors = {
        // Movie Information
        movieTitle: 'android=resourceId("com.philo.philo:id/show_title")',
        movieDescription: 'android=resourceId("com.philo.philo:id/show_description")',
        moviePoster: 'android=resourceId("com.philo.philo:id/big_tile_poster_image")',
        movieRating: 'android=resourceId("com.philo.philo:id/rating")',
        releaseDate: 'android=resourceId("com.philo.philo:id/release_date")',
        ratingAdvisories: 'android=resourceId("com.philo.philo:id/rating_advisories")',
        
        // Channel Information
        channelLogo: 'android=resourceId("com.philo.philo:id/big_tile_channel_logo")',
        channelButton: 'android=resourceId("com.philo.philo:id/button_channel")',
        channelName: 'android=resourceId("com.philo.philo:id/label_channel")',
        
        // Action Buttons
        playButton: 'android=resourceId("com.philo.philo:id/button_play")',
        playLabel: 'android=resourceId("com.philo.philo:id/label_play")',
        saveButton: 'android=resourceId("com.philo.philo:id/button_save")',
        saveLabel: 'android=resourceId("com.philo.philo:id/label_save")',
        
        // Background Elements
        backgroundImage: 'android=resourceId("com.philo.philo:id/big_tile_background_image_view")',
        backgroundVideo: 'android=resourceId("com.philo.philo:id/big_tile_background_video_view")',
        
        // Navigation
        dismissButton: 'android=resourceId("com.philo.philo:id/big_tile_dismiss_text")',
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Gets the movie title text
     * @returns Promise<string> The movie title
     */
    async getMovieTitle(): Promise<string> {
        return await this.getText(this.selectors.movieTitle);
    }

    /**
     * Gets the movie description text
     * @returns Promise<string> The movie description
     */
    async getMovieDescription(): Promise<string> {
        return await this.getText(this.selectors.movieDescription);
    }

    /**
     * Gets the movie rating (e.g., "R", "PG-13")
     * @returns Promise<string> The movie rating
     */
    async getMovieRating(): Promise<string> {
        return await this.getText(this.selectors.movieRating);
    }

    /**
     * Gets the movie release date
     * @returns Promise<string> The release date
     */
    async getReleaseDate(): Promise<string> {
        return await this.getText(this.selectors.releaseDate);
    }

    /**
     * Gets the rating advisories (content warnings)
     * @returns Promise<string> The rating advisories
     */
    async getRatingAdvisories(): Promise<string> {
        return await this.getText(this.selectors.ratingAdvisories);
    }

    /**
     * Gets the channel name
     * @returns Promise<string> The channel name
     */
    async getChannelName(): Promise<string> {
        return await this.getText(this.selectors.channelName);
    }

    /**
     * Clicks the play button to start the movie
     */
    async clickPlay(): Promise<void> {
        await this.click(this.selectors.playButton);
    }

    /**
     * Clicks the save button to save/unsave the movie
     */
    async clickSave(): Promise<void> {
        await this.click(this.selectors.saveButton);
    }

    /**
     * Clicks the channel button to view more content from the channel
     */
    async clickChannel(): Promise<void> {
        await this.click(this.selectors.channelButton);
    }

    /**
     * Dismisses the movie details page and returns to the previous screen
     */
    async dismiss(): Promise<void> {
        await this.click(this.selectors.dismissButton);
    }

    /**
     * Verifies if the movie details page is displayed
     * @returns Promise<boolean> True if the movie details page is displayed
     */
    async isDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.movieTitle);
    }

    /**
     * Waits for the movie details page to be fully loaded
     */
    async waitForLoaded(): Promise<void> {
        await this.waitForElement(this.selectors.movieTitle);
    }
} 