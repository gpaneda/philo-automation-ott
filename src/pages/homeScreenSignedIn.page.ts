import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import { exec } from 'child_process';

export class HomeScreenSignedInPage extends BasePage {
    

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

    async verifyTopMenuElements(): Promise<void> {

        await this.verifyElementDisplayed(this.selectors.topNavHome);
        await this.verifyElementDisplayed(this.selectors.topNavGuide);
        await this.verifyElementDisplayed(this.selectors.topNavSaved);
        await this.verifyElementDisplayed(this.selectors.topNavSearch);
        await this.verifyElementDisplayed(this.selectors.topNavSettings);

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

} 