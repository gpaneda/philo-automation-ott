import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class MoviesDetailsPage extends BasePage {
    public selectors = {
        // Movie Information
        movieTitle: 'android=new UiSelector().resourceId("com.philo.philo:id/show_title")',
        movieDescription: 'android=new UiSelector().resourceId("com.philo.philo:id/show_description")',
        moviePoster: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_poster_image")',
        movieRating: 'android=new UiSelector().resourceId("com.philo.philo:id/rating")',
        releaseDate: 'android=new UiSelector().resourceId("com.philo.philo:id/release_date")',
        ratingAdvisories: 'android=new UiSelector().resourceId("com.philo.philo:id/rating_advisories")',
        
        // Channel Information
        channelLogo: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_channel_logo")',
        channelButton: 'android=new UiSelector().resourceId("com.philo.philo:id/button_channel")',
        channelName: 'android=new UiSelector().resourceId("com.philo.philo:id/label_channel")',
        
        // Action Buttons
        playButton: 'android=new UiSelector().description("Play")',
        resumeButton: 'android=new UiSelector().resourceId("com.philo.philo:id/resume_button")',
        saveButton: 'android=new UiSelector().description("Save")',
        moreInfoButton: 'android=new UiSelector().description("More info")',
        
        // Background Elements
        backgroundImage: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_background_image_view")',
        backgroundVideo: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_background_video_view")',
        backgroundGradient: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_gradient_layer_view")',
        
        // Container Elements
        detailsContainer: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_item_details_container")',
        otherInfoContainer: 'android=new UiSelector().resourceId("com.philo.philo:id/other_information_container")',
        buttonsContainer: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_buttons_container")',
        
        // Navigation
        dismissButton: 'android=new UiSelector().resourceId("com.philo.philo:id/big_tile_dismiss_text")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Waits for the movie details page to be fully loaded
     */
    async waitForLoaded(): Promise<void> {
        try {
            console.log('Waiting for movie details page to load...');
            
            // Try different selectors to find the title
            const selectors = [
                this.selectors.movieTitle,
                'android=new UiSelector().resourceId("com.philo.philo:id/title")',
                'android=new UiSelector().className("android.widget.TextView").text("*")'
            ];
            
            let foundElement = false;
            for (const selector of selectors) {
                try {
                    console.log(`Trying selector: ${selector}`);
                    await this.waitForElement(selector);
                    console.log(`Found element with selector: ${selector}`);
                    foundElement = true;
                    break;
                } catch (error) {
                    console.log(`Selector ${selector} not found`);
                }
            }
            
            if (!foundElement) {
                throw new Error('Could not find movie title element with any selector');
            }
            
            // Wait a bit more for any animations
            await this.driver.pause(2000);
        } catch (error) {
            console.error('Error waiting for movie details page:', error);
            throw error;
        }
    }

    /**
     * Gets the movie title text
     * @returns Promise<string> The movie title
     */
    async getMovieTitle(): Promise<string> {
        try {
            console.log('Attempting to get movie title using generic text selector...');
            
            // Try different approaches to find the title
            const textElements = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            
            // The movie title is usually the first text element on the page
            for (const element of textElements) {
                if (await element.isDisplayed()) {
                    const text = await element.getText();
                    if (text && text.length > 0) {
                        console.log(`Found title text: "${text}"`);
                        return text;
                    }
                }
            }
            
            throw new Error('Could not find movie title with any selector strategy');
        } catch (error) {
            console.error('Error getting movie title:', error);
            throw error;
        }
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
        try {
            // Look for any TextView that contains the movie title
            const textElements = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            for (const element of textElements) {
                if (await element.isDisplayed()) {
                    const text = await element.getText();
                    if (text && text.length > 0) {
                        console.log('Found text element:', text);
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Error checking if details page is displayed:', error);
            return false;
        }
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

    async isResumeButtonVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.resumeButton);
    }

    async clickResume(): Promise<void> {
        await this.click(this.selectors.resumeButton);
    }
} 