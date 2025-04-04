# Suitest Studio Selectors

## Common Elements

### Fire TV Selectors

```javascript
// Action Bar Elements
{
    "actionBarRoot": "android=resourceId(\"com.philo.philo:id/action_bar_root\")",
    "actionBarTitle": "android=resourceId(\"com.philo.philo:id/action_bar_title\")",
    "actionBarBackButton": "android=resourceId(\"com.philo.philo:id/action_bar_back_button\")"
}

// Content Containers
{
    "content": "android=resourceId(\"com.philo.philo:id/content\")",
    "contentContainer": "android=resourceId(\"com.philo.philo:id/content_container\")"
}

// Navigation Elements
{
    "tabBar": "android=resourceId(\"com.philo.philo:id/tab_bar\")",
    "tabHome": "android=resourceId(\"com.philo.philo:id/tab_home\")",
    "tabGuide": "android=resourceId(\"com.philo.philo:id/tab_guide\")",
    "tabTop": "android=resourceId(\"com.philo.philo:id/tab_top\")",
    "tabSaved": "android=resourceId(\"com.philo.philo:id/tab_saved\")",
    "tabSearch": "android=resourceId(\"com.philo.philo:id/tab_search\")",
    "tabProfile": "android=resourceId(\"com.philo.philo:id/tab_profile\")"
}

// Button Elements
{
    "playButton": "android=resourceId(\"com.philo.philo:id/play_button\")",
    "saveButton": "android=resourceId(\"com.philo.philo:id/save_button\")",
    "unSaveButton": "android=resourceId(\"com.philo.philo:id/unsave_button\")",
    "savedButton": "android=resourceId(\"com.philo.philo:id/saved_button\")"
}

// Background Elements
{
    "backgroundImage": "android=resourceId(\"com.philo.philo:id/big_tile_background_image_view\")",
    "backgroundVideo": "android=resourceId(\"com.philo.philo:id/big_tile_background_video_view\")",
    "backgroundGradient": "android=resourceId(\"com.philo.philo:id/big_tile_gradient_layer_view\")"
}

// Container Elements
{
    "detailsContainer": "android=resourceId(\"com.philo.philo:id/big_tile_item_details_container\")",
    "otherInfoContainer": "android=resourceId(\"com.philo.philo:id/other_information_container\")",
    "buttonsContainer": "android=resourceId(\"com.philo.philo:id/big_tile_buttons_container\")"
}
```

### Android TV Selectors

```javascript
// Action Bar Elements
{
    "actionBarRoot": "android=resourceId(\"com.philo.philo.google:id/action_bar_root\")",
    "actionBarTitle": "android=resourceId(\"com.philo.philo.google:id/action_bar_title\")",
    "actionBarBackButton": "android=resourceId(\"com.philo.philo.google:id/action_bar_back_button\")"
}

// Content Containers
{
    "content": "android=resourceId(\"com.philo.philo.google:id/content\")",
    "contentContainer": "android=resourceId(\"com.philo.philo.google:id/content_container\")"
}

// Navigation Elements
{
    "tabBar": "android=resourceId(\"com.philo.philo.google:id/tab_bar\")",
    "tabHome": "android=resourceId(\"com.philo.philo.google:id/tab_home\")",
    "tabGuide": "android=resourceId(\"com.philo.philo.google:id/tab_guide\")",
    "tabTop": "android=resourceId(\"com.philo.philo.google:id/tab_top\")",
    "tabSaved": "android=resourceId(\"com.philo.philo.google:id/tab_saved\")",
    "tabSearch": "android=resourceId(\"com.philo.philo.google:id/tab_search\")",
    "tabProfile": "android=resourceId(\"com.philo.philo.google:id/tab_profile\")"
}

// Button Elements
{
    "playButton": "android=resourceId(\"com.philo.philo.google:id/play_button\")",
    "saveButton": "android=resourceId(\"com.philo.philo.google:id/save_button\")",
    "unSaveButton": "android=resourceId(\"com.philo.philo.google:id/unsave_button\")",
    "savedButton": "android=resourceId(\"com.philo.philo.google:id/saved_button\")"
}

// Background Elements
{
    "backgroundImage": "android=resourceId(\"com.philo.philo.google:id/big_tile_background_image_view\")",
    "backgroundVideo": "android=resourceId(\"com.philo.philo.google:id/big_tile_background_video_view\")",
    "backgroundGradient": "android=resourceId(\"com.philo.philo.google:id/big_tile_gradient_layer_view\")"
}

// Container Elements
{
    "detailsContainer": "android=resourceId(\"com.philo.philo.google:id/big_tile_item_details_container\")",
    "otherInfoContainer": "android=resourceId(\"com.philo.philo.google:id/other_information_container\")",
    "buttonsContainer": "android=resourceId(\"com.philo.philo.google:id/big_tile_buttons_container\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Action bar elements are used for navigation and titles
   - Content containers are used for main content areas
   - Navigation elements are used for tab-based navigation
   - Button elements are used for common actions
   - Background elements are used for visual effects
   - Container elements are used for organizing UI components

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Action bar elements are used for navigation and titles
   - Content containers are used for main content areas
   - Navigation elements are used for tab-based navigation
   - Button elements are used for common actions
   - Background elements are used for visual effects
   - Container elements are used for organizing UI components

3. Common Actions:
   - Navigate back: Use action bar back button
   - Switch tabs: Use navigation elements
   - Play content: Use play button
   - Save content: Use save button
   - View content: Use content containers
   - Access details: Use details container

4. Verification:
   - Action bar should be visible and functional
   - Content should be properly displayed in containers
   - Navigation should be accessible
   - Buttons should be clickable
   - Background elements should be visible
   - Container elements should be properly structured

## Login Page

### Fire TV Selectors

```javascript
// Login Form Elements
{
    "emailInput": "android=resourceId(\"com.philo.philo:id/email_input\")",
    "passwordInput": "android=resourceId(\"com.philo.philo:id/password_input\")",
    "loginButton": "android=resourceId(\"com.philo.philo:id/login_button\")",
    "forgotPasswordLink": "android=resourceId(\"com.philo.philo:id/forgot_password_link\")",
    "createAccountLink": "android=resourceId(\"com.philo.philo:id/create_account_link\")"
}

// Error Messages
{
    "errorMessage": "android=resourceId(\"com.philo.philo:id/error_message\")",
    "emailError": "android=resourceId(\"com.philo.philo:id/email_error\")",
    "passwordError": "android=resourceId(\"com.philo.philo:id/password_error\")"
}
```

### Android TV Selectors

```javascript
// Login Form Elements
{
    "emailInput": "android=resourceId(\"com.philo.philo.google:id/email_input\")",
    "passwordInput": "android=resourceId(\"com.philo.philo.google:id/password_input\")",
    "loginButton": "android=resourceId(\"com.philo.philo.google:id/login_button\")",
    "forgotPasswordLink": "android=resourceId(\"com.philo.philo.google:id/forgot_password_link\")",
    "createAccountLink": "android=resourceId(\"com.philo.philo.google:id/create_account_link\")"
}

// Error Messages
{
    "errorMessage": "android=resourceId(\"com.philo.philo.google:id/error_message\")",
    "emailError": "android=resourceId(\"com.philo.philo.google:id/email_error\")",
    "passwordError": "android=resourceId(\"com.philo.philo.google:id/password_error\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Login form elements are used for authentication
   - Error messages are used for validation feedback

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Login form elements are used for authentication
   - Error messages are used for validation feedback

3. Common Actions:
   - Enter email: Use email input
   - Enter password: Use password input
   - Submit login: Use login button
   - Reset password: Use forgot password link
   - Create account: Use create account link

4. Verification:
   - Login form should be visible and functional
   - Error messages should display when appropriate
   - Navigation should work correctly

## Base Page

### Common Methods

```javascript
// Element Interaction Methods
{
    "waitForElement": "async waitForElement(selector: string, timeout: number = 10000)",
    "isElementDisplayed": "async isElementDisplayed(selector: string)",
    "click": "async click(selector: string)",
    "getText": "async getText(selector: string)",
    "verifyElementDisplayed": "async verifyElementDisplayed(selector: string)",
    "verifyElementWithText": "async verifyElementWithText(selector: string, text: string)"
}

// Selector Interface
{
    "id": "string",
    "text": "string",
    "contentDesc": "string",
    "className": "string",
    "clickable": "boolean",
    "enabled": "boolean",
    "bounds": "string"
}
```

### Usage Notes

1. Common Methods:
   - `waitForElement`: Waits for an element to be present
   - `isElementDisplayed`: Checks if an element is displayed
   - `click`: Clicks on an element
   - `getText`: Retrieves text from an element
   - `verifyElementDisplayed`: Verifies an element is displayed
   - `verifyElementWithText`: Verifies an element has specific text

2. Selector Interface:
   - `id`: Resource ID of the element
   - `text`: Text content of the element
   - `contentDesc`: Content description of the element
   - `className`: Class name of the element
   - `clickable`: Whether the element is clickable
   - `enabled`: Whether the element is enabled
   - `bounds`: Bounds of the element

3. Common Actions:
   - Wait for elements to be present
   - Check element visibility
   - Click on elements
   - Get text from elements
   - Verify element presence
   - Verify element text

4. Verification:
   - Elements should be present
   - Elements should be visible
   - Elements should be clickable
   - Elements should have correct text

## Empty Saved Page

### Fire TV Selectors

```javascript
// Empty State Elements
{
    "emptyStateContainer": "android=resourceId(\"com.philo.philo:id/empty_state_container\")",
    "messageText": "android=resourceId(\"com.philo.philo:id/message_text\")",
    "instructionText": "android=resourceId(\"com.philo.philo:id/instruction_text\")",
    "iconSave": "android=resourceId(\"com.philo.philo:id/icon_save\")",
    "findShowButton": "android=resourceId(\"com.philo.philo:id/find_show_button\")"
}
```

### Android TV Selectors

```javascript
// Empty State Elements
{
    "emptyStateContainer": "android=resourceId(\"com.philo.philo.google:id/empty_state_container\")",
    "messageText": "android=resourceId(\"com.philo.philo.google:id/message_text\")",
    "instructionText": "android=resourceId(\"com.philo.philo.google:id/instruction_text\")",
    "iconSave": "android=resourceId(\"com.philo.philo.google:id/icon_save\")",
    "findShowButton": "android=resourceId(\"com.philo.philo.google:id/find_show_button\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Empty state elements are used for displaying empty state
   - Message and instruction text are used for guidance
   - Icon and button are used for actions

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Empty state elements are used for displaying empty state
   - Message and instruction text are used for guidance
   - Icon and button are used for actions

3. Common Actions:
   - View empty state: Use empty state container
   - Read message: Use message text
   - Read instructions: Use instruction text
   - Find shows: Use find show button

4. Verification:
   - Empty state should be visible
   - Message should be displayed
   - Instructions should be displayed
   - Button should be clickable

## Guide Page

### Fire TV Selectors

```javascript
// Content Structure
{
    "widgetTabs": "android=resourceId(\"com.philo.philo:id/widget_tabs\")",
    "tabBar": "android=resourceId(\"com.philo.philo:id/tab_bar\")",
    "tabHome": "android=resourceId(\"com.philo.philo:id/tab_home\")",
    "tabGuide": "android=resourceId(\"com.philo.philo:id/tab_guide\")",
    "tabTop": "android=resourceId(\"com.philo.philo:id/tab_top\")",
    "tabSaved": "android=resourceId(\"com.philo.philo:id/tab_saved\")",
    "tabSearch": "android=resourceId(\"com.philo.philo:id/tab_search\")",
    "tabProfile": "android=resourceId(\"com.philo.philo:id/tab_profile\")"
}

// Header Elements
{
    "headerWhitespace": "android=resourceId(\"com.philo.philo:id/header_whitespace\")",
    "categoryIcon": "android=resourceId(\"com.philo.philo:id/category_icon\")",
    "categoryLabel": "android=resourceId(\"com.philo.philo:id/category_label\")"
}

// Tile Elements
{
    "movieTileWrapper": "android=resourceId(\"com.philo.philo:id/movie_tile_wrapper\")",
    "movieTileTitle": "android=resourceId(\"com.philo.philo:id/movie_tile_title\")",
    "movieTileDescription": "android=resourceId(\"com.philo.philo:id/movie_tile_description\")",
    "movieTileThumbnail": "android=resourceId(\"com.philo.philo:id/movie_tile_thumbnail\")"
}

// Details Page Elements
{
    "backgroundVideoContainer": "android=resourceId(\"com.philo.philo:id/big_tile_background_video_view\")",
    "metadataContainer": "android=resourceId(\"com.philo.philo:id/big_tile_item_details_container\")",
    "title": "android=resourceId(\"com.philo.philo:id/big_tile_title\")",
    "description": "android=resourceId(\"com.philo.philo:id/big_tile_description\")",
    "airDate": "android=resourceId(\"com.philo.philo:id/big_tile_air_date\")",
    "flagLive": "android=resourceId(\"com.philo.philo:id/big_tile_flag_live\")",
    "rating": "android=resourceId(\"com.philo.philo:id/big_tile_rating\")",
    "runTime": "android=resourceId(\"com.philo.philo:id/big_tile_run_time\")",
    "channelLabel": "android=resourceId(\"com.philo.philo:id/big_tile_channel_label\")"
}

// Action Buttons
{
    "saveButton": "android=resourceId(\"com.philo.philo:id/big_tile_save_button\")",
    "playButton": "android=resourceId(\"com.philo.philo:id/big_tile_play_button\")",
    "unSaveButton": "android=resourceId(\"com.philo.philo:id/big_tile_unsave_button\")",
    "savedButton": "android=resourceId(\"com.philo.philo:id/big_tile_saved_button\")",
    "allShowings": "android=resourceId(\"com.philo.philo:id/big_tile_all_showings\")",
    "allEpisodes": "android=resourceId(\"com.philo.philo:id/big_tile_all_episodes\")"
}

// Special Categories
{
    "freeChannels": "android=text(\"Free channels\")"
}
```

### Android TV Selectors

```javascript
// Content Structure
{
    "widgetTabs": "android=resourceId(\"com.philo.philo.google:id/widget_tabs\")",
    "tabBar": "android=resourceId(\"com.philo.philo.google:id/tab_bar\")",
    "tabHome": "android=resourceId(\"com.philo.philo.google:id/tab_home\")",
    "tabGuide": "android=resourceId(\"com.philo.philo.google:id/tab_guide\")",
    "tabTop": "android=resourceId(\"com.philo.philo.google:id/tab_top\")",
    "tabSaved": "android=resourceId(\"com.philo.philo.google:id/tab_saved\")",
    "tabSearch": "android=resourceId(\"com.philo.philo.google:id/tab_search\")",
    "tabProfile": "android=resourceId(\"com.philo.philo.google:id/tab_profile\")"
}

// Header Elements
{
    "headerWhitespace": "android=resourceId(\"com.philo.philo.google:id/header_whitespace\")",
    "categoryIcon": "android=resourceId(\"com.philo.philo.google:id/category_icon\")",
    "categoryLabel": "android=resourceId(\"com.philo.philo.google:id/category_label\")"
}

// Tile Elements
{
    "movieTileWrapper": "android=resourceId(\"com.philo.philo.google:id/movie_tile_wrapper\")",
    "movieTileTitle": "android=resourceId(\"com.philo.philo.google:id/movie_tile_title\")",
    "movieTileDescription": "android=resourceId(\"com.philo.philo.google:id/movie_tile_description\")",
    "movieTileThumbnail": "android=resourceId(\"com.philo.philo.google:id/movie_tile_thumbnail\")"
}

// Details Page Elements
{
    "backgroundVideoContainer": "android=resourceId(\"com.philo.philo.google:id/big_tile_background_video_view\")",
    "metadataContainer": "android=resourceId(\"com.philo.philo.google:id/big_tile_item_details_container\")",
    "title": "android=resourceId(\"com.philo.philo.google:id/big_tile_title\")",
    "description": "android=resourceId(\"com.philo.philo.google:id/big_tile_description\")",
    "airDate": "android=resourceId(\"com.philo.philo.google:id/big_tile_air_date\")",
    "flagLive": "android=resourceId(\"com.philo.philo.google:id/big_tile_flag_live\")",
    "rating": "android=resourceId(\"com.philo.philo.google:id/big_tile_rating\")",
    "runTime": "android=resourceId(\"com.philo.philo.google:id/big_tile_run_time\")",
    "channelLabel": "android=resourceId(\"com.philo.philo.google:id/big_tile_channel_label\")"
}

// Action Buttons
{
    "saveButton": "android=resourceId(\"com.philo.philo.google:id/big_tile_save_button\")",
    "playButton": "android=resourceId(\"com.philo.philo.google:id/big_tile_play_button\")",
    "unSaveButton": "android=resourceId(\"com.philo.philo.google:id/big_tile_unsave_button\")",
    "savedButton": "android=resourceId(\"com.philo.philo.google:id/big_tile_saved_button\")",
    "allShowings": "android=resourceId(\"com.philo.philo.google:id/big_tile_all_showings\")",
    "allEpisodes": "android=resourceId(\"com.philo.philo.google:id/big_tile_all_episodes\")"
}

// Special Categories
{
    "freeChannels": "android=text(\"Free channels\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Content structure uses resource IDs
   - Header elements use resource IDs
   - Tile elements use resource IDs
   - Details page elements use resource IDs
   - Action buttons use resource IDs
   - Special categories use text selectors

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Content structure uses resource IDs
   - Header elements use resource IDs
   - Tile elements use resource IDs
   - Details page elements use resource IDs
   - Action buttons use resource IDs
   - Special categories use text selectors

3. Common Actions:
   - Navigate tabs: Use content structure selectors
   - View headers: Use header elements
   - View tiles: Use tile elements
   - View details: Use details page elements
   - Interact with content: Use action buttons
   - View special categories: Use special categories selectors

4. Verification:
   - Content structure should be visible
   - Headers should be displayed
   - Tiles should be properly rendered
   - Details should be accessible
   - Buttons should be clickable
   - Special categories should be present

## Search Page

### Fire TV Selectors

```javascript
// Search Input Elements
{
    "searchInput": "android=resourceId(\"com.philo.philo:id/search_input\")",
    "searchButton": "android=resourceId(\"com.philo.philo:id/search_button\")",
    "searchResultsList": "android=resourceId(\"com.philo.philo:id/search_results_list\")"
}

// Keypad Elements
{
    "keypadContainer": "android=resourceId(\"com.philo.philo:id/keypad_container\")",
    "backspace": "android=resourceId(\"com.philo.philo:id/keypad_backspace\")",
    "space": "android=resourceId(\"com.philo.philo:id/keypad_space\")",
    "clear": "android=resourceId(\"com.philo.philo:id/keypad_clear\")"
}

// Result Details
{
    "resultTitle": "android=resourceId(\"com.philo.philo:id/result_title\")",
    "resultDescription": "android=resourceId(\"com.philo.philo:id/result_description\")",
    "resultThumbnail": "android=resourceId(\"com.philo.philo:id/result_thumbnail\")"
}
```

### Android TV Selectors

```javascript
// Search Input Elements
{
    "searchInput": "android=resourceId(\"com.philo.philo.google:id/search_input\")",
    "searchButton": "android=resourceId(\"com.philo.philo.google:id/search_button\")",
    "searchResultsList": "android=resourceId(\"com.philo.philo.google:id/search_results_list\")"
}

// Keypad Elements
{
    "keypadContainer": "android=resourceId(\"com.philo.philo.google:id/keypad_container\")",
    "backspace": "android=resourceId(\"com.philo.philo.google:id/keypad_backspace\")",
    "space": "android=resourceId(\"com.philo.philo.google:id/keypad_space\")",
    "clear": "android=resourceId(\"com.philo.philo.google:id/keypad_clear\")"
}

// Result Details
{
    "resultTitle": "android=resourceId(\"com.philo.philo.google:id/result_title\")",
    "resultDescription": "android=resourceId(\"com.philo.philo.google:id/result_description\")",
    "resultThumbnail": "android=resourceId(\"com.philo.philo.google:id/result_thumbnail\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Search input elements are used for search functionality
   - Keypad elements are used for text input
   - Result details are used for displaying search results

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Search input elements are used for search functionality
   - Keypad elements are used for text input
   - Result details are used for displaying search results

3. Common Actions:
   - Enter search query: Use search input and keypad
   - Submit search: Use search button
   - View results: Use search results list
   - View result details: Use result details selectors

4. Verification:
   - Search input should be visible
   - Keypad should be functional
   - Results should be displayed
   - Result details should be accessible

## Profile Page

### Fire TV Selectors

```javascript
// Profile Information
{
    "profileHeader": "android=resourceId(\"com.philo.philo:id/profile_header\")",
    "accountName": "android=resourceId(\"com.philo.philo:id/account_name\")",
    "emailLabel": "android=resourceId(\"com.philo.philo:id/email_label\")",
    "settingsButton": "android=resourceId(\"com.philo.philo:id/settings_button\")"
}

// Menu Items
{
    "menuItem": "android=resourceId(\"com.philo.philo:id/menu_item\")",
    "menuItemTitle": "android=resourceId(\"com.philo.philo:id/menu_item_title\")",
    "menuItemDescription": "android=resourceId(\"com.philo.philo:id/menu_item_description\")",
    "menuItemIcon": "android=resourceId(\"com.philo.philo:id/menu_item_icon\")"
}

// Version Info
{
    "versionLabel": "android=resourceId(\"com.philo.philo:id/version_label\")",
    "versionNumber": "android=resourceId(\"com.philo.philo:id/version_number\")"
}
```

### Android TV Selectors

```javascript
// Profile Information
{
    "profileHeader": "android=resourceId(\"com.philo.philo.google:id/profile_header\")",
    "accountName": "android=resourceId(\"com.philo.philo.google:id/account_name\")",
    "emailLabel": "android=resourceId(\"com.philo.philo.google:id/email_label\")",
    "settingsButton": "android=resourceId(\"com.philo.philo.google:id/settings_button\")"
}

// Menu Items
{
    "menuItem": "android=resourceId(\"com.philo.philo.google:id/menu_item\")",
    "menuItemTitle": "android=resourceId(\"com.philo.philo.google:id/menu_item_title\")",
    "menuItemDescription": "android=resourceId(\"com.philo.philo.google:id/menu_item_description\")",
    "menuItemIcon": "android=resourceId(\"com.philo.philo.google:id/menu_item_icon\")"
}

// Version Info
{
    "versionLabel": "android=resourceId(\"com.philo.philo.google:id/version_label\")",
    "versionNumber": "android=resourceId(\"com.philo.philo.google:id/version_number\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Profile information is used for account details
   - Menu items are used for navigation
   - Version info is used for app version

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Profile information is used for account details
   - Menu items are used for navigation
   - Version info is used for app version

3. Common Actions:
   - View profile: Use profile information selectors
   - Navigate menu: Use menu items
   - View version: Use version info selectors

4. Verification:
   - Profile information should be displayed
   - Menu items should be accessible
   - Version info should be visible

## Home Screen

### Fire TV Selectors

```javascript
// Profile Selection Screen
{
    "profilesTitle": "android=resourceId(\"com.philo.philo:id/profiles_title\")",
    "profilesRecyclerView": "android=resourceId(\"com.philo.philo:id/profiles_recycler_view\")"
}

// Header
{
    "homeHeader": "android=resourceId(\"com.philo.philo:id/home_header\")",
    "topNavHome": "android=resourceId(\"com.philo.philo:id/top_nav_home\")",
    "liveTVButton": "android=resourceId(\"com.philo.philo:id/live_tv_button\")"
}

// Main Navigation
{
    "tabBar": "android=resourceId(\"com.philo.philo:id/tab_bar\")",
    "tabHome": "android=resourceId(\"com.philo.philo:id/tab_home\")",
    "tabGuide": "android=resourceId(\"com.philo.philo:id/tab_guide\")",
    "tabTop": "android=resourceId(\"com.philo.philo:id/tab_top\")",
    "tabSaved": "android=resourceId(\"com.philo.philo:id/tab_saved\")",
    "tabSearch": "android=resourceId(\"com.philo.philo:id/tab_search\")",
    "tabProfile": "android=resourceId(\"com.philo.philo:id/tab_profile\")"
}

// Content Categories
{
    "topFreeMovies": "android=resourceId(\"com.philo.philo:id/top_free_movies\")",
    "recommended": "android=resourceId(\"com.philo.philo:id/recommended\")",
    "continueWatching": "android=resourceId(\"com.philo.philo:id/continue_watching\")",
    "recentlyAdded": "android=resourceId(\"com.philo.philo:id/recently_added\")"
}

// Content Actions
{
    "playButton": "android=resourceId(\"com.philo.philo:id/play_button\")",
    "saveButton": "android=resourceId(\"com.philo.philo:id/save_button\")",
    "unSaveButton": "android=resourceId(\"com.philo.philo:id/unsave_button\")",
    "savedButton": "android=resourceId(\"com.philo.philo:id/saved_button\")"
}
```

### Android TV Selectors

```javascript
// Profile Selection Screen
{
    "profilesTitle": "android=resourceId(\"com.philo.philo.google:id/profiles_title\")",
    "profilesRecyclerView": "android=resourceId(\"com.philo.philo.google:id/profiles_recycler_view\")"
}

// Header
{
    "homeHeader": "android=resourceId(\"com.philo.philo.google:id/home_header\")",
    "topNavHome": "android=resourceId(\"com.philo.philo.google:id/top_nav_home\")",
    "liveTVButton": "android=resourceId(\"com.philo.philo.google:id/live_tv_button\")"
}

// Main Navigation
{
    "tabBar": "android=resourceId(\"com.philo.philo.google:id/tab_bar\")",
    "tabHome": "android=resourceId(\"com.philo.philo.google:id/tab_home\")",
    "tabGuide": "android=resourceId(\"com.philo.philo.google:id/tab_guide\")",
    "tabTop": "android=resourceId(\"com.philo.philo.google:id/tab_top\")",
    "tabSaved": "android=resourceId(\"com.philo.philo.google:id/tab_saved\")",
    "tabSearch": "android=resourceId(\"com.philo.philo.google:id/tab_search\")",
    "tabProfile": "android=resourceId(\"com.philo.philo.google:id/tab_profile\")"
}

// Content Categories
{
    "topFreeMovies": "android=resourceId(\"com.philo.philo.google:id/top_free_movies\")",
    "recommended": "android=resourceId(\"com.philo.philo.google:id/recommended\")",
    "continueWatching": "android=resourceId(\"com.philo.philo.google:id/continue_watching\")",
    "recentlyAdded": "android=resourceId(\"com.philo.philo.google:id/recently_added\")"
}

// Content Actions
{
    "playButton": "android=resourceId(\"com.philo.philo.google:id/play_button\")",
    "saveButton": "android=resourceId(\"com.philo.philo.google:id/save_button\")",
    "unSaveButton": "android=resourceId(\"com.philo.philo.google:id/unsave_button\")",
    "savedButton": "android=resourceId(\"com.philo.philo.google:id/saved_button\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Profile selection screen is used for profile management
   - Header elements are used for navigation
   - Main navigation is used for tab switching
   - Content categories are used for content organization
   - Content actions are used for content interaction

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Profile selection screen is used for profile management
   - Header elements are used for navigation
   - Main navigation is used for tab switching
   - Content categories are used for content organization
   - Content actions are used for content interaction

3. Common Actions:
   - Select profile: Use profile selection screen
   - Navigate home: Use header elements
   - Switch tabs: Use main navigation
   - View content: Use content categories
   - Interact with content: Use content actions

4. Verification:
   - Profile selection should be accessible
   - Header should be visible
   - Navigation should work correctly
   - Content categories should be displayed
   - Content actions should be functional

## Categories Page

### Fire TV Selectors

```javascript
// Header Elements
{
    "headerWhitespace": "android=resourceId(\"com.philo.philo:id/header_whitespace\")",
    "categoryIcon": "android=resourceId(\"com.philo.philo:id/category_icon\")",
    "categoryLabel": "android=resourceId(\"com.philo.philo:id/category_label\")"
}

// Grid Elements
{
    "movieTileWrapper": "android=resourceId(\"com.philo.philo:id/movie_tile_wrapper\")",
    "movieTileTitle": "android=resourceId(\"com.philo.philo:id/movie_tile_title\")",
    "movieTileDescription": "android=resourceId(\"com.philo.philo:id/movie_tile_description\")",
    "movieTileThumbnail": "android=resourceId(\"com.philo.philo:id/movie_tile_thumbnail\")"
}

// Category Headers
{
    "topFreeMovies": "android=text(\"Top Free Movies\")",
    "topFreeShows": "android=text(\"Top Free Shows\")",
    "recommended": "android=text(\"Recommended\")",
    "trendingLive": "android=text(\"Trending Live\")",
    "realityRoundup": "android=text(\"Reality Roundup\")",
    "trueCrime": "android=text(\"True Crime\")",
    "saved": "android=text(\"Saved\")",
    "homeAndTravel": "android=text(\"Home & Travel\")",
    "keepWatching": "android=text(\"Keep Watching\")"
}

// Movie Tiles
{
    "killBill": "android=text(\"Kill Bill: Vol. 1\")",
    "twilight": "android=text(\"Twilight\")",
    "theMatrix": "android=text(\"The Matrix\")",
    "inception": "android=text(\"Inception\")",
    "theDarkKnight": "android=text(\"The Dark Knight\")",
    "interstellar": "android=text(\"Interstellar\")",
    "theGodfather": "android=text(\"The Godfather\")",
    "pulpFiction": "android=text(\"Pulp Fiction\")",
    "fightClub": "android=text(\"Fight Club\")",
    "forrestGump": "android=text(\"Forrest Gump\")"
}
```

### Android TV Selectors

```javascript
// Header Elements
{
    "headerWhitespace": "android=resourceId(\"com.philo.philo.google:id/header_whitespace\")",
    "categoryIcon": "android=resourceId(\"com.philo.philo.google:id/category_icon\")",
    "categoryLabel": "android=resourceId(\"com.philo.philo.google:id/category_label\")"
}

// Grid Elements
{
    "movieTileWrapper": "android=resourceId(\"com.philo.philo.google:id/movie_tile_wrapper\")",
    "movieTileTitle": "android=resourceId(\"com.philo.philo.google:id/movie_tile_title\")",
    "movieTileDescription": "android=resourceId(\"com.philo.philo.google:id/movie_tile_description\")",
    "movieTileThumbnail": "android=resourceId(\"com.philo.philo.google:id/movie_tile_thumbnail\")"
}

// Category Headers
{
    "topFreeMovies": "android=text(\"Top Free Movies\")",
    "topFreeShows": "android=text(\"Top Free Shows\")",
    "recommended": "android=text(\"Recommended\")",
    "trendingLive": "android=text(\"Trending Live\")",
    "realityRoundup": "android=text(\"Reality Roundup\")",
    "trueCrime": "android=text(\"True Crime\")",
    "saved": "android=text(\"Saved\")",
    "homeAndTravel": "android=text(\"Home & Travel\")",
    "keepWatching": "android=text(\"Keep Watching\")"
}

// Movie Tiles
{
    "killBill": "android=text(\"Kill Bill: Vol. 1\")",
    "twilight": "android=text(\"Twilight\")",
    "theMatrix": "android=text(\"The Matrix\")",
    "inception": "android=text(\"Inception\")",
    "theDarkKnight": "android=text(\"The Dark Knight\")",
    "interstellar": "android=text(\"Interstellar\")",
    "theGodfather": "android=text(\"The Godfather\")",
    "pulpFiction": "android=text(\"Pulp Fiction\")",
    "fightClub": "android=text(\"Fight Club\")",
    "forrestGump": "android=text(\"Forrest Gump\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Use `android=text()` format for text-based selectors
   - Header elements use resource IDs
   - Grid elements use resource IDs
   - Category headers use text selectors
   - Movie tiles use text selectors

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Use `android=text()` format for text-based selectors
   - Header elements use resource IDs
   - Grid elements use resource IDs
   - Category headers use text selectors
   - Movie tiles use text selectors

3. Common Actions:
   - View headers: Use header elements
   - Navigate grid: Use grid elements
   - View categories: Use category headers
   - Select movies: Use movie tiles

4. Verification:
   - Headers should be visible
   - Grid should be properly rendered
   - Category headers should be displayed
   - Movie tiles should be accessible

## Details Page

### Fire TV Selectors

```javascript
// Movie Information
{
    "movieTitle": "android=new UiSelector().className(\"android.widget.TextView\").index(1)",
    "movieDescription": [
        "android=new UiSelector().resourceId(\"com.philo.philo:id/description\")",
        "android=new UiSelector().resourceId(\"com.philo.philo:id/movie_description\")",
        "android=new UiSelector().resourceId(\"com.philo.philo:id/content_description\")",
        "android=new UiSelector().className(\"android.widget.TextView\").index(2)",
        "android=new UiSelector().className(\"android.widget.TextView\").textContains(\".\")"
    ],
    "movieRating": [
        "android=new UiSelector().resourceId(\"com.philo.philo:id/rating\")",
        "android=new UiSelector().resourceId(\"com.philo.philo:id/content_rating\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"^(G|PG|PG-13|R|TV-Y|TV-Y7|TV-G|TV-PG|TV-14|TV-MA|NR)$\")"
    ],
    "movieRatingAdvisories": [
        "android=new UiSelector().resourceId(\"com.philo.philo:id/rating_advisories\")",
        "android=new UiSelector().resourceId(\"com.philo.philo:id/content_advisories\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textContains(\"violence\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textContains(\"language\")"
    ],
    "movieDuration": [
        "android=new UiSelector().resourceId(\"com.philo.philo:id/duration\")",
        "android=new UiSelector().resourceId(\"com.philo.philo:id/content_duration\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\".*[0-9]+ min.*\")"
    ]
}

// Series Information
{
    "seriesTitle": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\".*\")",
    "seriesYear": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"\\d{4}\")",
    "seriesSeasons": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"\\d+ Seasons?\")",
    "seriesRating": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"TV-.*\")",
    "seriesDescription": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\".*\").index(5)",
    "seriesPoster": "android=new UiSelector().className(\"android.widget.ImageView\").descriptionMatches(\".*\")"
}

// Navigation Tabs
{
    "episodesTab": "android=className(\"android.widget.TextView\").text(\"Episodes\")",
    "scheduleTab": "android=className(\"android.widget.TextView\").text(\"Schedule\")",
    "relatedTab": "android=className(\"android.widget.TextView\").text(\"Related\")",
    "extrasTab": "android=className(\"android.widget.TextView\").text(\"Extras\")",
    "detailsTab": "android=className(\"android.widget.TextView\").text(\"Details\")"
}

// Background Elements
{
    "backgroundImage": "android=resourceId(\"com.philo.philo:id/big_tile_background_image_view\").className(\"android.widget.ImageView\")",
    "backgroundVideo": "android=resourceId(\"com.philo.philo:id/big_tile_background_video_view\").className(\"android.widget.FrameLayout\")",
    "backgroundGradient": "android=resourceId(\"com.philo.philo:id/big_tile_gradient_layer_view\").className(\"android.view.View\")"
}

// Container Elements
{
    "detailsContainer": "android=resourceId(\"com.philo.philo:id/big_tile_item_details_container\").className(\"android.view.ViewGroup\")",
    "otherInfoContainer": "android=resourceId(\"com.philo.philo:id/other_information_container\").className(\"android.view.ViewGroup\")",
    "buttonsContainer": "android=resourceId(\"com.philo.philo:id/big_tile_buttons_container\").className(\"android.view.ViewGroup\")"
}
```

### Android TV Selectors

```javascript
// Movie Information
{
    "movieTitle": "android=new UiSelector().className(\"android.widget.TextView\").index(1)",
    "movieDescription": [
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/description\")",
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/movie_description\")",
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/content_description\")",
        "android=new UiSelector().className(\"android.widget.TextView\").index(2)",
        "android=new UiSelector().className(\"android.widget.TextView\").textContains(\".\")"
    ],
    "movieRating": [
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/rating\")",
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/content_rating\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"^(G|PG|PG-13|R|TV-Y|TV-Y7|TV-G|TV-PG|TV-14|TV-MA|NR)$\")"
    ],
    "movieRatingAdvisories": [
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/rating_advisories\")",
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/content_advisories\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textContains(\"violence\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textContains(\"language\")"
    ],
    "movieDuration": [
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/duration\")",
        "android=new UiSelector().resourceId(\"com.philo.philo.google:id/content_duration\")",
        "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\".*[0-9]+ min.*\")"
    ]
}

// Series Information
{
    "seriesTitle": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\".*\")",
    "seriesYear": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"\\d{4}\")",
    "seriesSeasons": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"\\d+ Seasons?\")",
    "seriesRating": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\"TV-.*\")",
    "seriesDescription": "android=new UiSelector().className(\"android.widget.TextView\").textMatches(\".*\").index(5)",
    "seriesPoster": "android=new UiSelector().className(\"android.widget.ImageView\").descriptionMatches(\".*\")"
}

// Navigation Tabs
{
    "episodesTab": "android=className(\"android.widget.TextView\").text(\"Episodes\")",
    "scheduleTab": "android=className(\"android.widget.TextView\").text(\"Schedule\")",
    "relatedTab": "android=className(\"android.widget.TextView\").text(\"Related\")",
    "extrasTab": "android=className(\"android.widget.TextView\").text(\"Extras\")",
    "detailsTab": "android=className(\"android.widget.TextView\").text(\"Details\")"
}

// Background Elements
{
    "backgroundImage": "android=resourceId(\"com.philo.philo.google:id/big_tile_background_image_view\").className(\"android.widget.ImageView\")",
    "backgroundVideo": "android=resourceId(\"com.philo.philo.google:id/big_tile_background_video_view\").className(\"android.widget.FrameLayout\")",
    "backgroundGradient": "android=resourceId(\"com.philo.philo.google:id/big_tile_gradient_layer_view\").className(\"android.view.View\")"
}

// Container Elements
{
    "detailsContainer": "android=resourceId(\"com.philo.philo.google:id/big_tile_item_details_container\").className(\"android.view.ViewGroup\")",
    "otherInfoContainer": "android=resourceId(\"com.philo.philo.google:id/other_information_container\").className(\"android.view.ViewGroup\")",
    "buttonsContainer": "android=resourceId(\"com.philo.philo.google:id/big_tile_buttons_container\").className(\"android.view.ViewGroup\")"
}
```

### Usage Notes

1. For Fire TV:
   - Use `android=resourceId()` format for resource IDs
   - Use `android=text()` format for text-based selectors
   - Use `android=new UiSelector()` format for complex selectors
   - Movie information uses multiple selector patterns
   - Series information uses text matching patterns
   - Navigation tabs use text selectors
   - Background and container elements use resource IDs

2. For Android TV:
   - Use `android=resourceId()` format for resource IDs
   - Use `android=text()` format for text-based selectors
   - Use `android=new UiSelector()` format for complex selectors
   - Movie information uses multiple selector patterns
   - Series information uses text matching patterns
   - Navigation tabs use text selectors
   - Background and container elements use resource IDs

3. Common Actions:
   - View Movie Info: Use movie information selectors
   - View Series Info: Use series information selectors
   - Navigate Tabs: Use navigation tab selectors
   - View Background: Use background element selectors
   - Access Containers: Use container element selectors

4. Verification:
   - Movie information should be displayed correctly
   - Series information should be displayed correctly
   - Navigation tabs should be accessible
   - Background elements should be visible
   - Container elements should be properly structured