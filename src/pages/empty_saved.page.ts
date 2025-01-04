export class EmptySavedPage {
    // Define properties for each UI element based on resource IDs
    actionBarRoot: string = 'com.philo.philo:id/action_bar_root';
    content: string = 'android:id/content';
    emptyStateContainer: string = 'com.philo.philo:id/empty_state_container';
    messageText: string = 'com.philo.philo:id/message_text';
    instructionText: string = 'com.philo.philo:id/instruction_text';
    iconSave: string = 'com.philo.philo:id/icon_save';
    findShowButton: string = 'com.philo.philo:id/find_show_button';

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