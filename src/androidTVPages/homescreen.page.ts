import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export class HomeScreenPage extends BasePage {
    public selectors = {
        // Header and Menu
        menuButton: 'android=resourceId("com.philo.philo.google:id/tab_bar_menu_button")',
        menuText: 'android=text("Menu")',
        
        // Content Container
        tileGroupsContainer: 'android=resourceId("com.philo.philo.google:id/tile_groups_container")',
        composeView: 'android=resourceId("com.philo.philo.google:id/compose_view")',
        composeViewWrapper: 'android=resourceId("com.philo.philo.google:id/compose_view_wrapper")',
        
        // Featured Content
        featuredTitle: 'android=resourceId("com.philo.philo.google:id/title")',
        featuredDescription: 'android=className("android.widget.TextView").textContains(".")',
        episodeInfo: 'android=className("android.widget.TextView").textMatches("S\\d+ \\| E\\d+.*")',
        channelLogo: 'android=className("android.widget.ImageView").descriptionContains("")',
        
        // Action Buttons
        playButton: 'android=text("Play")',
        moreInfoButton: 'android=text("More info")',
        
        // Content Categories
        featuredOnPhilo: 'android=text("Featured on Philo")',
        trendingNow: 'android=text("Trending now")',
        
        // Tile Groups
        tileGroups: 'android=resourceId("com.philo.philo.google:id/tile_groups")',
        defaultTileRow: 'android=resourceId("com.philo.philo.google:id/default_tile_row")',
        tileGroupRowHeader: 'android=resourceId("com.philo.philo.google:id/tile_group_row_header_layout")',
        listViewBroadcasts: 'android=resourceId("com.philo.philo.google:id/list_view_broadcasts")',
        buttonTileGroup: 'android=resourceId("com.philo.philo.google:id/button_tile_group")',
        labelTileGroup: 'android=resourceId("com.philo.philo.google:id/label_tile_group")',
        
        // Channel Tiles
        channelTile: 'android=resourceId("com.philo.philo.google:id/widget_tile_wrapper")',
        tileViewWrapper: 'android=resourceId("com.philo.philo.google:id/tile_view_wrapper")',
        backgroundImage: 'android=resourceId("com.philo.philo.google:id/background_image")',
        pressedOverlay: 'android=resourceId("com.philo.philo.google:id/pressed_overlay")',
        
        // Live Indicator
        liveText: 'android=text("Live")',
        
        // Navigation Tabs
        fragmentTabs: 'android=resourceId("com.philo.philo.google:id/fragment_tabs")',
        tabBar: 'android=resourceId("com.philo.philo.google:id/tab_bar")',
        tabHome: 'android=resourceId("com.philo.philo.google:id/tab_home")',
        tabGuide: 'android=resourceId("com.philo.philo.google:id/tab_guide")',
        tabTop: 'android=resourceId("com.philo.philo.google:id/tab_top")',
        tabSaved: 'android=resourceId("com.philo.philo.google:id/tab_saved")',
        tabSearch: 'android=resourceId("com.philo.philo.google:id/tab_search")',
        tabProfile: 'android=resourceId("com.philo.philo.google:id/tab_profile")',
        
        // Tab Labels
        labelTab: 'android=resourceId("com.philo.philo.google:id/label_tab")',
        iconTab: 'android=resourceId("com.philo.philo.google:id/icon_tab")',
        
        // Time Display
        tabBarTime: 'android=resourceId("com.philo.philo.google:id/tab_bar_time")',
        tabBarTimeLabel: 'android=resourceId("com.philo.philo.google:id/tab_bar_time_label")',
        
        // Fragment Hosts
        activityHost: 'android=resourceId("com.philo.philo.google:id/activity_host")',
        playerFragmentHost: 'android=resourceId("com.philo.philo.google:id/player_fragment_host")',
        modalFragmentHost: 'android=resourceId("com.philo.philo.google:id/modal_fragment_host")',
        dialogFragmentHost: 'android=resourceId("com.philo.philo.google:id/dialog_fragment_host")',
        fragmentHost: 'android=resourceId("com.philo.philo.google:id/fragment_host")',
        
        // Root Elements
        actionBarRoot: 'android=resourceId("com.philo.philo.google:id/action_bar_root")',
        androidContent: 'android=resourceId("android:id/content")'
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
     * Remote control navigation methods
     */
    async pressUpButton(): Promise<void> {
        await this.sendKeyEvent(19); // KEYCODE_DPAD_UP
    }

    async pressDownButton(): Promise<void> {
        await this.sendKeyEvent(20); // KEYCODE_DPAD_DOWN
    }

    async pressRightButton(): Promise<void> {
        await this.sendKeyEvent(22); // KEYCODE_DPAD_RIGHT
    }

    async pressLeftButton(): Promise<void> {
        await this.sendKeyEvent(21); // KEYCODE_DPAD_LEFT
    }

    async pressEnterButton(): Promise<void> {
        await this.sendKeyEvent(66); // KEYCODE_ENTER
    }

    async pressBackButton(): Promise<void> {
        await this.sendKeyEvent(4); // KEYCODE_BACK
    }

    /**
     * Tab Navigation Methods
     */
    async navigateToHome(): Promise<void> {
        await this.click(this.selectors.tabHome);
    }

    async navigateToGuide(): Promise<void> {
        await this.click(this.selectors.tabGuide);
    }

    async navigateToTop(): Promise<void> {
        await this.click(this.selectors.tabTop);
    }

    async navigateToSaved(): Promise<void> {
        await this.click(this.selectors.tabSaved);
    }

    async navigateToSearch(): Promise<void> {
        await this.click(this.selectors.tabSearch);
    }

    async navigateToSettings(): Promise<void> {
        await this.click(this.selectors.tabProfile);
    }

    /**
     * Content Interaction Methods
     */
    async clickPlay(): Promise<void> {
        await this.click(this.selectors.playButton);
    }

    async clickMoreInfo(): Promise<void> {
        await this.click(this.selectors.moreInfoButton);
    }

    async getFeaturedTitle(): Promise<string> {
        const element = await this.driver.$(this.selectors.featuredTitle);
        return element.getText();
    }

    async getFeaturedDescription(): Promise<string> {
        const element = await this.driver.$(this.selectors.featuredDescription);
        return element.getText();
    }

    async getEpisodeInfo(): Promise<string> {
        const element = await this.driver.$(this.selectors.episodeInfo);
        return element.getText();
    }

    /**
     * Tile Group Methods
     */
    async expandTileGroup(groupName: string): Promise<void> {
        const selector = `android=new UiSelector().text("${groupName}")`;
        await this.click(selector);
    }

    async getTileGroupTitle(index: number): Promise<string> {
        const elements = await this.driver.$$(this.selectors.labelTileGroup);
        if (elements[index]) {
            return elements[index].getText();
        }
        throw new Error(`No tile group found at index ${index}`);
    }

    /**
     * Channel Tile Methods
     */
    async selectChannelTile(channelName: string): Promise<void> {
        const selector = `android=new UiSelector().description("${channelName}")`;
        await this.click(selector);
    }

    async getChannelTileCount(): Promise<number> {
        const elements = await this.driver.$$(this.selectors.channelTile);
        return elements.length;
    }

    /**
     * Verification Methods
     */
    async verifyHomeScreenElements(): Promise<void> {
        // Verify navigation tabs
        await this.isElementDisplayed(this.selectors.tabHome);
        await this.isElementDisplayed(this.selectors.tabGuide);
        await this.isElementDisplayed(this.selectors.tabTop);
        await this.isElementDisplayed(this.selectors.tabSaved);
        await this.isElementDisplayed(this.selectors.tabSearch);
        await this.isElementDisplayed(this.selectors.tabProfile);

        // Verify content containers
        await this.isElementDisplayed(this.selectors.tileGroupsContainer);
        await this.isElementDisplayed(this.selectors.composeView);

        // Verify featured content
        await this.isElementDisplayed(this.selectors.featuredTitle);
        await this.isElementDisplayed(this.selectors.featuredDescription);

        // Verify action buttons
        await this.isElementDisplayed(this.selectors.playButton);
        await this.isElementDisplayed(this.selectors.moreInfoButton);
    }

    async getCurrentTime(): Promise<string> {
        const element = await this.driver.$(this.selectors.tabBarTimeLabel);
        return element.getText();
    }

    /**
     * Helper Methods
     */
    async waitForContentLoad(): Promise<void> {
        await this.waitForElement(this.selectors.tileGroupsContainer);
        await this.waitForElement(this.selectors.featuredTitle);
    }

    async isPlayerVisible(): Promise<boolean> {
        const element = await this.driver.$(this.selectors.playerFragmentHost);
        return element.isDisplayed();
    }

    async isModalVisible(): Promise<boolean> {
        const element = await this.driver.$(this.selectors.modalFragmentHost);
        return element.isDisplayed();
    }

    async closeModal(): Promise<void> {
        if (await this.isModalVisible()) {
            await this.pressBackButton();
        }
    }
} 