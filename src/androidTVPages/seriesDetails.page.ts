import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
const KEYCODE_BACK = 4;
const KEYCODE_DPAD_RIGHT = 22;
const KEYCODE_ENTER = 66;

export class SeriesDetailsPage extends BasePage {
    public selectors = {
        // Series Information
        seriesTitle: 'android=new UiSelector().className("android.widget.TextView").textMatches(".*")',
        seriesYear: 'android=new UiSelector().className("android.widget.TextView").textMatches("\\d{4}")',
        seriesSeasons: 'android=new UiSelector().className("android.widget.TextView").textMatches("\\d+ Seasons?")',
        seriesRating: 'android=new UiSelector().className("android.widget.TextView").textMatches("TV-.*")',
        seriesDescription: 'android=new UiSelector().className("android.widget.TextView").textMatches(".*").index(5)',
        seriesPoster: 'android=new UiSelector().className("android.widget.ImageView").descriptionMatches(".*")',

        // Channel Information
        channelLogo: 'android=resourceId("com.philo.philo.google:id/big_tile_channel_logo").className("android.widget.ImageView")',
        channelButton: 'android=resourceId("com.philo.philo.google:id/button_channel").className("android.view.ViewGroup")',
        channelName: 'android=resourceId("com.philo.philo.google:id/label_channel").className("android.widget.TextView")',

        // Action Buttons
        playButton: 'android=new UiSelector().className("android.view.View").description("Play")',
        resumeButton: 'android=new UiSelector().className("android.widget.TextView").text("Resume")',
        saveButton: 'android=new UiSelector().className("android.view.View").descriptionContains("Save")',
        upgradeButton: 'android=new UiSelector().className("android.widget.TextView").text("Upgrade")',

        // Navigation Tabs
        episodesTab: 'android=className("android.widget.TextView").text("Episodes")',
        scheduleTab: 'android=className("android.widget.TextView").text("Schedule")',
        relatedTab: 'android=className("android.widget.TextView").text("Related")',
        extrasTab: 'android=className("android.widget.TextView").text("Extras")',
        detailsTab: 'android=className("android.widget.TextView").text("Details")',

        // Background Elements
        backgroundImage: 'android=resourceId("com.philo.philo.google:id/big_tile_background_image_view").className("android.widget.ImageView")',
        backgroundVideo: 'android=resourceId("com.philo.philo.google:id/big_tile_background_video_view").className("android.widget.FrameLayout")',
        backgroundGradient: 'android=resourceId("com.philo.philo.google:id/big_tile_gradient_layer_view").className("android.view.View")',

        // Container Elements
        detailsContainer: 'android=resourceId("com.philo.philo.google:id/big_tile_item_details_container").className("android.view.ViewGroup")',
        otherInfoContainer: 'android=resourceId("com.philo.philo.google:id/other_information_container").className("android.view.ViewGroup")',
        buttonsContainer: 'android=resourceId("com.philo.philo.google:id/big_tile_buttons_container").className("android.view.ViewGroup")',

        // Navigation
        dismissButton: 'android=resourceId("com.philo.philo.google:id/big_tile_dismiss_text")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Gets the series title
     * @returns Promise<string> The series title
     */
    async getSeriesTitle(): Promise<string> {
        const element = await this.waitForElement(this.selectors.seriesTitle);
        return element.getText();
    }

    async findPlayableSeries(maxAttempts: number = 5): Promise<boolean> {
        console.log('Looking for a series with Play or Resume button...');
        return await this.findPlayableTitle(maxAttempts);
    }

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

    /**
     * Checks if the Extras tab is present
     * @returns Promise<boolean> True if the Extras tab is present
     */
    async isExtrasTabPresent(): Promise<boolean> {
        try {
            return await this.isElementDisplayed(this.selectors.extrasTab);
        } catch (error) {
            return false;
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
    public async checkAndNavigateForPlayback(maxAttempts: number = 5): Promise<void> {
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
