import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class MoviesDetailsPage extends BasePage {
    public selectors = {
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
        playButton: 'android=new UiSelector().description("Play")',
        resumeButton: 'android=new UiSelector().text("Resume")',
        saveButton: 'android=new UiSelector().description("Save")',
        moreInfoButton: 'android=new UiSelector().description("More info")',
       
        
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
                // If neither button works, try to find a playable movie
                const found = await this.findPlayableMovie();
                if (!found) {
                    throw new Error('Could not find a playable movie');
                }
                // Try clicking play again on the new movie
                await this.clickPlay();
            }
        }
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

    /**
     * Verifies if the movie title is displayed
     * @returns Promise<boolean> True if the movie title is displayed
     */
    async isShowTitleDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.movieTitle);
    }

    /**
     * Waits for the movie title to be fully loaded
     */
    async waitForShowTitle(): Promise<void> {
        await this.waitForElement(this.selectors.movieTitle);
    }

    async findPlayableMovie(maxAttempts: number = 5): Promise<boolean> {
        console.log('Looking for a movie with Play or Resume button...');
        return await this.findPlayableTitle(maxAttempts);
    }
} 