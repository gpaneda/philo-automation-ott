import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import path from 'path';
import { PlayerPage } from './player.page';
const KEYCODE_BACK = 4;
const KEYCODE_DPAD_RIGHT = 22;
const KEYCODE_ENTER = 66;



export class MoviesDetailsPage extends BasePage {
    public selectors = {
        // Navigation buttons and common text elements
        playButton: 'android=new UiSelector().text("Play")',
        playButtonByDesc: 'android=new UiSelector().description("Play")',
        playButtonByText: 'android=new UiSelector().text("Play")',
        saveButton: 'android=new UiSelector().text("Save")',
        relatedButton: 'android=new UiSelector().text("Related")',
        watchOptionsButton: 'android=new UiSelector().text("Watch Options")',
        detailsButton: 'android=new UiSelector().text("Details")',
        resumeButton: 'android=new UiSelector().text("Resume")',
        dismissButton: 'android=new UiSelector().text("Back")',
        channelButton: 'android=new UiSelector().text("View Channel")',
        upgradeButton: 'android=new UiSelector().className("android.widget.TextView").text("Upgrade")',

        // Content elements using generic patterns
        movieTitle: 'android=new UiSelector().className("android.widget.TextView").index(1)',
        movieDescription: 'android=new UiSelector().className("android.widget.TextView").textMatches(".{20,}")',
        movieDuration: 'android=new UiSelector().className("android.widget.TextView").textMatches("^(\\d+\\s*h\\s*)?(\\d+\\s*m)?$")',
        movieReleaseYear: 'android=new UiSelector().className("android.widget.TextView").textMatches("^\\d{4}$")',
        movieRating: 'android=new UiSelector().className("android.widget.TextView").textMatches("^(G|PG|PG-13|R|TV-Y|TV-Y7|TV-G|TV-PG|TV-14|TV-MA|NR)$")',
        ratingAdvisories: 'android=new UiSelector().className("android.widget.TextView").textMatches(".*(violence|language|gore|nudity|adult|sex|drug|substance|mild|moderate|strong).*")',
        channelName: 'android=new UiSelector().className("android.widget.TextView").textMatches(".*(Channel|Network|TV|Plus).*")',

        // Subtitles
        subtitlesContainer: 'android=resourceId("com.philo.philo.google:id/subtitles_container")',

        // Video Elements
        videoFrame: 'android=resourceId("com.philo.philo.google:id/video_frame")',
        videoSurface: 'android=resourceId("com.philo.philo.google:id/video_surface")',
        playbackRoot: 'android=resourceId("com.philo.philo.google:id/playback_root")',

        // Player UI Elements
        playerActivityRoot: 'android=resourceId("com.philo.philo.google:id/player_activity_root")',
        playerControlsRoot: 'android=resourceId("com.philo.philo.google:id/playerControls_root")',
        composeViewWrapper: 'android=resourceId("com.philo.philo.google:id/compose_view_wrapper")',

        // Seekbar Elements
        seekbarRoot: 'android=resourceId("com.philo.philo.google:id/seekbar_root")',
        seekbar3: 'android=new UiSelector().resourceId("com.philo.philo.google:id/seekbar_seekbar3").className("com.philo.philo.playerCranston.ui.SeekBar3")',
        seekbarContainer: 'android=resourceId("com.philo.philo.google:id/seekbar")',

        // Content Info Elements
        showTitle: 'android=resourceId("com.philo.philo.google:id/show_title").className("android.widget.TextView")',
        episodeInfo: 'android=resourceId("com.philo.philo.google:id/subtitle")',

        // Action Buttons
        saveShowButton: 'android=content-desc("Save show")',
        moreInfoButton: 'android=content-desc("More info")',
        optionsButton: 'android=content-desc("Options")',
        startOverButton: 'android=content-desc("Start over")',
        jumpToLiveButton: 'android=content-desc("Jump to live")',

        // Ad Elements
        adOverlayRoot: 'android=resourceId("com.philo.philo.google:id/ad_overlay_root")',
        adText: 'android=resourceId("com.philo.philo.google:id/advertisements")',
        adRemainingTime: 'android=resourceId("com.philo.philo.google:id/remaining_time")',
        adFfwdDisabled: 'android=resourceId("com.philo.philo.google:id/icon_ffwd_disable")',
    };

    constructor(driver: Browser, private playerPage: PlayerPage) {
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
                'android=new UiSelector().resourceId("com.philo.philo.google:id/title")',
                'android=new UiSelector().resourceId("com.philo.philo.google:id/show_title")',
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
                } catch (error) {
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
                } catch (error) {
                    console.log('Error checking TextView:', error);
                }
            }

            throw new Error('Could not find movie description with any selector');
        } catch (error) {
            console.error('Error getting movie description:', error);
            throw error;
        }
    }

    /**
     * Gets the movie rating (e.g., "R", "PG-13")
     * @returns Promise<string> The movie rating
     */
    async getMovieRating(): Promise<string> {
        try {
            console.log('Attempting to get movie rating...');

            const elements = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            for (const element of elements) {
                const text = await element.getText();
                if (["G", "PG", "PG-13", "R", "TV-Y", "TV-Y7", "TV-G", "TV-PG", "TV-14", "TV-MA", "NR"].includes(text.trim())) {
                    console.log(`Found matching rating: "${text}"`);
                    return text;
                }
            }

            throw new Error('Could not find movie rating with any selector');
        } catch (error) {
            console.error('Error getting movie rating:', error);
            throw error;
        }
    }

    /**
     * Gets the movie release date
     * @returns Promise<string> The release date
     */
    async getReleaseDate(): Promise<string> {
        try {
            console.log('Attempting to get release date...');

            const elements = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            for (const element of elements) {
                const text = await element.getText();
                if (/^\d{4}$/.test(text.trim())) {
                    console.log(`Found matching release year: "${text}"`);
                    return text;
                }
            }

            throw new Error('Could not find release date with any selector');
        } catch (error) {
            console.error('Error getting release date:', error);
            throw error;
        }
    }

    /**
     * Gets the rating advisories (content warnings)
     * @returns Promise<string> The rating advisories
     */
    async getRatingAdvisories(): Promise<string> {
        try {
            console.log('Attempting to get rating advisories...');

            // Try each selector in the array
            for (const selector of this.selectors.ratingAdvisories) {
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
                } catch (error) {
                    console.log(`Selector ${selector} not found or not accessible`);
                }
            }

            throw new Error('Could not find rating advisories with any selector');
        } catch (error) {
            console.error('Error getting rating advisories:', error);
            throw error;
        }
    }

    /**
     * Gets the channel name
     * @returns Promise<string> The channel name
     */
    async getChannelName(): Promise<string> {
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
                } catch (error) {
                    console.log('Error getting text from TextView:', error);
                }
            }

            throw new Error('Could not find channel name with any selector');
        } catch (error) {
            console.error('Error getting channel name:', error);
            throw error;
        }
    }
    
    /**
     * Clicks the play button to start the movie
     */
    async clickPlay(): Promise<void> {
        try {
            await this.driver.pause(5000);
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
                        await element.pressKeyCode(66);
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

    async findPlayableMovie(maxAttempts = 5): Promise<boolean> {
        console.log('Looking for a movie with Play or Resume button...');
        return await this.findPlayableTitle(maxAttempts);
    }

    async isResumeButtonVisible(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.resumeButton);
    }

    async clickResume(): Promise<void> {
        await this.click(this.selectors.resumeButton);
    }
    
    /**
     * Fetches the movie duration
     * @returns Promise<string> The movie duration
     */
    async fetchMovieDuration(): Promise<string> {
        try {
            console.log('Attempting to get movie duration...');

            const elements = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            for (const element of elements) {
                const text = await element.getText();
                if (/^\d{1,2}h\s*\d{1,2}m$/.test(text.trim())) {
                    console.log(`Found matching movie duration: "${text}"`);
                    return text;
                }
            }

            throw new Error('Could not find movie duration with any selector');
        } catch (error) {
            console.error('Error getting movie duration:', error);
            throw error;
        }
    }

    /**
    * Checks for the visibility of the play or resume button after navigating back.
    * If neither button is visible, it navigates back, presses the right key,
    * and checks again until one of the buttons is found or a maximum number of attempts is reached.
    * Once a button is found, it proceeds with playback.
    * 
    * @throws { Error } If there are issues during navigation or visibility checks.
    */
    public async checkAndNavigateForPlayback(maxAttempts = 5): Promise<void> {
        try {
            let attempts = 0;
            let isPlaying = false;

            while (!isPlaying && attempts < maxAttempts) {
                // Check for visibility of play, resume, and upgrade buttons
                const playButton = await this.driver.$(this.selectors.playButton);
                const resumeButton = await this.driver.$(this.selectors.resumeButton);
                const upgradeButton = await this.driver.$(this.selectors.upgradeButton); // Assuming you have defined this selector

                const playVisible = await playButton.isDisplayed().catch(() => false);
                const resumeVisible = await resumeButton.isDisplayed().catch(() => false);
                const upgradeVisible = await upgradeButton.isDisplayed().catch(() => false);

                console.log(`Attempt ${attempts + 1}: Play visible: ${playVisible}, Resume visible: ${resumeVisible}, Upgrade visible: ${upgradeVisible}`);

                // If both Play and Upgrade buttons are visible, navigate back
                if (playVisible && upgradeVisible) {
                    console.log('Both Play and Upgrade buttons are visible. Navigating back...');
                    await this.driver.pressKeyCode(KEYCODE_BACK);
                    await this.driver.pause(2000); // Wait for the previous screen to load

                    // Optionally, navigate to another title
                    await this.driver.pressKeyCode(KEYCODE_DPAD_RIGHT);
                    await this.driver.pressKeyCode(KEYCODE_ENTER); // Enter the details page
                    await this.driver.pause(2000); // Wait for the details page to load
                } else if (playVisible && !upgradeVisible) {
                    console.log('Play button is visible and Upgrade button is not. Attempting to play...');
                    await this.pressEnter(); // Click the play button
                    isPlaying = true; // Playback initiated
                } else if (resumeVisible) {
                    console.log('Resume button is visible. Attempting to resume...');
                    await this.pressEnter(); // Click the resume button
                    isPlaying = true; // Playback resumed
                } else {
                    console.log('Neither Play nor Upgrade button is visible. Navigating back...');
                    await this.driver.pressKeyCode(KEYCODE_BACK);
                    await this.driver.pause(2000); // Wait for the previous screen to load

                    // Optionally, navigate to another title
                    await this.driver.pressKeyCode(KEYCODE_DPAD_RIGHT);
                    await this.driver.pressKeyCode(KEYCODE_ENTER); // Enter the details page
                    await this.driver.pause(2000); // Wait for the details page to load
                }

                attempts++; // Increment the attempt counter
            }

            await this.driver.pause(10000);

            if (!isPlaying) {
                console.error('Failed to find play or resume button after maximum attempts.');
                throw new Error('Playback initiation failed after multiple attempts.');
            }
        } catch (error: any) {
            console.error('Error in checkAndNavigateForPlayback:', error);
            throw new Error(`Failed to check and navigate for playback: ${error.message}`);
        }
    }

    public async isElementVisible(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed();
        } catch (error) {
            console.error(`Error checking visibility of element ${selector}:`, error);
            return false;
        }
    }

    async clickElement(selector: string): Promise<void> {
        const element = await this.driver.$(selector);
        await element.click();
    }

    async pressEnter(): Promise<void> {
        await this.driver.pressKeyCode(KEYCODE_ENTER);
    }
} 