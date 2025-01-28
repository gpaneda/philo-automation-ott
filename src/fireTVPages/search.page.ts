import { Browser } from "webdriverio";
import { BasePage } from "./base.page";
import { HomeScreenPage } from "./homescreen.page";

type ChannelShowResultsElementNames = 
    | 'fearTheWalkingDead'
    | 'theWalkingDead'
    | 'theWalkingDeadUniverse'
    | 'theWalkingDeadDarylDixon'
    | 'theWalkingDeadWorldBeyond'
    | 'topShowsWalkingDeadChannel'
    | 'bigTileTopButtons'
    | 'topShowsWalkingDeadUniverse'
    | 'episodeTitle'
    | 'airDate'
    | 'playButton'
    | 'channelLogo';

export class SearchPage extends BasePage    {
    theWalkingDeadUniverse(theWalkingDeadUniverse: any): boolean | PromiseLike<boolean> {
        throw new Error('Method not implemented.');
    }
    constructor(driver: Browser<'async'>) {
        super(driver);
        // Initialization code
        this.driver = driver;
    }
    
    // Define properties for each UI element based on resource IDs
    actionBarRoot = 'com.philo.philo:id/action_bar_root';
    content = 'android:id/content';
    searchInput = 'com.philo.philo:id/search_input';
    searchButton = 'com.philo.philo:id/search_button';
    searchResultsList = 'com.philo.philo:id/search_results_list';
    emptyStateContainer = 'com.philo.philo:id/empty_state_container';
    resultItemTitle = 'com.philo.philo:id/result_item_title';
    resultItemDescription = 'com.philo.philo:id/result_item_description';
    resultItemThumbnail = 'com.philo.philo:id/result_item_thumbnail';
    clearSearchButton = 'com.philo.philo:id/clear_search_button';

    // Keypad elements
    keypadContainer = 'com.philo.philo:id/keypad_container';
    keypadButtonA = 'com.philo.philo:id/keypad_a';
    keypadButtonB = 'com.philo.philo:id/keypad_b';
    keypadButtonC = 'com.philo.philo:id/keypad_c';
    keypadButtonD = 'com.philo.philo:id/keypad_d';
    keypadButtonE = 'com.philo.philo:id/keypad_e';
    keypadButtonF = 'com.philo.philo:id/keypad_f';
    keypadButtonG = 'com.philo.philo:id/keypad_g';
    keypadButtonH = 'com.philo.philo:id/keypad_h';
    keypadButtonI = 'com.philo.philo:id/keypad_i';
    keypadButtonJ = 'com.philo.philo:id/keypad_j';
    keypadButtonK = 'com.philo.philo:id/keypad_k';
    keypadButtonL = 'com.philo.philo:id/keypad_l';
    keypadButtonM = 'com.philo.philo:id/keypad_m';
    keypadButtonN = 'com.philo.philo:id/keypad_n';
    keypadButtonO = 'com.philo.philo:id/keypad_o';
    keypadButtonP = 'com.philo.philo:id/keypad_p';
    keypadButtonQ = 'com.philo.philo:id/keypad_q';
    keypadButtonR = 'com.philo.philo:id/keypad_r';
    keypadButtonS = 'com.philo.philo:id/keypad_s';
    keypadButtonT = 'com.philo.philo:id/keypad_t';
    keypadButtonU = 'com.philo.philo:id/keypad_u';
    keypadButtonV = 'com.philo.philo:id/keypad_v';
    keypadButtonW = 'com.philo.philo:id/keypad_w';
    keypadButtonX = 'com.philo.philo:id/keypad_x';
    keypadButtonY = 'com.philo.philo:id/keypad_y';
    keypadButtonZ = 'com.philo.philo:id/keypad_z';
    keypadButton1 = 'com.philo.philo:id/keypad_1';
    keypadButton2 = 'com.philo.philo:id/keypad_2';
    keypadButton3 = 'com.philo.philo:id/keypad_3';
    keypadButton4 = 'com.philo.philo:id/keypad_4';
    keypadButton5 = 'com.philo.philo:id/keypad_5';
    keypadButton6 = 'com.philo.philo:id/keypad_6';
    keypadButton7 = 'com.philo.philo:id/keypad_7';
    keypadButton8 = 'com.philo.philo:id/keypad_8';
    keypadButton9 = 'com.philo.philo:id/keypad_9';
    keypadButton0 = 'com.philo.philo:id/keypad_0';
    keypadButtonSpace = 'com.philo.philo:id/keypad_space';
    keypadButtonClear = 'com.philo.philo:id/button_clear';
    keypadButtonBackspace = 'com.philo.philo:id/keypad_backspace';

    // Add these new elements
    tileGroups = 'com.philo.philo:id/tile_groups';
    defaultTileRow = 'com.philo.philo:id/default_tile_row';
    tileGroupRowHeaderLayout = 'com.philo.philo:id/tile_group_row_header_layout';
    buttonTileGroup = 'com.philo.philo:id/button_tile_group';
    labelTileGroup = 'com.philo.philo:id/label_tile_group';
    listViewBroadcasts = 'com.philo.philo:id/list_view_broadcasts';
    widgetTileWrapper = 'com.philo.philo:id/widget_tile_wrapper';
    tileViewWrapper = 'com.philo.philo:id/tile_view_wrapper';
    tileView = 'com.philo.philo:id/tile_view';
    pressedOverlay = 'com.philo.philo:id/pressed_overlay';
    channelLogo = 'com.philo.philo:id/channel_logo';
    favoriteIcon = 'com.philo.philo:id/favorite_icon';
    backgroundImage = 'com.philo.philo:id/background_image';
    iconPlayRadial = 'com.philo.philo:id/icon_play_radial';
    title = 'com.philo.philo:id/title';
    expandToGridIcon = 'com.philo.philo:id/expand_to_grid_icon';

    //Channel Show Results Elements
    channelShowResultsElements = {
        // New elements added from ui_dump_formatted.xml
        "fearTheWalkingDead": {
            "selector": "com.philo.philo:id/widget_tile_wrapper",
            "description": "Fear the Walking Dead",
            "type": "view"
        },
        "theWalkingDead": {
            "selector": "com.philo.philo:id/widget_tile_wrapper",
            "description": "The Walking Dead",
            "type": "view"
        },

        "theWalkingDeadUniverse": {
            "selector": "com.philo.philo:id/widget_tile_wrapper",
            "description": "The Walking Dead Universe",
            "type": "view"
        },
        "theWalkingDeadDarylDixon": {
            "selector": "com.philo.philo:id/widget_tile_wrapper",
            "description": "The Walking Dead: Daryl Dixon",
            "type": "view"
        },
        "theWalkingDeadWorldBeyond": {
            "selector": "com.philo.philo:id/widget_tile_wrapper",
            "description": "The Walking Dead: World Beyond",
            "type": "view"
        },
        "topShowsWalkingDeadChannel": {
            "selector": "com.philo.philo:id/list_view_broadcasts",
            "description": "Top shows on The Walking Dead Channel",
            "type": "recyclerView"
        },

        "topShowsWalkingDeadUniverse": {
            "selector": "com.philo.philo:id/list_view_broadcasts",
            "description": "Top shows on The Walking Dead Universe",
            "type": "recyclerView"
        },
        "bigTileTopButtons": {
            "selector": "com.philo.philo:id/big_tile_top_buttons_container",
            "description": "Top buttons for big tile",
            "type": "view"
        },  
        episodeTitle: {
            description: "Episode Title",
            selector: "com.philo.philo:id/title", 
            type: "textView"
        },
        airDate: {
            description: "Air Date",
            selector: "com.philo.philo:id/air_date", 
            type: "textView"
        },
        playButton: {
            description: "Play Button",
            selector: "com.philo.philo:id/icon_play_radial",
            type: "imageView"
        },
        channelLogo: {
            description: "Channel Logo",
            selector: "com.philo.philo:id/channel_logo", 
            type: "imageView"
        },

        
    }

    // Method to get the action bar root element
    getActionBarRootElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.actionBarRoot}']`;
    }

    // Method to get the content element
    getContentElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.content}']`;
    }

    // Method to get the search input element
    getSearchInputElement() {
        return `//android.widget.EditText[@resource-id='${this.searchInput}']`;
    }

    // Method to get the search button element
    getSearchButtonElement() {
        return `//android.widget.Button[@resource-id='${this.searchButton}']`;
    }

    // Method to get the search results list element
    getSearchResultsListElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.searchResultsList}']`;
    }

    // Method to get the empty state container element
    getEmptyStateContainerElement() {
        return `//android.view.ViewGroup[@resource-id='${this.emptyStateContainer}']`;
    }

    // Method to get the result item title element
    getResultItemTitleElement() {
        return `//android.widget.TextView[@resource-id='${this.resultItemTitle}']`;
    }

    // Method to get the result item description element
    getResultItemDescriptionElement() {
        return `//android.widget.TextView[@resource-id='${this.resultItemDescription}']`;
    }

    // Method to get the result item thumbnail element
    getResultItemThumbnailElement() {
        return `//android.widget.ImageView[@resource-id='${this.resultItemThumbnail}']`;
    }

    // Method to get the clear search button element
    getClearSearchButtonElement() {
        return `//android.widget.Button[@resource-id='${this.clearSearchButton}']`;
    }

    // Method to get the keypad container element
    getKeypadContainerElement() {
        return `//android.view.ViewGroup[@resource-id='${this.keypadContainer}']`;
    }

    // Method to get a specific keypad button element
    getKeypadButtonElement(buttonId: string) {
        return `//android.widget.Button[@resource-id='${buttonId}']`;
    }

    // Add corresponding getter methods
    getTileGroupsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.tileGroups}']`;
    }

    getDefaultTileRowElement() {
        return `//android.view.ViewGroup[@resource-id='${this.defaultTileRow}']`;
    }

    getLabelTileGroupElement() {
        return `//android.widget.TextView[@resource-id='${this.labelTileGroup}']`;
    }

    getListViewBroadcastsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.listViewBroadcasts}']`;
    }

    getTileViewElement() {
        return `//android.view.ViewGroup[@resource-id='${this.tileView}']`;
    }

    getChannelLogoElement() {
        return `//android.widget.ImageView[@resource-id='${this.channelLogo}']`;
    }

    getTitleElement() {
        return `//android.widget.TextView[@resource-id='${this.title}']`;
    }

    async enterSearchTerm(term: string): Promise<void> {
        // Convert the term to uppercase since the keyboard has uppercase letters
        const upperTerm = term.toUpperCase();
        
        for (const char of upperTerm) {
            if (char === ' ') {
                await this.click(this.keypadButtonSpace);
            } else if (/[0-9]/.test(char)) {
                await this.click(`com.philo.philo:id/keypad_${char}`);
            } else {
                await this.click(`com.philo.philo:id/keypad_${char.toLowerCase()}`);
            }
            await this.pause(100); // Small delay between keypresses
        }
    }

    async clearInput(): Promise<void> {
        const input = await this.driver.$(this.searchInput);
        const text = await input.getText();
        for (let i = 0; i < text.length; i++) {
            await this.click(this.keypadButtonBackspace);
            await this.pause(100);
        }
    }

    // Add these helper methods
    async click(elementId: string): Promise<void> {
        const element = await this.driver.$(`//*[@resource-id='${elementId}']`);
        await element.click();
    }

    async pause(ms: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    async isElementDisplayed(elementId: string): Promise<boolean> {
        try {
            const element = await this.driver.$(`//*[@resource-id='${elementId}']`);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async getHeaderText(): Promise<string[]> {
        try {
            const elements = await this.driver.$$(`//*[@resource-id='${this.labelTileGroup}']`);
            const texts = await Promise.all(elements.map(element => element.getText()));
            return texts;
        } catch (error) {
            console.error('Failed to get header texts:', error);
            return [];
        }
    }
    async navigateToSearchAndVerify() {
        const homeScreen = new HomeScreenPage(this.driver);
        await homeScreen.pressUpButton();
        await this.pause(3000);
        await homeScreen.navigateToSearch();
        expect(await homeScreen.isElementDisplayed(homeScreen.selectors.topNavSearch)).toBe(true);
    }

    async interactWithSearchResults() {
        const homeScreen = new HomeScreenPage(this.driver);
        expect(await this.isElementDisplayed(this.expandToGridIcon)).toBe(true);
        await homeScreen.pressLeftButton(); // Assuming homeScreen is accessible
        await homeScreen.pressEnterButton();
        await this.driver.pause(3000); // Assuming driver is accessible
    }
    getElement(elementName: ChannelShowResultsElementNames) {
        const element = this.channelShowResultsElements[elementName];
        if (element) {
            return this.driver.$(`//*[@resource-id='${element.selector}' or @content-desc='${element.description}']`);
        }
        throw new Error(`Element ${elementName} not found`);
    }

    // Example usage of get and verify methods
    async verifyAllElements() {
        for (const key in this.channelShowResultsElements) {
            await this.verifyElementDisplayed(key);
        }
    }
}
    