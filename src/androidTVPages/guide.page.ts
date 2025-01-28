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
    actionBarRoot = 'com.philo.philo.google:id/action_bar_root';
    content = 'android:id/content';
    activityHost = 'com.philo.philo.google:id/activity_host';
    playerFragmentHost = 'com.philo.philo.google:id/player_fragment_host';
    modalFragmentHost = 'com.philo.philo.google:id/modal_fragment_host';
    dialogFragmentHost = 'com.philo.philo.google:id/dialog_fragment_host';
    fragmentHost = 'com.philo.philo.google:id/fragment_host';
    fragmentTileGroupList = 'com.philo.philo.google:id/fragment_tile_group_list';
    tileGroups = 'com.philo.philo.google:id/tile_groups';
    guideTileRow = 'com.philo.philo.google:id/guide_tile_row';
    tileGroupRowHeaderBackground = 'com.philo.philo.google:id/tile_group_row_header_background';
    groupHeaderLayout = 'com.philo.philo.google:id/group_header_layout';
    groupHeaderIcon = 'com.philo.philo.google:id/group_header_icon';
    groupHeaderLabel = 'com.philo.philo.google:id/group_header_label';
    listViewBroadcasts = 'com.philo.philo.google:id/list_view_broadcasts';
    imageMask = 'com.philo.philo.google:id/image_mask';
    pressedOverlay = 'com.philo.philo.google:id/pressed_overlay';
    backgroundVideoContainer = 'com.philo.philo.google:id/background_video_container';
    metadataContainer = 'com.philo.philo.google:id/metadata_container';
    title = 'com.philo.philo.google:id/title';
    subtitle = 'com.philo.philo.google:id/subtitle';
    description = 'com.philo.philo.google:id/description';
    airDate = 'com.philo.philo.google:id/air_date';
    flagLive = 'com.philo.philo.google:id/flag_live';
    iconPlayRadial = 'com.philo.philo.google:id/icon_play_radial';
    channelLogo = 'com.philo.philo.google:id/channel_logo';
    buttonTileGroup = 'com.philo.philo.google:id/button_tile_group';
    tileGroupRowHeaderLayout = 'com.philo.philo.google:id/tile_group_row_header_layout';
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

    // New Selector for Free Channels
    freeChannels = 'android=text("Free channels")';

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

    // Method to get the subtitle element
    getSubtitleElement() {
        return `//android.widget.TextView[@resource-id='${this.subtitle}']`;
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

    // Method to get the icon play radial element
    getIconPlayRadialElement() {
        return `//android.view.View[@resource-id='${this.iconPlayRadial}']`;
    }

    // Method to get the channel logo element
    getChannelLogoElement() {
        return `//android.widget.ImageView[@resource-id='${this.channelLogo}']`;
    }

    // Method to get the button tile group element
    getButtonTileGroupElement() {
        return `//android.view.ViewGroup[@resource-id='${this.buttonTileGroup}']`;
    }

    // Method to get the tile group row header layout element
    getTileGroupRowHeaderLayoutElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tileGroupRowHeaderLayout}']`;
    }

    // Method to get the fragment tabs element
    getFragmentTabsElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.fragmentTabs}']`;
    }

    // Method to get the widget tabs element
    getWidgetTabsElement() {
        return `//android.view.ViewGroup[@resource-id='${this.widgetTabs}']`;
    }

    // Method to get the tab bar element
    getTabBarElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.tabBar}']`;
    }

    // Method to get the tab home element
    getTabHomeElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tabHome}']`;
    }

    // Method to get the tab guide element
    getTabGuideElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tabGuide}']`;
    }

    // Method to get the tab top element
    getTabTopElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tabTop}']`;
    }

    // Method to get the tab saved element
    getTabSavedElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tabSaved}']`;
    }

    // Method to get the tab search element
    getTabSearchElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tabSearch}']`;
    }

    // Method to get the tab profile element
    getTabProfileElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tabProfile}']`;
    }

    // Method to get the label tab element
    getLabelTabElement() {
        return `//android.widget.TextView[@resource-id='${this.labelTab}']`;
    }

    // Method to get the icon tab element
    getIconTabElement() {
        return `//android.widget.ImageView[@resource-id='${this.iconTab}']`;
    }

    // Method to get the tab bar time element
    getTabBarTimeElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.tabBarTime}']`;
    }

    // Method to get the tab bar time label element
    getTabBarTimeLabelElement() {
        return `//android.widget.TextView[@resource-id='${this.tabBarTimeLabel}']`;
    }

    // Method to check if Free Channels is displayed
    async isFreeChannelsDisplayed(): Promise<boolean> {
        return await this.isElementVisible(this.freeChannels);
    }
} 