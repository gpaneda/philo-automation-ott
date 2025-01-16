import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import path from 'path';

export class MoviesDetailsPage extends BasePage {
    public selectors = {
        movieTitle: 'android=new UiSelector().className("android.widget.TextView").index(1)',
        movieDescription: 'android=new UiSelector().className("android.widget.TextView").clickable(true)',
        movieRating: 'android=new UiSelector().className("android.widget.TextView").text("R")',
        movieRatingAdvisories: 'android=new UiSelector().className("android.widget.TextView").index(8)',
        movieDuration: 'android=new UiSelector().className("android.widget.TextView").index(3)',
        movieReleaseYear: 'android=new UiSelector().className("android.widget.TextView").index(6)',
        movieChannelName: 'android=new UiSelector().className("android.widget.TextView").index(5)',
        
        playButton: 'android=new UiSelector().description("Play")',
        playButtonByDesc: 'android=new UiSelector().description("Play")',
        playButtonByText: 'android=new UiSelector().text("Play")',
        resumeButton: 'android=new UiSelector().text("Resume")',
        saveButton: 'android=new UiSelector().description("Save")',
        channelButton: 'android=new UiSelector().description("View Christmas Plus page")',
        dismissButton: 'android=new UiSelector().text("Back")',
        
        releaseDate: 'android=new UiSelector().className("android.widget.TextView").index(6)',
        ratingAdvisories: 'android=new UiSelector().className("android.widget.TextView").index(8)',
        channelName: 'android=new UiSelector().className("android.widget.TextView").index(5)'
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
                'android=new UiSelector().resourceId("com.philo.philo:id/show_title")',
                'android=new UiSelector().className("android.widget.TextView").textMatches(".*")',
                'android=new UiSelector().className("android.widget.TextView").index(0)',
                'android=new UiSelector().className("android.widget.TextView").index(1)',
                'android=new UiSelector().className("android.widget.TextView").index(2)'
            ];
            
            let foundElement = false;
            for (const selector of selectors) {
                try {
                    console.log(`Trying selector: ${selector}`);
                    const element = await this.driver.$(selector);
                    const isDisplayed = await element.isDisplayed();
                    if (isDisplayed) {
                        const text = await element.getText();
                        console.log(`Found element with text: "${text}"`);
                        foundElement = true;
                        break;
                    }
                    console.log(`Element found but not displayed: ${selector}`);
                } catch (error: any) {
                    console.log(`Selector ${selector} not found:`, error.message);
                }
            }
            
            if (!foundElement) {
                console.log('Attempting to find any visible TextView...');
                const textViews = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
                for (const element of textViews) {
                    try {
                        const isDisplayed = await element.isDisplayed();
                        if (isDisplayed) {
                            const text = await element.getText();
                            if (text && text.length > 0) {
                                console.log(`Found TextView with text: "${text}"`);
                                foundElement = true;
                                break;
                            }
                        }
                    } catch (error: any) {
                        console.log('Error checking TextView:', error.message);
                    }
                }
            }
            
            if (!foundElement) {
                // Take a screenshot for debugging
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const screenshotPath = path.join(process.cwd(), 'screenshots', 'errors', `movie-details-${timestamp}.png`);
                await this.driver.saveScreenshot(screenshotPath);
                console.log(`Screenshot saved to: ${screenshotPath}`);
                
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
            console.log('Attempting to click play button...');
            
            // Try different play button selectors first
            const playSelectors = [
                this.selectors.playButton,
                this.selectors.playButtonByDesc,
                this.selectors.playButtonByText
            ];

            for (const selector of playSelectors) {
                try {
                    console.log(`Trying play button selector: ${selector}`);
                    const element = await this.driver.$(selector);
                    const exists = await element.isDisplayed();
                    if (exists) {
                        console.log(`Found play button with selector: ${selector}`);
                        await element.click();
                        return;
                    }
                } catch (error) {
                    console.log(`Selector ${selector} not found or not clickable`);
                }
            }

            // If play button not found, try resume as fallback
            try {
                console.log('Checking for resume button...');
                const resumeElement = await this.driver.$(this.selectors.resumeButton);
                const resumeExists = await resumeElement.isDisplayed();
                if (resumeExists) {
                    console.log('Resume button found, clicking it...');
                    await resumeElement.click();
                    return;
                }
            } catch (error) {
                console.log('No resume button found');
            }

            // If we get here, no playable button was found
            throw new Error('Could not find any playable button');
            
        } catch (error) {
            console.error('Error clicking play:', error);
            throw error;
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