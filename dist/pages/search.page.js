"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPage = void 0;
class SearchPage {
    constructor() {
        // Define properties for each UI element based on resource IDs
        this.actionBarRoot = 'com.philo.philo:id/action_bar_root';
        this.content = 'android:id/content';
        this.searchInput = 'com.philo.philo:id/search_input';
        this.searchButton = 'com.philo.philo:id/search_button';
        this.searchResultsList = 'com.philo.philo:id/search_results_list';
        this.emptyStateContainer = 'com.philo.philo:id/empty_state_container';
        this.resultItemTitle = 'com.philo.philo:id/result_item_title';
        this.resultItemDescription = 'com.philo.philo:id/result_item_description';
        this.resultItemThumbnail = 'com.philo.philo:id/result_item_thumbnail';
        this.clearSearchButton = 'com.philo.philo:id/clear_search_button';
        // Keypad elements
        this.keypadContainer = 'com.philo.philo:id/keypad_container';
        this.keypadButtonA = 'com.philo.philo:id/keypad_a';
        this.keypadButtonB = 'com.philo.philo:id/keypad_b';
        this.keypadButtonC = 'com.philo.philo:id/keypad_c';
        this.keypadButtonD = 'com.philo.philo:id/keypad_d';
        this.keypadButtonE = 'com.philo.philo:id/keypad_e';
        this.keypadButtonF = 'com.philo.philo:id/keypad_f';
        this.keypadButtonG = 'com.philo.philo:id/keypad_g';
        this.keypadButtonH = 'com.philo.philo:id/keypad_h';
        this.keypadButtonI = 'com.philo.philo:id/keypad_i';
        this.keypadButtonJ = 'com.philo.philo:id/keypad_j';
        this.keypadButtonK = 'com.philo.philo:id/keypad_k';
        this.keypadButtonL = 'com.philo.philo:id/keypad_l';
        this.keypadButtonM = 'com.philo.philo:id/keypad_m';
        this.keypadButtonN = 'com.philo.philo:id/keypad_n';
        this.keypadButtonO = 'com.philo.philo:id/keypad_o';
        this.keypadButtonP = 'com.philo.philo:id/keypad_p';
        this.keypadButtonQ = 'com.philo.philo:id/keypad_q';
        this.keypadButtonR = 'com.philo.philo:id/keypad_r';
        this.keypadButtonS = 'com.philo.philo:id/keypad_s';
        this.keypadButtonT = 'com.philo.philo:id/keypad_t';
        this.keypadButtonU = 'com.philo.philo:id/keypad_u';
        this.keypadButtonV = 'com.philo.philo:id/keypad_v';
        this.keypadButtonW = 'com.philo.philo:id/keypad_w';
        this.keypadButtonX = 'com.philo.philo:id/keypad_x';
        this.keypadButtonY = 'com.philo.philo:id/keypad_y';
        this.keypadButtonZ = 'com.philo.philo:id/keypad_z';
        this.keypadButton1 = 'com.philo.philo:id/keypad_1';
        this.keypadButton2 = 'com.philo.philo:id/keypad_2';
        this.keypadButton3 = 'com.philo.philo:id/keypad_3';
        this.keypadButton4 = 'com.philo.philo:id/keypad_4';
        this.keypadButton5 = 'com.philo.philo:id/keypad_5';
        this.keypadButton6 = 'com.philo.philo:id/keypad_6';
        this.keypadButton7 = 'com.philo.philo:id/keypad_7';
        this.keypadButton8 = 'com.philo.philo:id/keypad_8';
        this.keypadButton9 = 'com.philo.philo:id/keypad_9';
        this.keypadButton0 = 'com.philo.philo:id/keypad_0';
        this.keypadButtonSpace = 'com.philo.philo:id/keypad_space';
        this.keypadButtonClear = 'com.philo.philo:id/button_clear';
        this.keypadButtonBackspace = 'com.philo.philo:id/keypad_backspace';
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
    getKeypadButtonElement(buttonId) {
        return `//android.widget.Button[@resource-id='${buttonId}']`;
    }
}
exports.SearchPage = SearchPage;
