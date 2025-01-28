export class EmptySavedPage {
    // Define properties for each UI element based on resource IDs
    actionBarRoot = 'com.philo.philo.google:id/action_bar_root';
    content = 'android:id/content';
    emptyStateContainer = 'com.philo.philo.google:id/alternate_view_empty';
    messageText = 'com.philo.philo.google:id/line_1_begin';
    instructionText = 'com.philo.philo.google:id/line_0';
    iconSave = 'com.philo.philo.google:id/icon_save';
    findShowButton = 'com.philo.philo.google:id/tab_search';

    // Method to get the action bar root element
    getActionBarRootElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.actionBarRoot}']`;
    }

    // Method to get the content element
    getContentElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.content}']`;
    }

    // Method to get the empty state container element
    getEmptyStateContainerElement() {
        return `//android.view.ViewGroup[@resource-id='${this.emptyStateContainer}']`;
    }

    // Method to get the message text element
    getMessageTextElement() {
        return `//android.widget.TextView[@resource-id='${this.messageText}']`;
    }

    // Method to get the instruction text element
    getInstructionTextElement() {
        return `//android.widget.TextView[@resource-id='${this.instructionText}']`;
    }

    // Method to get the save icon element
    getIconSaveElement() {
        return `//android.widget.ImageView[@resource-id='${this.iconSave}']`;
    }

    // Method to get the find show button element
    getFindShowButtonElement() {
        return `//android.widget.Button[@resource-id='${this.findShowButton}']`;
    }
} 