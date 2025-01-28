import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class SeriesDetailsPage extends BasePage {
    public selectors = {
        // Series Information
        seriesTitle: 'android=className("android.widget.TextView").textMatches(".*").index(1)',  // Title text
        seriesDescription: 'android=className("android.widget.TextView").clickable(true)',  // Long description text
        releaseYear: 'android=className("android.widget.TextView").textMatches("\\d{4}")',  // Year (e.g., "2019")
        seasonCount: 'android=className("android.widget.TextView").textMatches(".*Seasons.*")',  // "X Seasons"
        rating: 'android=className("android.widget.TextView").textMatches("TV-.*|PG.*|G|R|NC-17")',  // TV rating
        seriesPoster: 'android=className("android.widget.ImageView").descriptionMatches(".*")',  // Series poster with description
        
        // Channel Information
        channelButton: 'android=className("android.view.View").descriptionContains("View")',
        channelName: 'android=className("android.widget.TextView").textMatches(".*").index(0)',
        
        // Action Buttons
        playButton: 'android=className("android.view.View").descriptionContains("Play")',
        saveButton: 'android=className("android.view.View").descriptionContains("Save")',
        
        // Navigation Tabs
        episodesTab: 'android=className("android.widget.TextView").text("Episodes")',
        scheduleTab: 'android=className("android.widget.TextView").text("Schedule")',
        relatedTab: 'android=className("android.widget.TextView").text("Related")',
        extrasTab: 'android=className("android.widget.TextView").text("Extras")',
        detailsTab: 'android=className("android.widget.TextView").text("Details")',
        
        // Background Elements
        backgroundImage: 'android=className("android.widget.ImageView").descriptionMatches(".*")',
        
        // Container Elements
        detailsContainer: 'android=className("android.view.View").index(1).focusable(true)',
        buttonsContainer: 'android=className("android.view.View").index(6)',
        tabContainer: 'android=className("android.view.View").index(7)'
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

    /**
     * Gets the series description
     * @returns Promise<string> The series description
     */
    async getSeriesDescription(): Promise<string> {
        const element = await this.waitForElement(this.selectors.seriesDescription);
        return element.getText();
    }

    /**
     * Gets the release year
     * @returns Promise<string> The release year
     */
    async getReleaseYear(): Promise<string> {
        const element = await this.waitForElement(this.selectors.releaseYear);
        return element.getText();
    }

    /**
     * Gets the number of seasons
     * @returns Promise<string> The season count
     */
    async getSeasonCount(): Promise<string> {
        const element = await this.waitForElement(this.selectors.seasonCount);
        return element.getText();
    }

    /**
     * Gets the content rating
     * @returns Promise<string> The content rating
     */
    async getContentRating(): Promise<string> {
        const element = await this.waitForElement(this.selectors.rating);
        return element.getText();
    }

    /**
     * Clicks the play button
     */
    async clickPlay(): Promise<void> {
        await this.click(this.selectors.playButton);
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
} 
