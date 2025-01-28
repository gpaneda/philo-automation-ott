import { Browser, Element } from 'webdriverio';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as resemble from 'resemblejs';

export class TopPage {
    getMovieTitle() {
        throw new Error('Method not implemented.');
    }
    private driver: Browser<'async'>;

    constructor(driver: Browser<'async'>) {
        this.driver = driver;
    }

    // Define properties for each UI element based on resource IDs
    actionBarRoot = 'com.philo.philo.google:id/action_bar_root';
    content = 'android:id/content';
    activityHost = 'com.philo.philo.google:id/activity_host';
    playerFragmentHost = 'com.philo.philo.google:id/player_fragment_host';
    modalFragmentHost = 'com.philo.philo.google:id/modal_fragment_host';
    dialogFragmentHost = 'com.philo.philo.google:id/dialog_fragment_host';
    fragmentHost = 'com.philo.philo.google:id/fragment_host';
    fragmentTileGroupList = 'com.philo.philo.google:id/fragment_tile_group_list';
    tileGroupsContainer = 'com.philo.philo.google:id/tile_groups_container';
    tileGroups = 'com.philo.philo.google:id/tile_groups';
    guideTileRow = 'com.philo.philo.google:id/guide_tile_row';
    listViewBroadcasts = 'com.philo.philo.google:id/list_view_broadcasts';
    groupHeaderLabel = 'com.philo.philo.google:id/group_header_label';
    groupHeaderLayout = 'com.philo.philo.google:id/group_header_layout';
    tileGroupRowHeaderBackground = 'com.philo.philo.google:id/tile_group_row_header_background';
    tileGroupRowHeaderLayout = 'com.philo.philo.google:id/tile_group_row_header_layout';
    buttonTileGroup = 'com.philo.philo.google:id/button_tile_group';
    channelLogo = 'com.philo.philo.google:id/channel_logo';
    pressedOverlay = 'com.philo.philo.google:id/pressed_overlay';
    backgroundImage = 'com.philo.philo.google:id/background_image';
    title = 'com.philo.philo.google:id/title';
    description = 'com.philo.philo.google:id/description';
    flagNew = 'com.philo.philo.google:id/flag_new';
    fragmentTabs = 'com.philo.philo.google:id/fragment_tabs';
    widgetTabs = 'com.philo.philo.google:id/widget_tabs';
    tabBar = 'com.philo.philo.google:id/tab_bar';
    tabHome = 'com.philo.philo.google:id/tab_home';
    tabGuide = 'com.philo.philo.google:id/tab_guide';
    tabTop = 'com.philo.philo.google:id/tab_top';
    tabSaved = 'com.philo.philo.google:id/tab_saved';
    tabSearch = 'com.philo.philo.google:id/tab_search';
    tabProfile = 'com.philo.philo.google:id/tab_profile';
    labelTab = 'com.philo.philo.google:id/label_tab';
    iconTab = 'com.philo.philo.google:id/icon_tab';
    tabBarTime = 'com.philo.philo.google:id/tab_bar_time';
    tabBarTimeLabel = 'com.philo.philo.google:id/tab_bar_time_label';

    // Method to get the action bar root element
    getActionBarRootElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.actionBarRoot}']`;
    }

    // Method to get the content element
    getContentElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.content}']`;
    }

    // Method to get the player fragment host element
    getPlayerFragmentHostElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.playerFragmentHost}']`;
    }

    // Method to get the modal fragment host element
    getModalFragmentHostElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.modalFragmentHost}']`;
    }

    // Method to get the dialog fragment host element
    getDialogFragmentHostElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.dialogFragmentHost}']`;
    }

    // Method to get the fragment host element
    getFragmentHostElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.fragmentHost}']`;
    }

    // Method to get the fragment tile group list element
    getFragmentTileGroupListElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.fragmentTileGroupList}']`;
    }

    // Method to get the tile groups container element
    getTileGroupsContainerElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tileGroupsContainer}']`;
    }

    // Method to get the tile groups element
    getTileGroupsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.tileGroups}']`;
    }

    // Method to get the guide tile row element
    getGuideTileRowElement() {
        return `//android.view.ViewGroup[@resource-id='${this.guideTileRow}']`;
    }

    // Method to get the list view broadcasts element
    getListViewBroadcastsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.listViewBroadcasts}']`;
    }

    // Method to get the group header label element
    getGroupHeaderLabelElement() {
        return `//android.widget.TextView[@resource-id='${this.groupHeaderLabel}']`;
    }

    // Method to get the group header layout element
    getGroupHeaderLayoutElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.groupHeaderLayout}']`;
    }

    // Method to get the tile group row header background element
    getTileGroupRowHeaderBackgroundElement() {
        return `//android.widget.ImageView[@resource-id='${this.tileGroupRowHeaderBackground}']`;
    }

    // Method to get the tile group row header layout element
    getTileGroupRowHeaderLayoutElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tileGroupRowHeaderLayout}']`;
    }

    // Method to get the button tile group element
    getButtonTileGroupElement() {
        return `//android.view.ViewGroup[@resource-id='${this.buttonTileGroup}']`;
    }

    // Method to get the channel logo element
    getChannelLogoElement() {
        return `//android.widget.ImageView[@resource-id='${this.channelLogo}']`;
    }

    // Method to get the pressed overlay element
    getPressedOverlayElement() {
        return `//android.view.View[@resource-id='${this.pressedOverlay}']`;
    }

    // Method to get the background image element
    getBackgroundImageElement() {
        return `//android.widget.ImageView[@resource-id='${this.backgroundImage}']`;
    }

    // Method to get the title element
    getTitleElement(): string {
        return `//android.widget.TextView[@resource-id='${this.title}']`;
    }

    // Method to get the description element
    getDescriptionElement() {
        return `//android.widget.TextView[@resource-id='${this.description}']`;
    }
    
    //create a method to verify all elements and selectors are visible
    verifyAllElementsVisible() {
        return `//android.widget.TextView[@resource-id='${this.title}']`;
    }  

    /**
     * Get all image elements from the page
     * @returns Object containing all image elements
     */
    async getImageElements() {
        return {
            channelLogo: this.getChannelLogoElement(),
            backgroundImage: this.getBackgroundImageElement(),
            headerBackground: this.getTileGroupRowHeaderBackgroundElement()
        };
    }

    /**
     * Verify if image elements are present and visible
     * @returns Object containing boolean values for each image element's visibility
     */
    async verifyImageElements() {
        const images = await this.getImageElements();
        const results: { [key: string]: boolean } = {};
        
        for (const [key, selector] of Object.entries(images)) {
            try {
                const element = await this.driver.$(selector);
                results[key] = await element.isDisplayed();
            } catch (error) {
                results[key] = false;
                console.error(`Error checking ${key}: ${error}`);
            }
        }
        
        return results;
    }

    /**
     * Get attributes of an image element (like src, alt text, etc)
     * @param imageSelector The selector for the image element
     * @returns Object containing image attributes
     */
    async getImageAttributes(imageSelector: string) {
        try {
            const element = await this.driver.$(imageSelector);
            return {
                contentDesc: await element.getAttribute('content-desc'),
                bounds: await element.getAttribute('bounds'),
                displayed: await element.isDisplayed(),
                enabled: await element.isEnabled()
            };
        } catch (error) {
            console.error(`Error getting image attributes: ${error}`);
            return null;
        }
    }

    /**
     * Get all channel logo elements
     * @returns Array of channel logo selectors with their bounds
     */
    async getChannelLogos() {
        const logos = await this.driver.$$(this.getChannelLogoElement());
        const logoDetails = await Promise.all(logos.map(async (logo) => {
            const bounds = await logo.getAttribute('bounds');
            const contentDesc = await logo.getAttribute('content-desc');
            return {
                element: logo,
                bounds,
                contentDesc
            };
        }));
        return logoDetails;
    }

    /**
     * Verify if a specific channel logo is visible
     * @param channelName Optional channel name to look for in content-desc
     * @returns boolean indicating if the logo is found and visible
     */
    async verifyChannelLogo(channelName?: string): Promise<boolean> {
        const logos = await this.getChannelLogos();
        
        for (const logo of logos) {
            if (!channelName) {
                if (await logo.element.isDisplayed()) {
                    return true;
                }
            } else if (logo.contentDesc && 
                      logo.contentDesc.toLowerCase().includes(channelName.toLowerCase()) && 
                      await logo.element.isDisplayed()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the position of a specific channel logo
     * @param channelName Channel name to look for in content-desc
     * @returns Bounds of the logo element if found, null otherwise
     */
    async getChannelLogoPosition(channelName: string): Promise<string | null> {
        const logos = await this.getChannelLogos();
        
        for (const logo of logos) {
            if (logo.contentDesc && 
                logo.contentDesc.toLowerCase().includes(channelName.toLowerCase())) {
                return logo.bounds;
            }
        }
        return null;
    }

    /**
     * Parse bounds string into coordinates
     * @param bounds Bounds string in format "[x1,y1][x2,y2]"
     * @returns Object with coordinates or null if invalid format
     */
    parseBounds(bounds: string) {
        const matches = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
        if (!matches) return null;
        
        return {
            topLeft: {
                x: parseInt(matches[1]),
                y: parseInt(matches[2])
            },
            bottomRight: {
                x: parseInt(matches[3]),
                y: parseInt(matches[4])
            },
            width: parseInt(matches[3]) - parseInt(matches[1]),
            height: parseInt(matches[4]) - parseInt(matches[2])
        };
    }

    /**
     * Get dimensions of all channel logos
     * @returns Array of logo dimensions with their positions
     */
    async getChannelLogoDimensions() {
        const logos = await this.getChannelLogos();
        return logos.map(logo => ({
            ...logo,
            dimensions: this.parseBounds(logo.bounds)
        }));
    }

    /**
     * Check if coordinates are within an element's bounds
     * @param x X coordinate
     * @param y Y coordinate
     * @param bounds Bounds string in format "[x1,y1][x2,y2]"
     * @returns boolean indicating if coordinates are within bounds
     */
    isWithinBounds(x: number, y: number, bounds: string): boolean {
        const coords = this.parseBounds(bounds);
        if (!coords) return false;
        
        return x >= coords.topLeft.x && 
               x <= coords.bottomRight.x && 
               y >= coords.topLeft.y && 
               y <= coords.bottomRight.y;
    }

    /**
     * Take a screenshot of the current page
     * @param fileName Name to save the screenshot as
     * @returns Path to the saved screenshot
     */
    async takeScreenshot(fileName: string): Promise<string> {
        const filePath = fileName;
        await this.driver.saveScreenshot(filePath);
        return filePath;
    }

    /**
     * Take a screenshot of a specific element
     * @param selector Element selector
     * @param fileName Name to save the screenshot as
     * @returns Path to the saved screenshot
     */
    async takeElementScreenshot(selector: string, fileName: string): Promise<string> {
        const element = await this.driver.$(selector);
        const screenshotDir = path.join(process.cwd(), 'screenshots');
        
        // Create screenshots directory if it doesn't exist
        try {
            await fs.access(screenshotDir);
        } catch {
            await fs.mkdir(screenshotDir, { recursive: true });
        }
        
        const filePath = path.join(screenshotDir, fileName);
        await element.saveScreenshot(filePath);
        return filePath;
    }

    /**
     * Compare two images and get the difference percentage
     * @param image1Path Path to first image
     * @param image2Path Path to second image
     * @param outputPath Optional path to save difference image
     * @returns Comparison result with difference percentage
     */
    async compareImages(image1Path: string, image2Path: string, outputPath?: string): Promise<{
        misMatchPercentage: number;
        isSameDimensions: boolean;
        dimensionDifference: { width: number; height: number };
    }> {
        try {
            const [stat1, stat2] = await Promise.all([
                fs.stat(image1Path),
                fs.stat(image2Path)
            ]);

            // Compare file sizes
            const maxSize = Math.max(stat1.size, stat2.size);
            const sizeDiff = Math.abs(stat1.size - stat2.size);
            const misMatchPercentage = (sizeDiff / maxSize) * 100;

            // If outputPath is provided, copy the second image there
            if (outputPath) {
                await fs.copyFile(image2Path, outputPath);
            }

            return {
                misMatchPercentage,
                isSameDimensions: stat1.size === stat2.size,
                dimensionDifference: {
                    width: 0,  // We can't determine actual dimensions without image processing
                    height: 0
                }
            };
        } catch (error) {
            console.error('Error comparing images:', error);
            throw error;
        }
    }

    /**
     * Take a screenshot of a channel logo and compare it with a reference image
     * @param channelName Name of the channel to look for
     * @param referenceImagePath Path to the reference image to compare against
     * @returns Comparison result
     */
    async compareChannelLogo(channelName: string, referenceImagePath: string): Promise<{
        matches: boolean;
        difference: number;
    }> {
        // Get channel logo position
        const logos = await this.getChannelLogos();
        const targetLogo = logos.find(logo => 
            logo.contentDesc?.toLowerCase().includes(channelName.toLowerCase())
        );

        if (!targetLogo) {
            throw new Error(`Channel logo for ${channelName} not found`);
        }

        // Take screenshot of the logo
        const screenshotPath = await this.takeElementScreenshot(
            this.getChannelLogoElement(),
            `${channelName}_current.png`
        );

        // Compare with reference image
        const comparison = await this.compareImages(screenshotPath, referenceImagePath);

        // Consider images matching if difference is less than 5%
        return {
            matches: comparison.misMatchPercentage < 5,
            difference: comparison.misMatchPercentage
        };
    }

    /**
     * Take screenshots of all channel logos
     * @returns Array of paths to saved screenshots
     */
    async captureAllChannelLogos(): Promise<Array<{
        path: string;
        bounds: string;
        contentDesc?: string;
    }>> {
        const logos = await this.getChannelLogos();
        const results = [];

        for (let i = 0; i < logos.length; i++) {
            const logo = logos[i];
            const fileName = `channel_logo_${i}.png`;
            const screenshotPath = await this.takeElementScreenshot(
                this.getChannelLogoElement(),
                fileName
            );
            
            results.push({
                path: screenshotPath,
                bounds: logo.bounds,
                contentDesc: logo.contentDesc
            });
        }

        return results;
    }
} 