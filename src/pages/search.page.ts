export class SearchPage {
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
} 