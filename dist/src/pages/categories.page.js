"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesPage = void 0;
const homescreen_page_1 = require("./homescreen.page");
class CategoriesPage extends homescreen_page_1.HomeScreenPage {
    constructor(driver) {
        super(driver);
        // Merge the selectors
        this.selectors = {
            ...this.selectors,
            // Category-specific selectors
            headerWhitespace: 'android=resourceId("com.philo.philo:id/header_whitespace")',
            categoryIcon: 'android=resourceId("com.philo.philo:id/icon_tile_group")',
            categoryLabel: 'android=resourceId("com.philo.philo:id/label_tile_group")',
            // Grid Elements - Updated to match XML structure
            gridContainer: 'android=resourceId("com.philo.philo:id/fragment_tile_group_grid")',
            tileGroups: 'android=resourceId("com.philo.philo:id/tile_groups")',
            gridRow: 'android=resourceId("com.philo.philo:id/grid_row")',
            movieGrid: 'android=resourceId("com.philo.philo:id/list_view_broadcasts").className("android.widget.GridView")',
            // Movie Tile Elements - Updated to match XML structure
            movieTileWrapper: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).focusable(true)',
            movieBackgroundImage: 'android=resourceId("com.philo.philo:id/background_image").className("android.widget.ImageView")',
            moviePressedOverlay: 'android=resourceId("com.philo.philo:id/pressed_overlay").className("android.view.View")',
            // Category Headers
            topFreeMovies: 'android=text("Top Free Movies")',
            topFreeShows: 'android=text("Top Free Shows")',
            recommended: 'android=text("Recommended")',
            trendingLive: 'android=text("Trending Live")',
            realityRoundup: 'android=text("Reality Roundup")',
            trueCrime: 'android=text("True Crime")',
            saved: 'android=text("Saved")',
            homeAndTravel: 'android=text("Home & Travel")',
            // Movie Tiles (Top Free Movies) - Updated to match XML structure
            killBillVol1: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("Kill Bill: Vol. 1")',
            walkToRemember: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("A Walk to Remember")',
            killBillVol2: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("Kill Bill: Vol. 2")',
            ingloriousBasterds: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("Inglourious Basterds")',
            twilight: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("Twilight")',
            twilightNewMoon: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("The Twilight Saga: New Moon")',
            reservoirDogs: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("Reservoir Dogs")',
            twilightEclipse: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("The Twilight Saga: Eclipse")',
            twilightBreakingDawn2: 'android=new UiSelector().className("android.view.ViewGroup").clickable(true).description("The Twilight Saga: Breaking Dawn Part 2")'
        };
    }
    /**
     * Get all visible movie titles in the grid
     * @returns Promise<string[]> Array of movie titles
     */
    async getAllVisibleMovieTitles() {
        const movieTiles = await this.driver.$$(this.selectors.movieTileWrapper);
        const titles = [];
        for (const tile of movieTiles) {
            const title = await tile.getAttribute('content-desc');
            if (title) {
                titles.push(title);
            }
        }
        return titles;
    }
    async verifyTopFreeMoviesHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.topFreeMovies
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Top Free Movies header elements found');
        }
        catch (error) {
            console.error('Error verifying Top Free Movies header:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify a specific category row
     * @param categorySelector The selector for the category text
     * @param numberOfDownPresses Number of times to press down to reach the row
     */
    async navigateToCategory(categorySelector, numberOfDownPresses) {
        try {
            // Press down the specified number of times to reach the row
            for (let i = 0; i < numberOfDownPresses; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000); // Wait for animation
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.driver.pause(3000); // Wait for content to load
        }
        catch (error) {
            console.error('Error navigating to category:', error);
            throw error;
        }
    }
    /**
     * Verify Recommended section header is visible
     */
    async verifyRecommendedHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.recommended
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Recommended header elements found');
        }
        catch (error) {
            console.error('Error verifying Recommended header:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify Recommended section
     * Requires 2 down presses from Top Free Movies
     */
    async navigateToRecommended() {
        await this.navigateToCategory(this.selectors.recommended, 2);
        await this.verifyRecommendedHeaderDisplayed();
    }
    /**
     * Verify Trending Live section header is visible
     */
    async verifyTrendingLiveHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.trendingLive
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Trending Live header elements found');
        }
        catch (error) {
            console.error('Error verifying Trending Live header:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify Trending Live section
     * Requires 3 down presses from Top Free Movies
     */
    async navigateToTrendingLive() {
        await this.navigateToCategory(this.selectors.trendingLive, 3);
        await this.verifyTrendingLiveHeaderDisplayed();
    }
    /**
     * Verify Reality Roundup section header is visible
     */
    async verifyRealityRoundupHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.realityRoundup
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Reality Roundup header elements found');
        }
        catch (error) {
            console.error('Error verifying Reality Roundup header:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify Reality Roundup section
     * Requires 4 down presses from Top Free Movies
     */
    async navigateToRealityRoundup() {
        try {
            // Four down presses to reach Reality Roundup
            for (let i = 0; i < 4; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyRealityRoundupHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Reality Roundup:', error);
            throw error;
        }
    }
    /**
     * Verify True Crime section header is visible
     */
    async verifyTrueCrimeHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.trueCrime
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No True Crime header elements found');
        }
        catch (error) {
            console.error('Error verifying True Crime header:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify True Crime section
     * Requires 5 down presses from Top Free Movies
     */
    async navigateToTrueCrime() {
        try {
            // Five down presses to reach True Crime
            for (let i = 0; i < 5; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyTrueCrimeHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to True Crime:', error);
            throw error;
        }
    }
    /**
     * Verify Home & Travel section header is visible
     */
    async verifyHomeAndTravelHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.homeAndTravel
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Home & Travel header elements found');
        }
        catch (error) {
            console.error('Error verifying Home & Travel header:', error);
            throw error;
        }
    }
    /**
     * Navigate to and verify Home & Travel section
     * Requires 6 down presses from Top Free Movies
     */
    async navigateToHomeAndTravel() {
        try {
            // Six down presses to reach Home & Travel
            for (let i = 0; i < 6; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyHomeAndTravelHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Home & Travel:', error);
            throw error;
        }
    }
    async verifyTopFreeShowsHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.topFreeShows
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Top Free Shows header elements found');
        }
        catch (error) {
            console.error('Error verifying Top Free Shows header:', error);
            throw error;
        }
    }
    /**
     * Navigate directly to Top Free Movies category
     */
    async goToTopFreeMovies() {
        try {
            // One down press to focus
            await this.pressDownButton();
            await this.driver.pause(2000);
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyTopFreeMoviesHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Top Free Movies:', error);
            throw error;
        }
    }
    /**
     * Navigate directly to Top Free Shows category
     */
    async goToTopFreeShows() {
        try {
            // Two down presses to reach Top Free Shows
            for (let i = 0; i < 2; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyTopFreeShowsHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Top Free Shows:', error);
            throw error;
        }
    }
    /**
     * Navigate directly to Recommended category
     */
    async goToRecommended() {
        try {
            // Three down presses to reach Recommended
            for (let i = 0; i < 3; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyRecommendedHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Recommended:', error);
            throw error;
        }
    }
    /**
     * Navigate directly to Trending Live category
     */
    async goToTrendingLive() {
        try {
            // Five down presses to reach Trending Live
            for (let i = 0; i < 5; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifyTrendingLiveHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Trending Live:', error);
            throw error;
        }
    }
    /**
     * Verify Saved section header is visible
     */
    async verifySavedHeaderDisplayed() {
        try {
            const elements = [
                this.selectors.headerWhitespace,
                this.selectors.categoryIcon,
                this.selectors.categoryLabel,
                this.selectors.saved
            ];
            for (const element of elements) {
                if (await this.isElementDisplayed(element)) {
                    console.log('Found visible element:', element);
                    return;
                }
            }
            throw new Error('No Saved header elements found');
        }
        catch (error) {
            console.error('Error verifying Saved header:', error);
            throw error;
        }
    }
    /**
     * Navigate directly to Saved category
     */
    async goToSaved() {
        try {
            // Four down presses to reach Saved
            for (let i = 0; i < 4; i++) {
                await this.pressDownButton();
                await this.driver.pause(2000);
            }
            await this.pressLeftButton();
            await this.driver.pause(2000);
            await this.pressEnterButton();
            await this.verifySavedHeaderDisplayed();
        }
        catch (error) {
            console.error('Error navigating to Saved:', error);
            throw error;
        }
    }
    /**
     * Gets the title of the movie in focus
     * @returns Promise<string> The movie title
     */
    async getMovieTitle() {
        try {
            // Add initial pause to ensure the page has loaded
            await this.driver.pause(5000);
            // Find the focused movie element
            const focusedMovie = await this.driver.$('android=new UiSelector().className("android.view.ViewGroup").focused(true)');
            const title = await focusedMovie.getAttribute('content-desc');
            if (!title) {
                throw new Error('No movie title found on the focused element');
            }
            return title;
        }
        catch (error) {
            console.error('Error getting movie title:', error);
            throw error;
        }
    }
    /**
     * Clicks on the currently focused movie
     */
    async clickOnMovie() {
        try {
            console.log('Attempting to click on movie...');
            // Get the focused element
            const focusedElement = await this.driver.$('android=new UiSelector().className("android.view.ViewGroup").focused(true)');
            const isDisplayed = await focusedElement.isDisplayed();
            console.log('Is focused element displayed:', isDisplayed);
            if (!isDisplayed) {
                throw new Error('No focused movie element found');
            }
            // Get the title before clicking
            const title = await focusedElement.getAttribute('content-desc');
            console.log('Clicking on movie:', title);
            // Press enter to click
            await this.pressEnterButton();
            console.log('Enter button pressed');
            // Wait for transition
            await this.driver.pause(5000);
            console.log('Waited for transition');
            // Try to find any visible text elements to help with debugging
            const textElements = await this.driver.$$('android=new UiSelector().className("android.widget.TextView")');
            console.log('Found text elements:', textElements.length);
            for (const element of textElements) {
                if (await element.isDisplayed()) {
                    const text = await element.getText();
                    console.log('Visible text element:', text);
                }
            }
        }
        catch (error) {
            console.error('Error clicking on movie:', error);
            throw error;
        }
    }
    async getSeriesTitle() {
        try {
            // Add initial pause to ensure the page has loaded
            await this.driver.pause(5000);
            // Find the focused series element
            const focusedSeries = await this.driver.$('android=new UiSelector().className("android.view.ViewGroup").focused(true)');
            const title = await focusedSeries.getAttribute('content-desc');
            if (!title) {
                throw new Error('No series title found on the focused element');
            }
            return title;
        }
        catch (error) {
            console.error('Error getting series title:', error);
            throw error;
        }
    }
    async clickOnSeries() {
        try {
            // Add initial pause to ensure the page has loaded
            await this.driver.pause(2000);
            // Instead of clicking, press enter since the element is already focused
            await this.pressEnterButton();
        }
        catch (error) {
            console.error('Error clicking on series:', error);
            throw error;
        }
    }
    /**
     * Verifies the title of a movie in both category and details pages
     * @param movieNumber The number of the movie being verified
     * @param movieDetailsPage The movie details page object
     * @returns Promise<{categoryTitle: string, detailsTitle: string}> The titles from both pages
     */
    async verifyMovieTitle(movieNumber, movieDetailsPage) {
        try {
            console.log(`Starting verification for movie ${movieNumber}...`);
            // Get title from category page
            const categoryTitle = await this.getMovieTitle();
            console.log(`Movie ${movieNumber} title in Category Page:`, `"${categoryTitle}"`);
            // Click on movie and wait for details page
            console.log('Clicking on movie...');
            await this.clickOnMovie();
            // Add longer pause for transition
            console.log('Waiting for transition...');
            await this.driver.pause(5000);
            // Wait for details page and verify it's loaded
            console.log('Waiting for details page to load...');
            await movieDetailsPage.waitForLoaded();
            // Verify we're on the details page
            const isOnDetailsPage = await movieDetailsPage.isDisplayed();
            console.log('Is on details page:', isOnDetailsPage);
            if (!isOnDetailsPage) {
                throw new Error('Failed to navigate to movie details page');
            }
            // Get title from details page
            console.log('Getting movie title from details page...');
            const detailsTitle = await movieDetailsPage.getMovieTitle();
            console.log(`Movie ${movieNumber} title in Movie Details Page:`, `"${detailsTitle}"`);
            // Compare titles
            console.log('Comparing titles...');
            expect(categoryTitle).toEqual(detailsTitle);
            // Wait before returning
            await this.driver.pause(2000);
            console.log('Title verification completed successfully');
            return { categoryTitle, detailsTitle };
        }
        catch (error) {
            console.error(`Error verifying movie ${movieNumber}:`, error);
            throw error;
        }
    }
    /**
     * Verifies multiple movies in sequence
     * @param movieCount Number of movies to verify
     * @param movieDetailsPage The movie details page object
     * @returns Promise<Array<{categoryTitle: string, detailsTitle: string}>> Array of verified titles
     */
    async verifyMultipleMovies(movieCount, movieDetailsPage) {
        const verifiedTitles = [];
        try {
            // Navigate to Top Free Movies
            await this.goToTopFreeMovies();
            await this.driver.pause(2000);
            // Verify each movie
            for (let i = 0; i < movieCount; i++) {
                const titles = await this.verifyMovieTitle(i + 1, movieDetailsPage);
                verifiedTitles.push(titles);
                // Log verification immediately
                console.log(`${i + 1}. "${titles.categoryTitle}" = "${titles.detailsTitle}"`);
                if (i < movieCount - 1) {
                    // If not the last movie, go back and move right
                    await this.pressBackButton();
                    await this.driver.pause(2000);
                    await this.pressRightButton();
                    await this.driver.pause(2000);
                }
            }
            return verifiedTitles;
        }
        catch (error) {
            console.error('Error verifying multiple movies:', error);
            throw error;
        }
    }
    /**
     * Wait for movie tiles to be loaded
     */
    async waitForMovieTilesLoaded() {
        await this.driver.$(this.selectors.movieTileWrapper).waitForDisplayed({ timeout: 10000 });
    }
    /**
     * Click on the first movie tile in the grid
     */
    async clickMovieTile() {
        const movieTiles = await this.driver.$$(this.selectors.movieTileWrapper);
        if (movieTiles.length > 0) {
            await movieTiles[0].click();
        }
        else {
            throw new Error('No movie tiles found to click');
        }
    }
}
exports.CategoriesPage = CategoriesPage;
