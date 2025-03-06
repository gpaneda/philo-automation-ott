# Fire TV & Android TV Automation Framework - Developer Guide

## Technical Implementation Details

This guide provides technical details about the implementation of the Fire TV and Android TV automation framework for developers who need to maintain, extend, or troubleshoot the framework.

## Environment Setup

### Prerequisites

- Node.js (v18+)
- TypeScript (v4.9+)
- Appium Server (v2.0+)
- Android Debug Bridge (ADB)
- Fire TV or Android TV device/emulator

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file
4. Connect device via ADB: `adb connect <IP_ADDRESS>`
5. Start Appium server: `npm run start:appium`

## Core Components

### 1. WebdriverIO Configuration

The framework uses WebdriverIO with custom capabilities for Fire TV and Android TV:

```typescript
// src/config/capabilities.ts
export const fireTVCapabilities = {
    platformName: 'Android',
    'appium:deviceName': 'Fire TV',
    'appium:appPackage': 'com.philo.philo',
    'appium:appActivity': 'com.philo.philo.MainActivity',
    'appium:automationName': 'UiAutomator2',
    // Additional capabilities...
};

export const androidTVCapabilities = {
    // Android TV specific capabilities...
};
```

### 2. Driver Initialization

The `AppHelper` class manages driver initialization and device detection:

```typescript
// src/helpers/app.helper.ts
static async initializeDriver(): Promise<Browser> {
    if (!this.driver) {
        try {
            console.log('Initializing WebDriver with capabilities:', 
                JSON.stringify(fireTVCapabilities, null, 2));
            
            this.driver = await remote({
                hostname: 'localhost',
                port: 4723,
                logLevel: 'info',
                path: '/wd/hub',
                capabilities: fireTVCapabilities,
                connectionRetryTimeout: 120000,
                connectionRetryCount: 5
            });
            
            console.log('WebDriver initialized successfully');
        } catch (error) {
            console.error('Failed to initialize WebDriver:', error);
            throw error;
        }
    }
    return this.driver;
}
```

### 3. Base Page Implementation

The `BasePage` class provides core functionality for all page objects:

```typescript
// src/fireTVPages/base.page.ts or src/androidTVPages/base.page.ts
export class BasePage {
    protected driver: Browser;
    protected defaultTimeout = 30000;

    constructor(driver: Browser) {
        this.driver = driver;
    }

    async waitForElement(selector: string, timeout: number = this.defaultTimeout) {
        await this.driver.$(selector).waitForExist({ timeout });
    }

    async isElementDisplayed(selector: string): Promise<boolean> {
        try {
            return await this.driver.$(selector).isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async click(selector: string): Promise<void> {
        await this.waitForElement(selector);
        await this.driver.$(selector).click();
    }

    // Additional base methods...
}
```

### 4. Selector Management

The framework uses interfaces to define selectors for each page:

```typescript
// Example from src/fireTVPages/categories.page.ts
interface CategorySelectors {
    headerWhitespace: string;
    categoryIcon: string;
    categoryLabel: string;
    gridContainer: string;
    // Additional selectors...
}

export class CategoriesPage extends HomeScreenPage {
    public selectors!: CategorySelectors & typeof HomeScreenPage.prototype.selectors;
    
    constructor(driver: Browser) {
        super(driver);
        this.selectors = {
            ...this.selectors,
            headerWhitespace: 'com.philo.philo:id/header_whitespace',
            categoryIcon: 'com.philo.philo:id/category_icon',
            // Additional selector values...
        };
    }
    
    // Page methods...
}
```

### 5. Device Type Detection

The framework automatically detects the device type:

```typescript
// src/helpers/app.helper.ts
static async detectDeviceType(): Promise<'fireTV' | 'androidTV' | null> {
    try {
        const deviceModel = await this.getDeviceModel();
        console.log(`Detected device model: ${deviceModel}`);
        
        if (deviceModel.toLowerCase().includes('fire')) {
            this.currentDeviceType = 'fireTV';
            return 'fireTV';
        } else if (deviceModel.toLowerCase().includes('android')) {
            this.currentDeviceType = 'androidTV';
            return 'androidTV';
        }
        
        return null;
    } catch (error) {
        console.error('Error detecting device type:', error);
        return null;
    }
}
```

## Test Implementation

### 1. Test Structure

Tests are organized using Jest and follow this structure:

```typescript
// src/tests/example.test.ts
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { LoginPage } from '../fireTVPages/login.page';

describe('Example Test Suite', () => {
    let driver: Browser;
    let homePage: HomeScreenPage;
    let loginPage: LoginPage;
    
    beforeAll(async () => {
        driver = await AppHelper.initializeDriver();
        await AppHelper.launchPhiloApp();
        
        homePage = new HomeScreenPage(driver);
        loginPage = new LoginPage(driver);
    });
    
    afterAll(async () => {
        // Cleanup code
    });
    
    test('Should login successfully', async () => {
        await loginPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
        await homePage.verifyHomeScreenLoaded();
        // Additional assertions...
    });
    
    // Additional tests...
});
```

### 2. Page Navigation

Navigation between screens is handled by page methods:

```typescript
// src/fireTVPages/homescreen.page.ts
async navigateToCategories(): Promise<CategoriesPage> {
    await this.click(this.selectors.categoriesButton);
    await this.driver.pause(2000); // Wait for animation
    return new CategoriesPage(this.driver);
}
```

### 3. Element Interaction

The framework provides standardized methods for element interaction:

```typescript
// Example from a page object
async selectMovieTitle(titleName: string): Promise<void> {
    const titleSelector = `android=new UiSelector().text("${titleName}")`;
    await this.waitForElement(titleSelector);
    await this.click(titleSelector);
    await this.driver.pause(3000); // Wait for content to load
}
```

## Advanced Features

### 1. Gmail Integration

The framework includes a `GmailHelper` for email verification:

```typescript
// src/helpers/gmail.helper.ts
async getVerificationCode(): Promise<string | null> {
    try {
        const messages = await this.listMessages('from:noreply@philo.com is:unread');
        if (!messages || messages.length === 0) {
            console.log('No unread messages from Philo');
            return null;
        }
        
        // Process email to extract verification code
        // ...
        
        return verificationCode;
    } catch (error) {
        console.error('Error getting verification code:', error);
        return null;
    }
}
```

### 2. Remote Control Simulation

The framework simulates remote control actions:

```typescript
// src/fireTVPages/base.page.ts
async pressHomeButton(): Promise<void> {
    await this.driver.pressKeyCode(3); // Android HOME key
}

async pressBackButton(): Promise<void> {
    await this.driver.pressKeyCode(4); // Android BACK key
}

async pressEnterButton(): Promise<void> {
    await this.driver.pressKeyCode(66); // Android ENTER key
}

async pressDownButton(): Promise<void> {
    await this.driver.pressKeyCode(20); // Android DOWN key
}

// Additional remote control methods...
```

### 3. Error Handling

The framework implements comprehensive error handling:

```typescript
// Example error handling pattern
async verifyElementDisplayed(selector: string): Promise<void> {
    try {
        const isDisplayed = await this.isElementDisplayed(selector);
        if (!isDisplayed) {
            throw new Error(`Element with selector "${selector}" is not displayed`);
        }
    } catch (error) {
        console.error(`Error verifying element displayed: ${error}`);
        // Optional: Take screenshot
        throw error;
    }
}
```

## Extending the Framework

### 1. Adding a New Page Object

To add a new page object:

1. Create a new file in `src/fireTVPages/` or `src/androidTVPages/`
2. Extend the appropriate base class
3. Define selectors and methods

Example:

```typescript
// src/fireTVPages/newfeature.page.ts
import { BasePage } from './base.page';
import { Browser } from 'webdriverio';

interface NewFeatureSelectors {
    featureTitle: string;
    featureButton: string;
    // Additional selectors...
}

export class NewFeaturePage extends BasePage {
    public selectors: NewFeatureSelectors;
    
    constructor(driver: Browser) {
        super(driver);
        this.selectors = {
            featureTitle: 'com.philo.philo:id/feature_title',
            featureButton: 'com.philo.philo:id/feature_button',
            // Additional selector values...
        };
    }
    
    async performFeatureAction(): Promise<void> {
        // Implementation...
    }
    
    // Additional methods...
}
```

### 2. Adding a New Test

To add a new test:

1. Create a new file in `src/tests/`
2. Import necessary page objects and helpers
3. Implement test cases

Example:

```typescript
// src/tests/newfeature.test.ts
import { AppHelper } from '../helpers/app.helper';
import { HomeScreenPage } from '../fireTVPages/homescreen.page';
import { NewFeaturePage } from '../fireTVPages/newfeature.page';

describe('New Feature Tests', () => {
    let driver: Browser;
    let homePage: HomeScreenPage;
    let newFeaturePage: NewFeaturePage;
    
    beforeAll(async () => {
        driver = await AppHelper.initializeDriver();
        await AppHelper.launchPhiloApp();
        
        homePage = new HomeScreenPage(driver);
        newFeaturePage = new NewFeaturePage(driver);
    });
    
    // Test implementation...
});
```

## Troubleshooting

### Common Issues

1. **Element Not Found**
   - Verify selector is correct
   - Increase wait timeout
   - Check if element is in viewport

2. **Device Connection Issues**
   - Verify ADB connection: `adb devices`
   - Restart ADB server: `adb kill-server && adb start-server`
   - Check device IP address

3. **Appium Server Issues**
   - Verify Appium is running: `npm run start:appium`
   - Check port conflicts
   - Review Appium logs

### Debugging Tips

1. **Enable Verbose Logging**
   ```typescript
   this.driver = await remote({
       // Other options...
       logLevel: 'trace', // More detailed than 'info'
   });
   ```

2. **Take Screenshots**
   ```typescript
   async takeScreenshot(name: string): Promise<void> {
       await this.driver.saveScreenshot(`./screenshots/${name}.png`);
   }
   ```

3. **Dump UI Hierarchy**
   ```typescript
   async dumpUiHierarchy(): Promise<void> {
       const source = await this.driver.getPageSource();
       fs.writeFileSync('./ui_dump.xml', source);
   }
   ```

## Best Practices for Development

1. **Code Organization**
   - Keep page objects focused on a single screen
   - Extract common functionality to base classes
   - Use helper classes for non-UI operations

2. **Selector Management**
   - Use meaningful selector names
   - Document selector purpose
   - Group related selectors

3. **Test Reliability**
   - Add appropriate waits
   - Handle edge cases
   - Clean up test state

4. **Code Quality**
   - Follow TypeScript best practices
   - Add comprehensive comments
   - Use consistent naming conventions

## Conclusion

This developer guide provides the technical details needed to work with the Fire TV and Android TV automation framework. By following these guidelines, you can maintain, extend, and troubleshoot the framework effectively. 