import type { Browser, Element } from "webdriverio";
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

export class SearchPage extends BasePage {
    theWalkingDeadUniverse(theWalkingDeadUniverse: any): boolean | PromiseLike<boolean> {
        throw new Error('Method not implemented.');
    }
    constructor(driver: Browser) {
        super(driver);
        // Initialization code
        this.driver = driver;
    }

    // Define properties for each UI element based on resource IDs
    actionBarRoot = 'com.philo.philo.google:id/action_bar_root';
    content = 'android:id/content';
    searchInput = 'com.philo.philo.google:id/search_src_text';
    searchButton = 'com.philo.philo.google:id/search_button';
    searchResultsList = 'com.philo.philo.google:id/search_results_list';
    emptyStateContainer = 'com.philo.philo.google:id/empty_state_container';
    resultItemTitle = 'com.philo.philo.google:id/result_item_title';
    resultItemDescription = 'com.philo.philo.google:id/result_item_description';
    resultItemThumbnail = 'com.philo.philo.google:id/result_item_thumbnail';
    clearSearchButton = 'com.philo.philo.google:id/clear_search_button';

    // Keypad elements
    keypadContainer = 'com.philo.philo.google:id/keypad';
    keypadButtonA = 'com.philo.philo.google:id/keypad_a';
    keypadButtonB = 'com.philo.philo.google:id/keypad_b';
    keypadButtonC = 'com.philo.philo.google:id/keypad_c';
    keypadButtonD = 'com.philo.philo.google:id/keypad_d';
    keypadButtonE = 'com.philo.philo.google:id/keypad_e';
    keypadButtonF = 'com.philo.philo.google:id/keypad_f';
    keypadButtonG = 'com.philo.philo.google:id/keypad_g';
    keypadButtonH = 'com.philo.philo.google:id/keypad_h';
    keypadButtonI = 'com.philo.philo.google:id/keypad_i';
    keypadButtonJ = 'com.philo.philo.google:id/keypad_j';
    keypadButtonK = 'com.philo.philo.google:id/keypad_k';
    keypadButtonL = 'com.philo.philo.google:id/keypad_l';
    keypadButtonM = 'com.philo.philo.google:id/keypad_m';
    keypadButtonN = 'com.philo.philo.google:id/keypad_n';
    keypadButtonO = 'com.philo.philo.google:id/keypad_o';
    keypadButtonP = 'com.philo.philo.google:id/keypad_p';
    keypadButtonQ = 'com.philo.philo.google:id/keypad_q';
    keypadButtonR = 'com.philo.philo.google:id/keypad_r';
    keypadButtonS = 'com.philo.philo.google:id/keypad_s';
    keypadButtonT = 'com.philo.philo.google:id/keypad_t';
    keypadButtonU = 'com.philo.philo.google:id/keypad_u';
    keypadButtonV = 'com.philo.philo.google:id/keypad_v';
    keypadButtonW = 'com.philo.philo.google:id/keypad_w';
    keypadButtonX = 'com.philo.philo.google:id/keypad_x';
    keypadButtonY = 'com.philo.philo.google:id/keypad_y';
    keypadButtonZ = 'com.philo.philo.google:id/keypad_z';
    keypadButton1 = 'com.philo.philo.google:id/keypad_1';
    keypadButton2 = 'com.philo.philo.google:id/keypad_2';
    keypadButton3 = 'com.philo.philo.google:id/keypad_3';
    keypadButton4 = 'com.philo.philo.google:id/keypad_4';
    keypadButton5 = 'com.philo.philo.google:id/keypad_5';
    keypadButton6 = 'com.philo.philo.google:id/keypad_6';
    keypadButton7 = 'com.philo.philo.google:id/keypad_7';
    keypadButton8 = 'com.philo.philo.google:id/keypad_8';
    keypadButton9 = 'com.philo.philo.google:id/keypad_9';
    keypadButton0 = 'com.philo.philo.google:id/keypad_0';
    keypadButtonSpace = 'com.philo.philo.google:id/keypad_space';
    keypadButtonClear = 'com.philo.philo.google:id/button_clear';
    keypadButtonBackspace = 'com.philo.philo.google:id/keypad_backspace';

    // Add these new elements
    tileGroups = 'com.philo.philo.google:id/tile_groups';
    defaultTileRow = 'com.philo.philo.google:id/default_tile_row';
    tileGroupRowHeaderLayout = 'com.philo.philo.google:id/tile_group_row_header_layout';
    buttonTileGroup = 'com.philo.philo.google:id/button_tile_group';
    labelTileGroup = 'com.philo.philo.google:id/label_tile_group';
    listViewBroadcasts = 'com.philo.philo.google:id/list_view_broadcasts';
    widgetTileWrapper = 'com.philo.philo.google:id/widget_tile_wrapper';
    tileViewWrapper = 'com.philo.philo.google:id/tile_view_wrapper';
    tileView = 'com.philo.philo.google:id/tile_view';
    pressedOverlay = 'com.philo.philo.google:id/pressed_overlay';
    channelLogo = 'com.philo.philo.google:id/channel_logo';
    favoriteIcon = 'com.philo.philo.google:id/favorite_icon';
    backgroundImage = 'com.philo.philo.google:id/background_image';
    iconPlayRadial = 'com.philo.philo.google:id/icon_play_radial';
    title = 'com.philo.philo.google:id/title';
    expandToGridIcon = 'com.philo.philo.google:id/expand_to_grid_icon';

    //Channel Show Results Elements
    channelShowResultsElements = {
        // New elements added from ui_dump_formatted.xml
        "fearTheWalkingDead": {
            "selector": "com.philo.philo.google:id/widget_tile_wrapper",
            "description": "Fear the Walking Dead",
            "type": "view"
        },
        "theWalkingDead": {
            "selector": "com.philo.philo.google:id/widget_tile_wrapper",
            "description": "The Walking Dead",
            "type": "view"
        },

        "theWalkingDeadUniverse": {
            "selector": "com.philo.philo.google:id/widget_tile_wrapper",
            "description": "The Walking Dead Universe",
            "type": "view"
        },
        "theWalkingDeadDarylDixon": {
            "selector": "com.philo.philo.google:id/widget_tile_wrapper",
            "description": "The Walking Dead: Daryl Dixon",
            "type": "view"
        },
        "theWalkingDeadWorldBeyond": {
            "selector": "com.philo.philo.google:id/widget_tile_wrapper",
            "description": "The Walking Dead: World Beyond",
            "type": "view"
        },
        "topShowsWalkingDeadChannel": {
            "selector": "com.philo.philo.google:id/list_view_broadcasts",
            "description": "Top shows on The Walking Dead Channel",
            "type": "recyclerView"
        },

        "topShowsWalkingDeadUniverse": {
            "selector": "com.philo.philo.google:id/list_view_broadcasts",
            "description": "Top shows on The Walking Dead Universe",
            "type": "recyclerView"
        },
        "bigTileTopButtons": {
            "selector": "com.philo.philo.google:id/big_tile_top_buttons_container",
            "description": "Top buttons for big tile",
            "type": "view"
        },
        episodeTitle: {
            description: "Episode Title",
            selector: "com.philo.philo.google:id/title",
            type: "textView"
        },
        airDate: {
            description: "Air Date",
            selector: "com.philo.philo.google:id/air_date",
            type: "textView"
        },
        playButton: {
            description: "Play Button",
            selector: "com.philo.philo.google:id/icon_play_radial",
            type: "imageView"
        },
        channelLogo: {
            description: "Channel Logo",
            selector: "com.philo.philo.google:id/channel_logo",
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
                await this.click(`com.philo.philo.google:id/keypad_${char}`);
            } else {
                await this.click(`com.philo.philo.google:id/keypad_${char.toLowerCase()}`);
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
            // Wait for search results to load
            await this.pause(3000);
            
            // Find all elements with label_tile_group
            const selector = `//android.widget.TextView[@resource-id='com.philo.philo.google:id/label_tile_group']`;
            console.log('Using selector:', selector);
            
            const elements = await this.driver.$$(selector);
            console.log('Found elements:', elements.length);
            
            // Get text from each element
            const texts = [];
            for (const element of elements) {
                try {
                    const text = await element.getText();
                    console.log('Found text:', text);
                    if (text) {
                        texts.push(text);
                    }
                } catch (elementError) {
                    console.error('Error getting text from element:', elementError);
                }
            }
            
            console.log('Final texts array:', texts);
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
