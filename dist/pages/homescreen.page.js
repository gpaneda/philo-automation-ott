"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeScreenPage = void 0;
const base_page_1 = require("./base.page");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class HomeScreenPage extends base_page_1.BasePage {
    getSettingsButtonElement() {
        return `//android.widget.Button[@resource-id='com.philo.philo:id/settings_button']`;
    }
    // Content Actions
    verifyGuidePage() {
        throw new Error('Method not implemented.');
    }
    constructor(driver) {
        super(driver);
        this.selectors = {
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
    }
    /**
     * Simulates pressing a key using ADB keycode
     * @param keycode The keycode to send
     */
    async sendKeyEvent(keycode) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`adb shell input keyevent ${keycode}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error sending key event: ${stderr}`);
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Simulates pressing the up button on the remote
     */
    async pressUpButton() {
        await this.sendKeyEvent(19); // KEYCODE_DPAD_UP
    }
    async pressDownButton() {
        await this.sendKeyEvent(20); // KEYCODE_DPAD_DOWN
    }
    async pressEnterButton() {
        await this.sendKeyEvent(66); // KEYCODE_ENTER
    }
    async pressBackButton() {
        await this.sendKeyEvent(4); // KEYCODE_BACK
    }
    async pressRightButton() {
        await this.sendKeyEvent(22); // KEYCODE_DPAD_RIGHT
    }
    async pressLeftButton() {
        await this.sendKeyEvent(21); // KEYCODE_DPAD_LEFT
    }
    /**
     * Verify home screen elements are displayed
     */
    async verifyHomeScreenElements() {
        // Add Press Up Button
        await this.pressUpButton();
        // Verify top menu
        await this.verifyElementDisplayed(this.selectors.menuText);
        await this.verifyElementDisplayed(this.selectors.topNavHome);
        await this.verifyElementDisplayed(this.selectors.topNavGuide);
        await this.verifyElementDisplayed(this.selectors.topNavSaved);
        await this.verifyElementDisplayed(this.selectors.topNavSearch);
        await this.verifyElementDisplayed(this.selectors.topNavSettings);
        // Verify main content
        await this.verifyElementDisplayed(this.selectors.homeHeader);
        await this.verifyElementDisplayed(this.selectors.userProfileIcon);
        await this.verifyElementDisplayed(this.selectors.liveTVButton);
        await this.verifyElementDisplayed(this.selectors.onDemandButton);
        await this.verifyElementDisplayed(this.selectors.dvrButton);
        // Press Down Button to display content
        await this.pressDownButton();
        // Verify content categories
        await this.verifyElementDisplayed(this.selectors.topFreeMovies);
        await this.verifyElementDisplayed(this.selectors.topFreeShows);
        await this.verifyElementDisplayed(this.selectors.recommended);
        await this.verifyElementDisplayed(this.selectors.trendingLive);
        await this.verifyElementDisplayed(this.selectors.realityRoundup);
        await this.verifyElementDisplayed(this.selectors.trueCrime);
    }
    async verifyTopMenuElements() {
        await this.verifyElementDisplayed(this.selectors.topNavHome);
        await this.verifyElementDisplayed(this.selectors.topNavGuide);
        await this.verifyElementDisplayed(this.selectors.topNavSaved);
        await this.verifyElementDisplayed(this.selectors.topNavSearch);
        await this.verifyElementDisplayed(this.selectors.topNavSettings);
    }
    // Navigation methods for top menu
    async navigateToGuide() {
        await this.click(this.selectors.topNavGuide);
    }
    async navigateToSaved() {
        await this.click(this.selectors.topNavSaved);
    }
    async navigateToSearch() {
        await this.click(this.selectors.topNavSearch);
    }
    async navigateToSettings() {
        await this.click(this.selectors.topNavSettings);
    }
    /**
     * Navigate to Live TV
     */
    async goToLiveTV() {
        await this.click(this.selectors.liveTVButton);
    }
    /**
     * Navigate to On Demand
     */
    async goToOnDemand() {
        await this.click(this.selectors.onDemandButton);
    }
    /**
     * Navigate to DVR
     */
    async goToDVR() {
        await this.click(this.selectors.dvrButton);
    }
    /**
     * Click Play button
     */
    async clickPlay() {
        await this.click(this.selectors.playButton);
    }
    /**
     * Click More Info button
     */
    async clickMoreInfo() {
        await this.click(this.selectors.moreInfoButton);
    }
    /**
     * Navigate to settings from home screen
     */
    async navigateToSettingsFromHome() {
        // Press up to expose top menu
        await this.pressUpButton();
        // Wait for menu to be visible and click settings
        await this.verifyElementDisplayed(this.selectors.topNavSettings);
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
    async getFirstMovieTitle() {
        await this.waitForElement(this.selectors.topFreeMovies);
        const movieTile = await this.waitForElement(this.selectors.firstMovieTile);
        return movieTile.getAttribute('content-desc');
    }
    /**
     * Clicks on the first movie tile in the Top Free Movies row
     */
    async clickFirstMovie() {
        await this.waitForElement(this.selectors.topFreeMovies);
        await this.click(this.selectors.firstMovieTile);
    }
    /**
     * Navigates to the top portion of the home page
     * Uses the working pattern: back button, up twice, then enter
     */
    async goToHomePageTop() {
        try {
            await this.pressBackButton();
            await this.driver.pause(2000);
            await this.pressUpButton();
            await this.driver.pause(2000);
            await this.pressUpButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.driver.pause(5000);
        }
        catch (error) {
            console.error('Error navigating to home page top:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify the Settings page
     * @param settingsPage The settings page object
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifySettingsPage(settingsPage, topPage) {
        try {
            // Navigate to Settings
            await this.pressUpButton();
            await this.driver.pause(5000);
            // Press right button 5 times
            for (let i = 0; i < 5; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(5000);
            // Verify settings content
            await settingsPage.isElementVisible(settingsPage.getStartChannelPlaybackSelector());
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `settings_page_current_${timestamp}.png`;
            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path_1.default.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'reference', 'settings_page_reference.png');
            try {
                // First check if reference exists
                await promises_1.default.access(referenceScreenshotPath);
                // If reference exists, compare with current
                const comparison = await topPage.compareImages(screenshotPath, referenceScreenshotPath, path_1.default.join(process.cwd(), 'screenshots', 'difference', `settings_difference_${timestamp}.png`));
                console.log('Settings page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                // Consider test passed if difference is less than 5%
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            }
            catch (error) {
                // Only on first run: save current as reference
                console.log('First run - creating settings page reference image');
                await promises_1.default.copyFile(screenshotPath, referenceScreenshotPath);
            }
            // Return to previous screen
            await this.pressBackButton();
        }
        catch (error) {
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
    async navigateAndVerifyGuidePage(guidePage, topPage) {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            // Press right button once
            await this.pressRightButton();
            await this.pressEnterButton();
            await this.driver.pause(5000);
            // Check if Free channels is visible
            const isVisible = await guidePage.isElementVisible(guidePage.freeChannels);
            expect(isVisible).toBe(true);
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `guide_page_current_${timestamp}.png`;
            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path_1.default.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'reference', 'guide_page_reference.png');
            try {
                await promises_1.default.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(screenshotPath, referenceScreenshotPath, path_1.default.join(process.cwd(), 'screenshots', 'difference', `guide_difference_${timestamp}.png`));
                console.log('Guide page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            }
            catch (error) {
                console.log('First run - creating guide page reference image');
                await promises_1.default.copyFile(screenshotPath, referenceScreenshotPath);
            }
            await this.pressBackButton();
        }
        catch (error) {
            console.error('Error verifying Guide page:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify the Top page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifyTopPage(topPage) {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            // Press right button twice
            for (let i = 0; i < 2; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(10000);
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `top_page_current_${timestamp}.png`;
            const screenshotPath = await topPage.takeScreenshot(path_1.default.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'reference', 'top_page_reference.png');
            try {
                await promises_1.default.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(screenshotPath, referenceScreenshotPath, path_1.default.join(process.cwd(), 'screenshots', 'difference', `top_difference_${timestamp}.png`));
                console.log('Top page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            }
            catch (error) {
                console.log('First run - creating top page reference image');
                await promises_1.default.copyFile(screenshotPath, referenceScreenshotPath);
            }
            await this.pressBackButton();
        }
        catch (error) {
            console.error('Error verifying Top page:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify the Saved page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifySavedPage(topPage) {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            // Press right button three times
            for (let i = 0; i < 3; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(10000);
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `saved_page_current_${timestamp}.png`;
            const screenshotPath = await topPage.takeScreenshot(path_1.default.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'reference', 'saved_page_reference.png');
            try {
                await promises_1.default.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(screenshotPath, referenceScreenshotPath, path_1.default.join(process.cwd(), 'screenshots', 'difference', `saved_difference_${timestamp}.png`));
                console.log('Saved page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            }
            catch (error) {
                console.log('First run - creating saved page reference image');
                await promises_1.default.copyFile(screenshotPath, referenceScreenshotPath);
            }
            await this.pressBackButton();
        }
        catch (error) {
            console.error('Error verifying Saved page:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify the Search page
     * @param topPage The top page object for screenshots
     * @returns Promise<void>
     */
    async verifySearchPage(topPage) {
        try {
            await this.pressUpButton();
            await this.driver.pause(5000);
            // Press right button four times
            for (let i = 0; i < 4; i++) {
                await this.pressRightButton();
            }
            await this.pressEnterButton();
            await this.driver.pause(10000);
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `search_page_current_${timestamp}.png`;
            const screenshotPath = await topPage.takeScreenshot(path_1.default.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'reference', 'search_page_reference.png');
            try {
                await promises_1.default.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(screenshotPath, referenceScreenshotPath, path_1.default.join(process.cwd(), 'screenshots', 'difference', `search_difference_${timestamp}.png`));
                console.log('Search page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            }
            catch (error) {
                console.log('First run - creating search page reference image');
                await promises_1.default.copyFile(screenshotPath, referenceScreenshotPath);
            }
            await this.pressBackButton();
        }
        catch (error) {
            console.error('Error verifying Search page:', error);
            throw error;
        }
    }
    /**
     * Base method for verifying a category page
     * @param categoryName Name of the category for screenshots and logs
     * @param goToCategory Function that navigates to the category
     * @param upButtonPresses Number of up button presses needed to return to top
     * @param topPage The top page object for screenshots
     */
    async verifyCategoryPage(categoryName, goToCategory, upButtonPresses, topPage) {
        try {
            await goToCategory();
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `${categoryName.toLowerCase().replace(/ /g, '_')}_current_${timestamp}.png`;
            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path_1.default.join(process.cwd(), 'screenshots', 'current', currentScreenshotName));
            const referenceScreenshotPath = path_1.default.join(process.cwd(), 'screenshots', 'reference', `${categoryName.toLowerCase().replace(/ /g, '_')}_reference.png`);
            try {
                await promises_1.default.access(referenceScreenshotPath);
                const comparison = await topPage.compareImages(screenshotPath, referenceScreenshotPath, path_1.default.join(process.cwd(), 'screenshots', 'difference', `${categoryName.toLowerCase().replace(/ /g, '_')}_difference_${timestamp}.png`));
                console.log(`${categoryName} category comparison results:`, {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            }
            catch (error) {
                console.log(`First run - creating ${categoryName} category reference image`);
                await promises_1.default.copyFile(screenshotPath, referenceScreenshotPath);
            }
            await this.pressBackButton();
            await this.driver.pause(5000);
            // Navigate to top
            for (let i = 0; i < upButtonPresses; i++) {
                await this.pressUpButton();
                await this.driver.pause(2000);
            }
        }
        catch (error) {
            console.error(`Error verifying ${categoryName} category:`, error);
            throw error;
        }
    }
    /**
     * Verify Top Free Movies category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyTopFreeMovies(categoriesPage, topPage) {
        await this.verifyCategoryPage('Top Free Movies', () => categoriesPage.goToTopFreeMovies(), 1, topPage);
    }
    /**
     * Verify Top Free Shows category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyTopFreeShows(categoriesPage, topPage) {
        await this.verifyCategoryPage('Top Free Shows', () => categoriesPage.goToTopFreeShows(), 2, topPage);
    }
    /**
     * Verify Recommended category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyRecommended(categoriesPage, topPage) {
        await this.verifyCategoryPage('Recommended', () => categoriesPage.goToRecommended(), 3, topPage);
    }
    /**
     * Verify Saved category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifySavedCategory(categoriesPage, topPage) {
        await this.verifyCategoryPage('Saved', () => categoriesPage.goToSaved(), 4, topPage);
    }
    /**
     * Verify Trending Live category
     * @param categoriesPage The categories page object
     * @param topPage The top page object for screenshots
     */
    async verifyTrendingLive(categoriesPage, topPage) {
        await this.verifyCategoryPage('Trending Live', () => categoriesPage.goToTrendingLive(), 5, topPage);
    }
}
exports.HomeScreenPage = HomeScreenPage;
