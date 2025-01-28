import { Browser, Element } from 'webdriverio';
import { BasePage } from './base.page';

export class MoviesDetailsPage extends BasePage {
    public selectors = {
        // Movie Information
        movieTitle: 'android=className("android.widget.TextView").textMatches(".*")',
        movieDescription: 'android=className("android.widget.TextView").clickable(true).textMatches(".*")',
        moviePoster: 'android=className("android.widget.ImageView").descriptionMatches(".*")',
        movieRating: 'android=className("android.widget.TextView").textMatches("TV-.*|PG.*|G|R|NC-17")',
        releaseDate: 'android=className("android.widget.TextView").textMatches("\\d{4}")',
        ratingAdvisories: 'android=className("android.widget.TextView").textMatches(".*Seasons.*|.*Episodes.*")',
        
        // Action Buttons Container
        buttonsContainer: 'android=className("android.view.View").index(6)',
        
        // Action Buttons
        playButton: 'android=className("android.view.View").descriptionContains("Play")',
        playLabel: 'android=className("android.widget.TextView").textContains("Play")',
        saveButton: 'android=className("android.view.View").descriptionContains("Save")',
        saveLabel: 'android=className("android.widget.TextView").text("Save")',
        channelButton: 'android=className("android.view.View").descriptionContains("View")',
        
        // Navigation Tabs Container
        tabContainer: 'android=className("android.view.View").index(7)',
        
        // Navigation Tabs
        episodesTab: 'android=className("android.widget.TextView").text("Episodes")',
        scheduleTab: 'android=className("android.widget.TextView").text("Schedule")',
        relatedTab: 'android=className("android.widget.TextView").text("Related")',
        detailsTab: 'android=className("android.widget.TextView").text("Details")',
        watchOptionsTab: 'android=className("android.widget.TextView").text("Watch Options")',

        // Content Container
        contentContainer: 'android=className("android.view.View").index(1).focusable(true)',
        
        // Background Elements
        backgroundImage: 'android=className("android.widget.ImageView").descriptionMatches(".*")',
        
        // Container Elements
        mainContainer: 'android=className("android.view.View").focusable(true)',
        detailsContainer: 'android=className("android.view.View").index(1).focusable(true)',
        
        // Related View Elements
        contentGrid: 'android=className("android.view.View").scrollable(true)',
        gridItem: 'android=className("android.view.View").clickable(true).focusable(true)',
        relatedItemTitle: 'android=className("android.widget.TextView").clickable(false)',
        relatedItemContainer: 'android=className("android.view.View").clickable(true).focusable(true)',
        
        // Watch Options Elements
        watchOptionsContainer: 'android=className("android.view.View").index(1).focusable(true)',
        watchOptionItem: 'android=className("android.view.View").clickable(true)',
        watchOptionLogo: 'android=className("android.view.View").descriptionMatches(".*")',
        watchOptionTitle: 'android=className("android.widget.TextView").textMatches(".*")',
        watchOptionDuration: 'android=className("android.widget.TextView").textMatches(".*[hm].*")',
        watchOptionRating: 'android=className("android.widget.TextView").textMatches("TV-.*|PG.*|G|R|NC-17")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Gets the movie title text
     * @returns Promise<string> The movie title
     */
    async getMovieTitle(): Promise<string> {
        const element = await this.driver.$(this.selectors.movieTitle);
        return await element.getAttribute('content-desc');
    }

    /**
     * Gets the movie poster description
     * @returns Promise<string> The movie poster description
     */
    async getMoviePosterDescription(): Promise<string> {
        const element = await this.driver.$(this.selectors.moviePoster);
        return await element.getAttribute('content-desc');
    }

    /**
     * Gets all related content titles
     * @returns Promise<string[]> Array of related content titles
     */
    async getRelatedContentTitles(): Promise<string[]> {
        const elements = await this.driver.$$(this.selectors.relatedItemTitle);
        const titles = await Promise.all(
            elements.map(async (element: Element<'async'>) => await element.getAttribute('content-desc'))
        );
        return titles.filter((title: string | null): title is string => title !== null);
    }

    /**
     * Clicks a related content item by its title
     * @param title The title of the content to click
     */
    async clickRelatedContent(title: string): Promise<void> {
        const selector = `android=className("android.view.View").descriptionContains("${title}")`;
        await this.click(selector);
    }

    /**
     * Clicks the play button to start the movie
     */
    async clickPlay(): Promise<void> {
        await this.click(this.selectors.playButton);
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
     * Clicks the related tab
     */
    async clickRelatedTab(): Promise<void> {
        await this.click(this.selectors.relatedTab);
    }

    /**
     * Clicks the watch options tab
     */
    async clickWatchOptionsTab(): Promise<void> {
        await this.click(this.selectors.watchOptionsTab);
    }

    /**
     * Clicks the details tab
     */
    async clickDetailsTab(): Promise<void> {
        await this.click(this.selectors.detailsTab);
    }

    /**
     * Verifies if the movie details page is displayed
     * @returns Promise<boolean> True if the movie details page is displayed
     */
    async isDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.selectors.moviePoster);
    }

    /**
     * Waits for the movie details page to be fully loaded
     */
    async waitForLoaded(): Promise<void> {
        await this.waitForElement(this.selectors.moviePoster);
    }

    /**
     * Gets all watch options for the movie
     * @returns Promise<string[]> Array of watch option descriptions
     */
    async getWatchOptions(): Promise<string[]> {
        const elements = await this.driver.$$(this.selectors.watchOptionItem);
        const options = await Promise.all(
            elements.map(async (element: Element<'async'>) => await element.getAttribute('content-desc'))
        );
        return options.filter((option: string | null): option is string => option !== null);
    }

    /**
     * Gets all watch option channels/providers
     * @returns Promise<string[]> Array of channel/provider names
     */
    async getWatchOptionProviders(): Promise<string[]> {
        const elements = await this.driver.$$(this.selectors.watchOptionLogo);
        const providers = await Promise.all(
            elements.map(async (element: Element<'async'>) => await element.getAttribute('content-desc'))
        );
        return providers.filter((provider: string | null): provider is string => provider !== null);
    }

    /**
     * Clicks a specific watch option by its description
     * @param description The content description of the watch option to click
     */
    async clickWatchOption(description: string): Promise<void> {
        const selector = `android=className("android.view.View").descriptionContains("${description}")`;
        await this.click(selector);
    }
} 