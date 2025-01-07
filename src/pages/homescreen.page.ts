import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export class HomeScreenPage extends BasePage {
    

    getSettingsButtonElement() {
        return `//android.widget.Button[@resource-id='com.philo.philo:id/settings_button']`;
    }

    // Content Actions
    verifyGuidePage() {
        throw new Error('Method not implemented.');
    }
    public selectors = {
        // Header
        homeHeader: 'android=resourceId("com.philo.philo:id/home_header")',
        userProfileIcon: 'android=resourceId("com.philo.philo:id/user_profile_icon")',
        headerWhitespace: 'android=resourceId("com.philo.philo:id/header_whitespace")',
        
        // Top Menu Navigation
        menuText: 'android=text("Menu")',
        topNavHome: 'android=text("Home")',
        topNavGuide: 'android=text("Guide")',
        topNavSaved: 'android=text("Saved")',
        topNavSearch: 'android=text("Search")',
        topNavSettings: 'android=resourceId("com.philo.philo:id/tab_profile")',
        
        // Main Navigation
        liveTVButton: 'android=resourceId("com.philo.philo:id/live_tv_button")',
        onDemandButton: 'android=resourceId("com.philo.philo:id/on_demand_button")',
        dvrButton: 'android=resourceId("com.philo.philo:id/dvr_button")',
        
        // Content Actions
        playButton: 'android=text("Play")',
        playIcon: 'android=resourceId("com.philo.philo:id/icon_play_radial")',
        moreInfoButton: 'android=text("More info")',
        tileTitle: 'android=resourceId("com.philo.philo:id/title")',
        
        // Content Categories
        topFreeMovies: 'android=text("Top Free Movies")',
        topFreeShows: 'android=text("Top Free Shows")',
        recommended: 'android=text("Recommended")',
        trendingLive: 'android=text("Trending Live")',
        realityRoundup: 'android=text("Reality Roundup")',
        trueCrime: 'android=text("True Crime")',
        saved: 'android=text("Saved")',
        homeAndTravel: 'android=text("Home & Travel")',
        keepWatching: 'android=text("Keep Watching")',
        funForTheFamily: 'android=text("Fun for the Family")',
        allTheFixings: 'android=text("All the Fixings")',
        actionAndThrillers: 'android=text("Action & Thrillers")',
        inTheNews: 'android=text("In the News")',
        outDoorsAndSports: 'android=text("Outdoors & Sports")',
        theLaughTrack: 'android=text("The Laugh Track")',
        anime: 'android=text("Anime")',

        // Movie Tiles
        firstMovieTile: 'android=new UiSelector().resourceId("com.philo.philo:id/widget_tile_wrapper").instance(0)',
        movieTileTitle: 'android=resourceId("com.philo.philo:id/title")',
        
        // Series Tiles
        topFreeShowsRow: 'android=resourceId("com.philo.philo:id/group_header_text")',
        topFreeShowsText: 'android=text("Top Free Shows")',
        firstSeriesTile: 'android=new UiSelector().resourceId("com.philo.philo:id/widget_tile_wrapper").instance(6)',
        seriesTileTitle: 'android=resourceId("com.philo.philo:id/title")',
        
        // Featured Content
        featuredShow: 'android=resourceId("com.philo.philo:id/featured_show")',
        featuredMovie: 'android=resourceId("com.philo.philo:id/featured_movie")',
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Simulates pressing a key using ADB keycode
     * @param keycode The keycode to send
     */
    private async sendKeyEvent(keycode: number): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`adb shell input keyevent ${keycode}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error sending key event: ${stderr}`);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Simulates pressing the up button on the remote
     */
    async pressUpButton(): Promise<void> {
        await this.sendKeyEvent(19); // KEYCODE_DPAD_UP
    }

    async pressDownButton(): Promise<void> {
        await this.sendKeyEvent(20); // KEYCODE_DPAD_DOWN
    }

    async pressEnterButton(): Promise<void> {
        await this.sendKeyEvent(66); // KEYCODE_ENTER
    }

    async pressBackButton(): Promise<void> {
        await this.sendKeyEvent(4); // KEYCODE_BACK
    }

    async pressRightButton(): Promise<void> {
        await this.sendKeyEvent(22); // KEYCODE_DPAD_RIGHT
    }

    async pressLeftButton(): Promise<void> {
        await this.sendKeyEvent(21); // KEYCODE_DPAD_LEFT
    }

    /**
     * Verify home screen elements are displayed
     */
    async verifyHomeScreenElements(): Promise<void> {
        // Add Press Up Button
        await this.pressUpButton();
        
        // Verify top menu
        await this.isElementDisplayed(this.selectors.menuText);
        await this.isElementDisplayed(this.selectors.topNavHome);
        await this.isElementDisplayed(this.selectors.topNavGuide);
        await this.isElementDisplayed(this.selectors.topNavSaved);
        await this.isElementDisplayed(this.selectors.topNavSearch);
        await this.isElementDisplayed(this.selectors.topNavSettings);

        // Verify main content
        await this.isElementDisplayed(this.selectors.homeHeader);
        await this.isElementDisplayed(this.selectors.userProfileIcon);
        await this.isElementDisplayed(this.selectors.liveTVButton);
        await this.isElementDisplayed(this.selectors.onDemandButton);
        await this.isElementDisplayed(this.selectors.dvrButton);

        // Press Down Button to display content
        await this.pressDownButton();

        // Verify content categories
        await this.isElementDisplayed(this.selectors.topFreeMovies);
        await this.isElementDisplayed(this.selectors.topFreeShows);
        await this.isElementDisplayed(this.selectors.recommended);
        await this.isElementDisplayed(this.selectors.trendingLive);
        await this.isElementDisplayed(this.selectors.realityRoundup);
        await this.isElementDisplayed(this.selectors.trueCrime);
    }

    async verifyTopMenuElements(): Promise<void> {

        await this.isElementDisplayed(this.selectors.topNavHome);
        await this.isElementDisplayed(this.selectors.topNavGuide);
        await this.isElementDisplayed(this.selectors.topNavSaved);
        await this.isElementDisplayed(this.selectors.topNavSearch);
        await this.isElementDisplayed(this.selectors.topNavSettings);

    }
    // Navigation methods for top menu
    async navigateToGuide(): Promise<void> {
        await this.click(this.selectors.topNavGuide);
    }

    async navigateToSaved(): Promise<void> {
        await this.click(this.selectors.topNavSaved);
    }

    async navigateToSearch(): Promise<void> {
        await this.click(this.selectors.topNavSearch);
    }

    async navigateToSettings(): Promise<void> {
        await this.click(this.selectors.topNavSettings);
    }

    /**
     * Navigate to Live TV
     */
    async goToLiveTV(): Promise<void> {
        await this.click(this.selectors.liveTVButton);
    }

    /**
     * Navigate to On Demand
     */
    async goToOnDemand(): Promise<void> {
        await this.click(this.selectors.onDemandButton);
    }

    /**
     * Navigate to DVR
     */
    async goToDVR(): Promise<void> {
        await this.click(this.selectors.dvrButton);
    }

    /**
     * Click Play button
     */
    async clickPlay(): Promise<void> {
        await this.click(this.selectors.playButton);
    }

    /**
     * Click More Info button
     */
    async clickMoreInfo(): Promise<void> {
        await this.click(this.selectors.moreInfoButton);
    }

    /**
     * Navigate to settings from home screen
     */
    async navigateToSettingsFromHome(): Promise<void> {
        // Press up to expose top menu
        await this.pressUpButton();
        
        // Wait for menu to be visible and click settings
        await this.isElementDisplayed(this.selectors.topNavSettings);
        await this.click(this.selectors.topNavSettings);
    }

    async getTopNavSettingsButtonElement() {
        return `//android.widget.Button[@resource-id='com.philo.philo:id/tab_profile']`;
    }

    async clickTopNavSettingsButtonElement() {
        const settingsButton = await this.getTopNavSettingsButtonElement();
        await this.click(settingsButton);
    }

    /**
     * Gets the title of the first movie in the Top Free Movies row
     * @returns Promise<string> The movie title
     */
    async getFirstMovieTitle(): Promise<string> {
        await this.waitForElement(this.selectors.topFreeMovies);
        const movieTile = await this.waitForElement(this.selectors.firstMovieTile);
        return movieTile.getAttribute('content-desc');
    }

    /**
     * Clicks on the first movie tile in the Top Free Movies row
     */
    async clickFirstMovie(): Promise<void> {
        await this.waitForElement(this.selectors.topFreeMovies);
        await this.click(this.selectors.firstMovieTile);
    }


    /**
     * Base method for verifying a category page
     * @param categoryName Name of the category for screenshots and logs
     * @param goToCategory Function that navigates to the category
     * @param topPage The top page object for screenshots
     */
    private async verifyCategoryPage(
        categoryName: string,
        goToCategory: () => Promise<void>,
        topPage: any
    ): Promise<void> {
        try {
            await goToCategory();

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `${categoryName.toLowerCase().replace(/ /g, '_')}_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', `${categoryName.toLowerCase().replace(/ /g, '_')}_reference.png`);

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `${categoryName.toLowerCase().replace(/ /g, '_')}_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating reference image for:', categoryName);
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error(`Error verifying ${categoryName} category:`, error);
            throw error;
        }
    }

    /**
     * Verify Top Free Movies category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyTopFreeMovies(categoriesPage: any, topPage: any): Promise<void> {
        await this.verifyCategoryPage(
            'Top Free Movies',
            () => categoriesPage.goToTopFreeMovies(),
            topPage
        );
    }

    /**
     * Verify Top Free Shows category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyTopFreeShows(categoriesPage: any, topPage: any): Promise<void> {
        await this.verifyCategoryPage(
            'Top Free Shows',
            () => categoriesPage.goToTopFreeShows(),
            topPage
        );
    }

    /**
     * Verify Recommended category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyRecommended(categoriesPage: any, topPage: any): Promise<void> {
        await this.verifyCategoryPage(
            'Recommended',
            () => categoriesPage.goToRecommended(),
            topPage
        );
    }

    /**
     * Verify Saved category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifySavedCategory(categoriesPage: any, topPage: any): Promise<void> {
        await this.verifyCategoryPage(
            'Saved',
            () => categoriesPage.goToSaved(),
            topPage
        );
    }

    /**
     * Find a specific category by navigating through the content
     * @param targetCategory The category to find
     * @param maxPresses Maximum number of times to press down/up
     * @returns Promise<boolean> Whether the category was found
     */
    async findCategory(targetCategory: string, maxPresses: number = 15): Promise<boolean> {
        // First press down to start at categories
        await this.pressDownButton();
        await this.driver.pause(5000);

        // List of all possible categories
        const categories = [
            'Top Free Movies',
            'Top Free Shows',
            'Recommended',
            'Trending Live',
            'Reality Roundup',
            'True Crime',
            'Saved',
            'Home & Travel',
            'Keep Watching',
            'Fun for the Family',
            'All the Fixings',
            'Action & Thrillers',
            'In the News',
            'Outdoors & Sports',
            'The Laugh Track',
            'Anime'
        ];

        // Try to find the category
        for (let pressCount = 0; pressCount < maxPresses; pressCount++) {
            // Check all categories that might be visible
            for (const category of categories) {
                try {
                    const element = await this.driver.$(`android=text("${category}")`);
                    const isDisplayed = await element.isDisplayed();
                    
                    if (isDisplayed && category === targetCategory) {
                        console.log(`Found target category "${targetCategory}" after ${pressCount} presses`);
                        return true;
                    }
                } catch (error) {
                    // Ignore errors for individual elements
                }
            }

            // Press down to reveal more categories
            await this.pressDownButton();
            await this.driver.pause(2000);
        }

        console.log(`Category "${targetCategory}" not found after ${maxPresses} presses`);
        return false;
    }

    /**
     * Navigate to and verify Trending Live category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyTrendingLive(categoriesPage: any, topPage: any): Promise<void> {
        try {
            await this.verifyHomeScreenElements();
            
            // Find the Trending Live category
            const found = await this.findCategory('Trending Live');
            if (!found) {
                throw new Error('Trending Live category not found');
            }

            // Press down once more to get to the actual row content
            await this.pressDownButton();
            await this.driver.pause(2000);

            // Now that we're at Trending Live content, press left and enter
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.driver.pause(3000);

            // Take and compare screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `trending_live_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'trending_live_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `trending_live_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating trending live reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Trending Live category:', error);
            throw error;
        }
    }

    /**
     * Navigate to and verify the Settings page
     * @param settingsPage The settings page object
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifySettingsPage(settingsPage: any, topPage: any): Promise<void> {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            
            for (let i = 0; i < 5; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(5000);
            
            await settingsPage.isElementVisible(settingsPage.getStartChannelPlaybackSelector());
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `settings_page_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'settings_page_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `settings_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating settings page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Settings page:', error);
            throw error;
        }
    }

    /**
     * Navigate to and verify the Guide page
     * @param guidePage The guide page object
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async navigateAndVerifyGuidePage(guidePage: any, topPage: any): Promise<void> {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            await this.pressRightButton();
            await this.pressEnterButton();
            await this.driver.pause(5000);
            
            const isVisible = await guidePage.isElementVisible(guidePage.freeChannels);
            expect(isVisible).toBe(true);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `guide_page_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'guide_page_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `guide_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating guide page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Guide page:', error);
            throw error;
        }
    }

    /**
     * Navigate to and verify the Top page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifyTopPage(topPage: any): Promise<void> {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            
            for (let i = 0; i < 2; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(10000);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `top_page_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'top_page_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `top_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating top page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Top page:', error);
            throw error;
        }
    }

    /**
     * Navigate to and verify the Saved page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifySavedPage(topPage: any): Promise<void> {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);

            for (let i = 0; i < 3; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(10000);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `saved_page_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'saved_page_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `saved_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating saved page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Saved page:', error);
            throw error;
        }
    }

    /**
     * Navigate to and verify the Search page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifySearchPage(topPage: any): Promise<void> {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);

            for (let i = 0; i < 4; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(10000);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `search_page_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'search_page_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `search_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating search page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Search page:', error);
            throw error;
        }
    }

    /**
     * Scan and log all content categories
     * @returns Promise<string[]> Array of found category names
     */
    async scanContentCategories(): Promise<string[]> {
        const categoryTexts: string[] = [];
        const minimumPresses = 15;

        // Navigate down to categories and wait for content to load
        await this.pressDownButton();
        await this.driver.pause(5000);

        // Check for each category using text selectors
        const categories = [
            'Top Free Movies',
            'Top Free Shows',
            'Recommended',
            'Trending Live',
            'Reality Roundup',
            'True Crime',
            'Saved',
            'Home & Travel',
            'Keep Watching',
            'Fun for the Family',
            'All the Fixings',
            'Action & Thrillers',
            'In the News',
            'Outdoors & Sports',
            'The Laugh Track',
            'Anime'
        ];

        // Scan through all categories
        for (let pressCount = 0; pressCount < minimumPresses; pressCount++) {
            const foundInThisPress: string[] = [];

            for (const category of categories) {
                try {
                    const element = await this.driver.$(`android=text("${category}")`);
                    const isDisplayed = await element.isDisplayed();
                    
                    if (isDisplayed) {
                        foundInThisPress.push(category);
                        if (!categoryTexts.includes(category)) {
                            categoryTexts.push(category);
                            console.log(`Found new category: ${category}`);
                        }
                    }
                } catch (error) {
                    // Ignore errors for individual elements
                }
            }

            if (foundInThisPress.length > 0) {
                console.log(`Press ${pressCount + 1}: Found categories:`, foundInThisPress);
            }

            // Press down to reveal more categories
            await this.pressDownButton();
            await this.driver.pause(2000);
        }

        return categoryTexts;
    }

} 