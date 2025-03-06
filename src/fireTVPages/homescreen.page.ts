import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { ADB_CONFIG } from '../config/config'; // Import the configuration

type SelectorKeys = 
    | 'forYellowstoneFans'
    | 'crimeAndDrama'
    | 'reality'
    | 'homeAndLifestyle'
    | 'documentary'
    | 'comedy'
    | 'family'   

export class HomeScreenPage extends BasePage {
    

    getSettingsButtonElement() {
        return `//android.widget.Button[@resource-id='com.philo.philo:id/settings_button']`;
    }

    // Content Actions
    verifyGuidePage() {
        throw new Error('Method not implemented.');
    }
    public selectors = {
        // Profile Selection Screen
        profilesTitle: 'android=resourceId("com.philo.philo:id/profiles_title")',
        profilesRecyclerView: 'android=resourceId("com.philo.philo:id/recycler_view")',
        profileAvatar: 'android=resourceId("com.philo.philo:id/avatar")',
        profileLabel: 'android=resourceId("com.philo.philo:id/label")',
        addNewProfile: 'android=text("Add new profile")',
        holdToEditText: 'android=resourceId("com.philo.philo:id/tv_hold_to_edit")',
        philoLogo: 'android=resourceId("com.philo.philo:id/logo")',

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
        savedCategory: 'android=text("Saved")',
        featuredOnAMCPlus: 'android=text("Featured on AMC+")',
        featuredOnPhilo: 'android=text("Featured on Philo")',
        newEpisodesThisWeek: 'android=text("New Episodes This Week")',
        topMoviesOnPhilo: 'android=text("Top Movies on Philo")',
        bingeableSeries: 'android=text("Bingeable Series")',
        browseByGenre: 'android=text("Browse by Genre")',
        newlyAddedMovies: 'android=text("Newly Added Movies")',
        sitcoms: 'android=text("Sitcoms")',
        classics: 'android=text("Classics")',
        criticallyAcclaimedMovies: 'android=text("Critically Acclaimed Movies")',
        watchTheWholeSeriesDrama: 'android=text("Watch the Whole Series:Drama")',
        theTylerPerryUniverse: 'android=text("The Tyler Perry Universe")',
        docuDramas: 'android=text("Docu-Dramas")',
        newAndUpcoming: 'android=text("New and Upcoming")',

        
        // Movie Tiles
        firstMovieTile: 'android=new UiSelector().resourceId("com.philo.philo:id/list_view_broadcasts").childSelector(new UiSelector().className("android.view.ViewGroup").instance(0))',
        movieTileTitle: 'android=resourceId("com.philo.philo:id/title")',
        
        // Series Tiles
        topFreeShowsRow: 'android=resourceId("com.philo.philo:id/group_header_text")',
        topFreeShowsText: 'android=text("Top Free Shows")',
        firstSeriesTile: 'android=new UiSelector().resourceId("com.philo.philo:id/widget_tile_wrapper").instance(6)',
        seriesTileTitle: 'android=resourceId("com.philo.philo:id/title")',
        
        // Featured Content
        featuredShow: 'android=resourceId("com.philo.philo:id/featured_show")',
        featuredMovie: 'android=resourceId("com.philo.philo:id/featured_movie")',

        // Featured on Philo Channels
        betChannel: 'android=text("BET")',
        lifetimeChannel: 'android=text("Lifetime")',
        mtvChannel: 'android=text("MTV")',
        aAndEChannel: 'android=text("A&E")',
        amcPlusChannel: 'android=text("AMC+")',
        discoveryChannel: 'android=text("Discovery")',
        historyChannel: 'android=text("History")',
        foodNetworkChannel: 'android=text("Food Network")',
        hallmarkChannel: 'android=text("Hallmark Channel")',
        hgtvChannel: 'android=text("HGTV")',

        //Browse by Genre
        forYellowstoneFans: 'android=text("For Yellowstone Fans")',
        crimeAndDrama: 'android=text("Crime & Drama")',
        reality: 'android=text("Reality")',
        homeAndLifestyle: 'android=text("Home & Lifestyle")',
        documentary: 'android=text("Documentary")',
        comedy: 'android=text("Comedy")',
        family: 'android=text("Family")',
    };

    constructor(driver: Browser) {
        super(driver);
    }

    /**
     * Simulates pressing a key using ADB keycode
     * @param keycode The keycode to send
     */
    private async sendKeyEvent(keycode: number): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(`adb -s ${ADB_CONFIG.ip} shell input keyevent ${keycode}`, (error, stdout, stderr) => {
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
        let foundAnyElement = false;

        // Add Press Up Button
        await this.pressUpButton();
        
        // Try to verify top menu elements
        try {
            if (await this.isElementDisplayed(this.selectors.menuText)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavHome)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavGuide)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavSaved)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavSearch)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavSettings)) foundAnyElement = true;
        } catch (error) {
            console.log('Some top menu elements not found');
        }

        // Try to verify main content elements
        try {
            if (await this.isElementDisplayed(this.selectors.homeHeader)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.userProfileIcon)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.liveTVButton)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.onDemandButton)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.dvrButton)) foundAnyElement = true;
        } catch (error) {
            console.log('Some main content elements not found');
        }

        // Press Down Button to display content
        await this.pressDownButton();

        // Try to verify content categories
        try {
            if (await this.isElementDisplayed(this.selectors.topFreeMovies)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topFreeShows)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.recommended)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.trendingLive)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.realityRoundup)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.trueCrime)) foundAnyElement = true;
        } catch (error) {
            console.log('Some content category elements not found');
        }

        if (!foundAnyElement) {
            throw new Error('No home screen elements were found');
        }
    }

    async verifyTopMenuElements(): Promise<void> {
        let foundAnyElement = false;

        try {
            if (await this.isElementDisplayed(this.selectors.topNavHome)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavGuide)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavSaved)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavSearch)) foundAnyElement = true;
            if (await this.isElementDisplayed(this.selectors.topNavSettings)) foundAnyElement = true;
        } catch (error) {
            console.log('Some top menu elements not found');
        }

        if (!foundAnyElement) {
            throw new Error('No top menu elements were found');
        }
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
        try {
            // One down press to focus
            await this.pressDownButton();
            await this.driver.pause(2000);
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyTopFreeMoviesHeaderDisplayed();
        } catch (error) {
            console.error('Error navigating to Top Free Movies:', error);
            throw error;
        } // Add a pause to let the details page load
    }

    async verifyTopFreeMoviesHeaderDisplayed(): Promise<void> {
        await this.waitForElement(this.selectors.topFreeMovies);
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
        try {
            await this.verifyHomeScreenElements();
            
            // Find the Saved category
            const found = await this.findCategory('Saved');
            if (!found) {
                throw new Error('Saved category not found');
            }

            // Press down once more to get to the actual row content
            await this.pressDownButton();
            await this.driver.pause(2000);

            // Now that we're at Saved content, press left and enter
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.driver.pause(3000);

            // Take and compare screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `saved_current_${timestamp}.png`;
            
            const screenshotPath = await topPage.takeScreenshot(path.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path.join(process.cwd(), 'screenshots', 'reference', 'saved_reference.png');

            try {
                await fs.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(process.cwd(), 'screenshots', 'difference', `saved_difference_${timestamp}.png`)
                );
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                console.log('First run - creating saved reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }
        } catch (error) {
            console.error('Error verifying Saved category:', error);
            throw error;
        }
    }

    /**
     * Find a specific category by navigating through the content
     * @param targetCategory The category to find
     * @param maxPresses Maximum number of times to press down/up
     * @returns Promise<boolean> Whether the category was found
     */
    async findCategory(targetCategory: string, maxPresses = 15): Promise<boolean> {
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
            'Anime',
            'Featured on AMC+',
            'Featured on Philo',
            'New Episodes This Week',
            'Top Movies on Philo',
            'Bingeable Series',
            'Browse by Genre',
            'Newly Added Movies',
            'Sitcoms',
            'Classics',
            'Critically Acclaimed Movies',
            'Watch the Whole Series:Drama',
            'The Tyler Perry Universe',
            'Docu-Dramas',
            'New and Upcoming'
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
     * Navigate to and verify the Top page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifyTopPage(topPage: any): Promise<void> {
        try {
            
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

    /**
     * Gets the title of the second movie in the grid
     * @returns Promise<string> The title of the second movie
     */
    async getSecondMovieTitle(): Promise<string> {
        const selector = 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).focusable(true).instance(1)';
        const element = await this.driver.$(selector);
        const title = await element.getAttribute('content-desc');
        return title;
    }

    /**
     * Clicks the currently focused movie tile
     */
    async clickMovieTile(): Promise<void> {
        await this.pressEnterButton();
    }

    // Method to click on a featured show
    async clickOnFeaturedShow(show: SelectorKeys): Promise<void> {
        const showSelector = this.selectors[show];
        if (showSelector) {
            const element = await this.driver.$(showSelector);
            await element.click();
        } else {
            throw new Error(`Show ${show} not found in Featured on Philo elements.`);
        }
    }

    // Method to click on a tab
    async clickOnTab(tab: SelectorKeys): Promise<void> {
        const tabSelector = this.selectors[tab];
        if (tabSelector) {
            const element = await this.driver.$(tabSelector);
            await element.click();
        } else {
            throw new Error(`Tab ${tab} not found in tab bar elements.`);
        }
    }

} 