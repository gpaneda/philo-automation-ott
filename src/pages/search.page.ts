export class SearchPage {
    // Define properties for each UI element based on resource IDs
    actionBarRoot: string = 'com.philo.philo:id/action_bar_root';
    content: string = 'android:id/content';
    searchInput: string = 'com.philo.philo:id/search_input';
    searchButton: string = 'com.philo.philo:id/search_button';
    searchResultsList: string = 'com.philo.philo:id/search_results_list';
    emptyStateContainer: string = 'com.philo.philo:id/empty_state_container';
    resultItemTitle: string = 'com.philo.philo:id/result_item_title';
    resultItemDescription: string = 'com.philo.philo:id/result_item_description';
    resultItemThumbnail: string = 'com.philo.philo:id/result_item_thumbnail';
    clearSearchButton: string = 'com.philo.philo:id/clear_search_button';

    // Keypad elements
    keypadContainer: string = 'com.philo.philo:id/keypad_container';
    keypadButtonA: string = 'com.philo.philo:id/keypad_a';
    keypadButtonB: string = 'com.philo.philo:id/keypad_b';
    keypadButtonC: string = 'com.philo.philo:id/keypad_c';
    keypadButtonD: string = 'com.philo.philo:id/keypad_d';
    keypadButtonE: string = 'com.philo.philo:id/keypad_e';
    keypadButtonF: string = 'com.philo.philo:id/keypad_f';
    keypadButtonG: string = 'com.philo.philo:id/keypad_g';
    keypadButtonH: string = 'com.philo.philo:id/keypad_h';
    keypadButtonI: string = 'com.philo.philo:id/keypad_i';
    keypadButtonJ: string = 'com.philo.philo:id/keypad_j';
    keypadButtonK: string = 'com.philo.philo:id/keypad_k';
    keypadButtonL: string = 'com.philo.philo:id/keypad_l';
    keypadButtonM: string = 'com.philo.philo:id/keypad_m';
    keypadButtonN: string = 'com.philo.philo:id/keypad_n';
    keypadButtonO: string = 'com.philo.philo:id/keypad_o';
    keypadButtonP: string = 'com.philo.philo:id/keypad_p';
    keypadButtonQ: string = 'com.philo.philo:id/keypad_q';
    keypadButtonR: string = 'com.philo.philo:id/keypad_r';
    keypadButtonS: string = 'com.philo.philo:id/keypad_s';
    keypadButtonT: string = 'com.philo.philo:id/keypad_t';
    keypadButtonU: string = 'com.philo.philo:id/keypad_u';
    keypadButtonV: string = 'com.philo.philo:id/keypad_v';
    keypadButtonW: string = 'com.philo.philo:id/keypad_w';
    keypadButtonX: string = 'com.philo.philo:id/keypad_x';
    keypadButtonY: string = 'com.philo.philo:id/keypad_y';
    keypadButtonZ: string = 'com.philo.philo:id/keypad_z';
    keypadButton1: string = 'com.philo.philo:id/keypad_1';
    keypadButton2: string = 'com.philo.philo:id/keypad_2';
    keypadButton3: string = 'com.philo.philo:id/keypad_3';
    keypadButton4: string = 'com.philo.philo:id/keypad_4';
    keypadButton5: string = 'com.philo.philo:id/keypad_5';
    keypadButton6: string = 'com.philo.philo:id/keypad_6';
    keypadButton7: string = 'com.philo.philo:id/keypad_7';
    keypadButton8: string = 'com.philo.philo:id/keypad_8';
    keypadButton9: string = 'com.philo.philo:id/keypad_9';
    keypadButton0: string = 'com.philo.philo:id/keypad_0';
    keypadButtonSpace: string = 'com.philo.philo:id/keypad_space';
    keypadButtonClear: string = 'com.philo.philo:id/button_clear';
    keypadButtonBackspace: string = 'com.philo.philo:id/keypad_backspace';

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