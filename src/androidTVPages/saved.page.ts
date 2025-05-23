export class SavedPage {
    // Define properties for each UI element based on resource IDs
    actionBarRoot = 'com.philo.philo.google:id/action_bar_root';
    content = 'android:id/content';
    savedItemsList = 'com.philo.philo.google:id/saved_items_list';
    emptyStateContainer = 'com.philo.philo.google:id/empty_state_container';
    itemTitle = 'com.philo.philo.google:id/item_title';
    itemDescription = 'com.philo.philo.google:id/item_description';
    itemThumbnail = 'com.philo.philo.google:id/item_thumbnail';
    removeButton = 'com.philo.philo.google:id/remove_button';
    watchNowButton = 'com.philo.philo.google:id/watch_now_button';

    // Method to get the action bar root element
    getActionBarRootElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.actionBarRoot}']`;
    }

    // Method to get the content element
    getContentElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.content}']`;
    }

    // Method to get the saved items list element
    getSavedItemsListElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.savedItemsList}']`;
    }

    // Method to get the empty state container element
    getEmptyStateContainerElement() {
        return `//android.view.ViewGroup[@resource-id='${this.emptyStateContainer}']`;
    }

    // Method to get the item title element
    getItemTitleElement() {
        return `//android.widget.TextView[@resource-id='${this.itemTitle}']`;
    }

    // Method to get the item description element
    getItemDescriptionElement() {
        return `//android.widget.TextView[@resource-id='${this.itemDescription}']`;
    }

    // Method to get the item thumbnail element
    getItemThumbnailElement() {
        return `//android.widget.ImageView[@resource-id='${this.itemThumbnail}']`;
    }

    // Method to get the remove button element
    getRemoveButtonElement() {
        return `//android.widget.Button[@resource-id='${this.removeButton}']`;
    }

    // Method to get the watch now button element
    getWatchNowButtonElement() {
        return `//android.widget.Button[@resource-id='${this.watchNowButton}']`;
    }
} 