export class SavedPage {
    // Root Elements
    actionBarRoot = 'com.philo.philo.google:id/action_bar_root';
    content = 'android:id/content';
    
    // List and Grid Elements
    savedItemsList = 'com.philo.philo.google:id/list_view_broadcasts';
    gridContainer = 'com.philo.philo.google:id/fragment_grid_or_list';
    tileGroups = 'com.philo.philo.google:id/tile_groups';
    
    // Header Elements
    headerWhitespace = 'com.philo.philo.google:id/header_whitespace';
    iconTileGroup = 'com.philo.philo.google:id/icon_tile_group';
    labelTileGroup = 'com.philo.philo.google:id/label_tile_group';
    
    // Sort Elements
    sorterContainer = 'com.philo.philo.google:id/sorter_container';
    layoutSorters = 'com.philo.philo.google:id/layout_sorters';
    layoutSortings = 'com.philo.philo.google:id/layout_sortings';
    labelPageFilter = 'com.philo.philo.google:id/label_page_filter';
    
    // Item Elements
    backgroundImage = 'com.philo.philo.google:id/background_image';
    pressedOverlay = 'com.philo.philo.google:id/pressed_overlay';
    flagNew = 'com.philo.philo.google:id/flag_new';

    // Method to get the action bar root element
    getActionBarRootElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.actionBarRoot}']`;
    }

    // Method to get the content element
    getContentElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.content}']`;
    }

    // Method to get the saved items list element
    getSavedItemsListElement() {
        return `//android.widget.GridView[@resource-id='${this.savedItemsList}']`;
    }

    // Method to get the grid container element
    getGridContainerElement() {
        return `//android.widget.FrameLayout[@resource-id='${this.gridContainer}']`;
    }

    // Method to get the tile groups element
    getTileGroupsElement() {
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id='${this.tileGroups}']`;
    }

    // Method to get the header whitespace element
    getHeaderWhitespaceElement() {
        return `//android.view.ViewGroup[@resource-id='${this.headerWhitespace}']`;
    }

    // Method to get the icon tile group element
    getIconTileGroupElement() {
        return `//android.widget.ImageView[@resource-id='${this.iconTileGroup}']`;
    }

    // Method to get the label tile group element
    getLabelTileGroupElement() {
        return `//android.widget.TextView[@resource-id='${this.labelTileGroup}']`;
    }

    // Method to get the sorter container element
    getSorterContainerElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.sorterContainer}']`;
    }

    // Method to get the layout sorters element
    getLayoutSortersElement() {
        return `//android.widget.HorizontalScrollView[@resource-id='${this.layoutSorters}']`;
    }

    // Method to get the layout sortings element
    getLayoutSortingsElement() {
        return `//android.widget.LinearLayout[@resource-id='${this.layoutSortings}']`;
    }

    // Method to get the label page filter element
    getLabelPageFilterElement() {
        return `//android.widget.TextView[@resource-id='${this.labelPageFilter}']`;
    }

    // Method to get the background image element
    getBackgroundImageElement() {
        return `//android.widget.ImageView[@resource-id='${this.backgroundImage}']`;
    }

    // Method to get the pressed overlay element
    getPressedOverlayElement() {
        return `//android.view.View[@resource-id='${this.pressedOverlay}']`;
    }

    // Method to get the flag new element
    getFlagNewElement() {
        return `//android.widget.TextView[@resource-id='${this.flagNew}']`;
    }
} 