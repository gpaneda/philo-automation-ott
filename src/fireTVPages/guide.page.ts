import { BasePage } from './base.page';
import { Browser } from 'webdriverio';

export class GuidePage extends BasePage {
    async isElementVisible(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed(); // Check if the element is displayed
        } catch (error) {
            console.error(`Error checking visibility of element: ${error}`);
            return false; // Return false if there's an error
        }
    }
    // Define properties for each UI element based on resource IDs
    actionBarRoot = 'com.philo.philo:id/action_bar_root';
    content = 'android:id/content';
    activityHost = 'com.philo.philo:id/activity_host';
    playerFragmentHost = 'com.philo.philo:id/player_fragment_host';
    modalFragmentHost = 'com.philo.philo:id/modal_fragment_host';
    dialogFragmentHost = 'com.philo.philo:id/dialog_fragment_host';
    fragmentHost = 'com.philo.philo:id/fragment_host';
    fragmentTileGroupList = 'com.philo.philo:id/fragment_tile_group_list';
    tileGroups = 'com.philo.philo:id/tile_groups';
    guideTileRow = 'com.philo.philo:id/guide_tile_row';
    tileGroupRowHeaderBackground = 'com.philo.philo:id/tile_group_row_header_background';
    groupHeaderLayout = 'com.philo.philo:id/group_header_layout';
    groupHeaderIcon = 'com.philo.philo:id/group_header_icon';
    groupHeaderLabel = 'com.philo.philo:id/group_header_label';
    listViewBroadcasts = 'com.philo.philo:id/list_view_broadcasts';
    imageMask = 'com.philo.philo:id/image_mask';
    pressedOverlay = 'com.philo.philo:id/pressed_overlay';
    //Details Page
    backgroundVideoContainer = 'com.philo.philo:id/background_video_container';
    metadataContainer = 'com.philo.philo:id/metadata_container';
    title = 'com.philo.philo:id/title';
    description = 'com.philo.philo:id/description';
    airDate = 'com.philo.philo:id/air_date';
    flagLive = 'com.philo.philo:id/flag_live';
    allShowings = 'android=text("All showings")';
    allEpisodes = 'android=text("All episodes")';
    rating = 'com.philo.philo:id/rating';
    runTime = 'com.philo.philo:id/run_time';
    channelLabel = 'com.philo.philo:id/channel_label';
    saveButton = 'android=text("Save")';
    playButton = 'android=text("Play")';
    unSaveButton = 'android=text("Unsave")';
    savedButton = 'android=text("Saved")';

    
    // New Selector for Free Channels
    freeChannels = 'android=text("Free channels")';

    //Guide Channel Details Page


    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    // Method to get the action bar root element
    getActionBarRootElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.actionBarRoot}']`;
    }

    // Method to get the content element
    getContentElement() {
        return `//android.view.ViewGroup[@resource-id='${this.content}']`;
    }

    // Method to get the activity host element
    getActivityHostElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.activityHost}']`;
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
        return `//android.view.ViewGroup[@resource-id='${this.fragmentTileGroupList}']`;
    }

    // Method to get the tile groups element
    getTileGroupsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.tileGroups}']`;
    }

    // Method to get the guide tile row element
    getGuideTileRowElement() {
        return `//android.view.ViewGroup[@resource-id='${this.guideTileRow}']`;
    }

    // Method to get the tile group row header background element
    getTileGroupRowHeaderBackgroundElement() {
        return `//android.widget.ImageView[@resource-id='${this.tileGroupRowHeaderBackground}']`;
    }

    // Method to get the group header layout element
    getGroupHeaderLayoutElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.groupHeaderLayout}']`;
    }

    // Method to get the group header icon element
    getGroupHeaderIconElement() {
        return `//android.widget.ImageView[@resource-id='${this.groupHeaderIcon}']`;
    }

    // Method to get the group header label element
    getGroupHeaderLabelElement() {
        return `//android.widget.TextView[@resource-id='${this.groupHeaderLabel}']`;
    }

    // Method to get the list view broadcasts element
    getListViewBroadcastsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.listViewBroadcasts}']`;
    }

    // Method to get the image mask element
    getImageMaskElement() {
        return `//android.widget.ImageView[@resource-id='${this.imageMask}']`;
    }

    // Method to get the pressed overlay element
    getPressedOverlayElement() {
        return `//android.view.View[@resource-id='${this.pressedOverlay}']`;
    }

    // Method to get the background video container element
    getBackgroundVideoContainerElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.backgroundVideoContainer}']`;
    }

    // Method to get the metadata container element
    getMetadataContainerElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.metadataContainer}']`;
    }

    // Method to get the title element
    getTitleElement() {
        return `//android.widget.TextView[@resource-id='${this.title}']`;
    }

    // Method to get the description element
    getDescriptionElement() {
        return `//android.widget.TextView[@resource-id='${this.description}']`;
    }

    // Method to get the air date element
    getAirDateElement() {
        return `//android.widget.TextView[@resource-id='${this.airDate}']`;
    }

    // Method to get the flag live element
    getFlagLiveElement() {
        return `//android.widget.TextView[@resource-id='${this.flagLive}']`;
    }

    // Method to check if Free Channels is displayed
    async isFreeChannelsDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.freeChannels);
    }
} 