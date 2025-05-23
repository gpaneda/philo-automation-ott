"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesDetailsPage = void 0;
const base_page_1 = require("./base.page");
const path_1 = __importDefault(require("path"));
class MoviesDetailsPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            movieTitle: 'android=new UiSelector().className("android.widget.TextView").index(1)',
            movieDescription: [
                'android=new UiSelector().resourceId("com.philo.philo:id/description")',
                'android=new UiSelector().resourceId("com.philo.philo:id/movie_description")',
                'android=new UiSelector().resourceId("com.philo.philo:id/content_description")',
                'android=new UiSelector().className("android.widget.TextView").index(2)',
                'android=new UiSelector().className("android.widget.TextView").textContains(".")'
            ],
            movieRating: [
                'android=new UiSelector().resourceId("com.philo.philo:id/rating")',
                'android=new UiSelector().resourceId("com.philo.philo:id/content_rating")',
                'android=new UiSelector().className("android.widget.TextView").textMatches("^[A-Z0-9-]+$")'
            ],
            movieRatingAdvisories: [
                'android=new UiSelector().resourceId("com.philo.philo:id/rating_advisories")',
                'android=new UiSelector().resourceId("com.philo.philo:id/content_advisories")',
                'android=new UiSelector().className("android.widget.TextView").textContains("violence")',
                'android=new UiSelector().className("android.widget.TextView").textContains("language")'
            ],
            movieDuration: [
                'android=new UiSelector().resourceId("com.philo.philo:id/duration")',
                'android=new UiSelector().resourceId("com.philo.philo:id/content_duration")',
                'android=new UiSelector().className("android.widget.TextView").textMatches(".*[0-9]+ min.*")'
            ],
            movieReleaseYear: [
                'android=new UiSelector().resourceId("com.philo.philo:id/release_year")',
                'android=new UiSelector().resourceId("com.philo.philo:id/content_year")',
                'android=new UiSelector().className("android.widget.TextView").textMatches("^[0-9]{4}$")'
            ],
            movieChannelName: [
                'android=new UiSelector().resourceId("com.philo.philo:id/channel_name")',
                'android=new UiSelector().resourceId("com.philo.philo:id/content_channel")',
                'android=new UiSelector().className("android.widget.TextView").textContains("Channel")'
            ],
            playButton: 'android=new UiSelector().description("Play")',
            playButtonByDesc: 'android=new UiSelector().description("Play")',
            playButtonByText: 'android=new UiSelector().text("Play")',
            resumeButton: 'android=new UiSelector().text("Resume")',
            saveButton: 'android=new UiSelector().description("Save")',
            channelButton: 'android=new UiSelector().description("View Christmas Plus page")',
            dismissButton: 'android=new UiSelector().text("Back")',
            releaseDate: 'android=new UiSelector().resourceId("com.philo.philo:id/release_year")',
            ratingAdvisories: 'android=new UiSelector().resourceId("com.philo.philo:id/rating_advisories")',
            channelName: 'android=new UiSelector().resourceId("com.philo.philo:id/channel_name")'
        };
    }
    /**
     * Waits for the movie details page to be fully loaded
     */
    async waitForLoaded() {
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
                }
                catch (error) {
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
                    }
                    catch (error) {
                        console.log('Error checking TextView:', error.message);
                    }
                }
            }
            if (!foundElement) {
                // Take a screenshot for debugging
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const screenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'errors', `movie-details-${timestamp}.png`);
                await this.driver.saveScreenshot(screenshotPath);
                console.log(`Screenshot saved to: ${screenshotPath}`);
                throw new Error('Could not find movie title element with any selector');
            }
            // Wait a bit more for any animations
            await this.driver.pause(2000);
        }
        catch (error) {
            console.error('Error waiting for movie details page:', error);
            throw error;
        }
    }
    /**
     * Gets the movie title text
     * @returns Promise<string> The movie title
     */
    async getMovieTitle() {
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
        }
        catch (error) {
            console.error('Error getting movie title:', error);
            throw error;
        }
    }
    /**
     * Gets the movie description text
     * @returns Promise<string> The movie description
     */
    async getMovieDescription() {
        try {
            console.log('Attempting to get movie description...');
            // Try each selector in the array
            for (const selector of this.selectors.movieDescription) {
                try {
                    console.log(`Trying description selector: ${selector}`);
                    const element = await this.driver.$(selector);
                    const exists = await element.isDisplayed();
                    if (exists) {
                        const text = await element.getText();
                        if (text && text.length > 0) {
                            console.log(`Found description with selector ${selector}: "${text}"`);
                            return text;
                        }
                    }
                }
                catch (error) {
                    console.log(`Selector ${selector} not found or not accessible`);
                }
            }
            // If no specific selector worked, try finding any TextView with substantial text
            console.log('Trying to find description in any TextView...');
            const textViews = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            for (const element of textViews) {
                try {
                    const isDisplayed = await element.isDisplayed();
                    if (isDisplayed) {
                        const text = await element.getText();
                        if (text && text.length > 50) { // Description is usually longer than 50 characters
                            console.log(`Found potential description in TextView: "${text}"`);
                            return text;
                        }
                    }
                }
                catch (error) {
                    console.log('Error checking TextView:', error);
                }
            }
            throw new Error('Could not find movie description with any selector');
        }
        catch (error) {
            console.error('Error getting movie description:', error);
            throw error;
        }
    }
    /**
     * Gets the movie rating (e.g., "R", "PG-13")
     * @returns Promise<string> The movie rating
     */
    async getMovieRating() {
        try {
            console.log('Attempting to get movie rating...');
            // Try each selector in the array
            for (const selector of this.selectors.movieRating) {
                try {
                    console.log(`Trying rating selector: ${selector}`);
                    const element = await this.driver.$(selector);
                    const exists = await element.isDisplayed();
                    if (exists) {
                        const text = await element.getText();
                        if (text && text.length > 0) {
                            console.log(`Found rating with selector ${selector}: "${text}"`);
                            return text;
                        }
                    }
                }
                catch (error) {
                    console.log(`Selector ${selector} not found or not accessible`);
                }
            }
            throw new Error('Could not find movie rating with any selector');
        }
        catch (error) {
            console.error('Error getting movie rating:', error);
            throw error;
        }
    }
    /**
     * Gets the movie release date
     * @returns Promise<string> The release date
     */
    async getReleaseDate() {
        try {
            console.log('Attempting to get release date...');
            // Try each selector in the array
            for (const selector of this.selectors.movieReleaseYear) {
                try {
                    console.log(`Trying release date selector: ${selector}`);
                    const element = await this.driver.$(selector);
                    const exists = await element.isDisplayed();
                    if (exists) {
                        const text = await element.getText();
                        if (text && text.length > 0) {
                            console.log(`Found release date with selector ${selector}: "${text}"`);
                            return text;
                        }
                    }
                }
                catch (error) {
                    console.log(`Selector ${selector} not found or not accessible`);
                }
            }
            throw new Error('Could not find release date with any selector');
        }
        catch (error) {
            console.error('Error getting release date:', error);
            throw error;
        }
    }
    /**
     * Gets the rating advisories (content warnings)
     * @returns Promise<string> The rating advisories
     */
    async getRatingAdvisories() {
        try {
            console.log('Attempting to get rating advisories...');
            // Try each selector in the array
            for (const selector of this.selectors.movieRatingAdvisories) {
                try {
                    console.log(`Trying rating advisories selector: ${selector}`);
                    const element = await this.driver.$(selector);
                    const exists = await element.isDisplayed();
                    if (exists) {
                        const text = await element.getText();
                        if (text && text.length > 0) {
                            console.log(`Found rating advisories with selector ${selector}: "${text}"`);
                            return text;
                        }
                    }
                }
                catch (error) {
                    console.log(`Selector ${selector} not found or not accessible`);
                }
            }
            throw new Error('Could not find rating advisories with any selector');
        }
        catch (error) {
            console.error('Error getting rating advisories:', error);
            throw error;
        }
    }
    /**
     * Gets the channel name
     * @returns Promise<string> The channel name
     */
    async getChannelName() {
        console.log('Attempting to get channel name...');
        try {
            // Get all TextViews
            console.log('Finding all TextViews...');
            const textViews = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            console.log(`Found ${textViews.length} TextViews`);
            // Get text from each TextView
            for (const textView of textViews) {
                try {
                    const text = await textView.getText();
                    console.log('TextView text:', text);
                    // Look for text that might be a channel name (e.g., "Lifetime", "AMC", etc.)
                    if (text && text.length > 0 && text.length < 30) { // Channel names are usually short
                        console.log('Potential channel name found:', text);
                        return text;
                    }
                }
                catch (error) {
                    console.log('Error getting text from TextView:', error);
                }
            }
            throw new Error('Could not find channel name with any selector');
        }
        catch (error) {
            console.error('Error getting channel name:', error);
            throw error;
        }
    }
    /**
     * Clicks the play button to start the movie
     */
    async clickPlay() {
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
                }
                catch (error) {
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
            }
            catch (error) {
                console.log('No resume button found');
            }
            // If we get here, no playable button was found
            throw new Error('Could not find any playable button');
        }
        catch (error) {
            console.error('Error clicking play:', error);
            throw error;
        }
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
        }
        catch (error) {
            console.error('Error checking if details page is displayed:', error);
            return false;
        }
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
    async findPlayableMovie(maxAttempts = 5) {
        console.log('Looking for a movie with Play or Resume button...');
        return await this.findPlayableTitle(maxAttempts);
    }
    async isResumeButtonVisible() {
        return await this.isElementDisplayed(this.selectors.resumeButton);
    }
    async clickResume() {
        await this.click(this.selectors.resumeButton);
    }
}
exports.MoviesDetailsPage = MoviesDetailsPage;
