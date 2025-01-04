# Fire TV Automation Guide

## Core Requirements

1. **Essential Tools & Libraries**:
- ADB (Android Debug Bridge):
  1. [x] Install via Android Studio:
     - [x] Open Android Studio > SDK Manager
     - [x] Select "SDK Tools" tab
     - [x] Check "Android SDK Platform-Tools"
     - [x] Click Apply to install
  2. [ ] Add to system PATH:
     - [x] Windows: Add `%LOCALAPPDATA%\Android\Sdk\platform-tools`
     - [x] macOS/Linux: Add `$HOME/Library/Android/sdk/platform-tools`
  3. [ ] Verify installation:
     ```bash
     adb --version
     adb devices
     ```
  4. [ ] Connect to Fire TV:
     ```bash
     adb connect <FIRE-TV-IP>:5555
     ```

- WebdriverIO:
  1. [ ] Initialize npm project:
     ```bash
     npm init -y
     ```
  2. [ ] Install WebdriverIO:
     ```bash
     npm install @wdio/cli
     npx wdio config
     ```
  3. [ ] Configure for Fire TV:
     ```javascript
     // wdio.conf.js
     exports.config = {
         capabilities: [{
             platformName: 'Android',
             'appium:deviceName': 'Fire TV',
             'appium:automationName': 'UiAutomator2'
         }]
     }
     ```

- Jest Setup:
  1. [ ] Install Jest:
     ```bash
     npm install --save-dev jest @types/jest ts-jest
     ```
  2. [ ] Configure Jest:
     ```bash
     npx ts-jest config:init
     ```
  3. [ ] Add to package.json:
     ```json
     {
       "scripts": {
         "test": "jest"
       }
     }
     ```

- Appium:
  1. Install Appium:
     ```bash
     npm install -g appium
     ```
  2. Install Appium Doctor:
     ```bash
     npm install -g appium-doctor
     ```
  3. Install Fire TV driver:
     ```bash
     appium driver install uiautomator2
     ```
  4. Verify setup:
     ```bash
     appium-doctor --android
     ```

- TypeScript Setup:
  1. Install TypeScript:
     ```bash
     npm install --save-dev typescript @types/node
     ```
  2. Initialize TypeScript:
     ```bash
     npx tsc --init
     ```
  3. Configure tsconfig.json:
     ```json
     {
       "compilerOptions": {
         "target": "ES2018",
         "module": "commonjs",
         "strict": true
       }
     }
     ```

2. **Device Setup**:
- Physical Fire TV:
  1. [ ] Enable Developer Options:
     - [ ] Go to Settings
     - [ ] Select My Fire TV
     - [ ] Select About
     - [ ] Click Fire TV Stick/Device Name 7 times
  2. [ ] Enable ADB Debugging:
     - [ ] Go to Developer Options
     - [ ] Enable ADB debugging
     - [ ] Enable Apps from Unknown Sources
  3. [ ] Get Fire TV IP:
     - [ ] Go to Settings > My Fire TV > About
     - [ ] Note down IP address
  4. [ ] Connect:
     ```bash
     adb connect <FIRE-TV-IP>:5555
     ```

3. **Development Environment**:
- Project Setup:
  1. [ ] Create project structure:
     ```bash
     mkdir fire-tv-automation
     cd fire-tv-automation
     ```
  2. [ ] Initialize project:
     ```bash
     npm init -y
     ```
  3. [ ] Install dependencies:
     ```bash
     npm install --save-dev @wdio/cli appium typescript jest
     ```
  4. [ ] Configure test framework:
     ```bash
     npx wdio config
     ```

## Core Questions & Answers

### Q: What would it take to use TypeScript and Puppeteer to automated tests on FTV?
A: Here's what you need for Fire TV automation:

1. **Core Setup with TypeScript & Puppeteer**:
```typescript
// Basic structure example
import { AndroidTV } from 'adb-ts';  // TypeScript wrapper for ADB
import * as puppeteer from 'puppeteer';

class FireTVAutomation {
    private adb: AndroidTV;
    
    constructor() {
        this.adb = new AndroidTV();
    }
    
    async launchApp(packageName: string) {
        await this.adb.startApp(packageName);
    }
    
    async navigateHome() {
        await this.adb.sendKeyEvent('HOME');
    }
}
```

2. **Essential Tools & Libraries**:
- ADB (Android Debug Bridge): Core tool for Fire TV communication
- WebdriverIO: For UI automation
- Jest: Testing framework
- Appium: Mobile app automation
- Allure: Test reporting
- TypeScript: Type safety and better IDE support

3. **Framework Structure**:
```typescript
// Page Object Model approach
class PhiloPage {
    // Element selectors
    private readonly HOME_BUTTON = 'resource-id/home-button';
    private readonly GUIDE_BUTTON = 'resource-id/guide-button';
    
    // Actions
    async navigateToGuide(): Promise<void> {
        await this.clickElement(this.GUIDE_BUTTON);
    }
    
    async verifyHomeScreen(): Promise<boolean> {
        return await this.isElementVisible(this.HOME_BUTTON);
    }
}
```

### Q: Do I need a debug build to access the selectors of an application on FTV like Philo Streaming?
A: Yes, for most streaming applications like Philo on Fire TV, you'll need a debug build or special test build to properly access selectors and automate the application.

1. **Release Build Limitations**:
- Release builds typically have obfuscated code
- Element IDs are often minimized
- Resource IDs may be stripped
- Automation hooks are disabled
- Security measures prevent easy inspection

2. **Debug Build Advantages**:
- Full access to resource IDs
- Unobfuscated element names
- Enabled testing hooks
- Ability to use UI Automator
- Better error logging
- Access to development features

3. **Options Without Debug Build**:
```typescript
// With Debug Build
class PhiloAutomation {
    async navigateToShow(showName: string) {
        // Can use proper selectors
        await this.findElementById('search_button').click();
        await this.findElementById('search_input').sendText(showName);
    }
}

// Without Debug Build (less reliable)
class PhiloAutomationLimited {
    async navigateToShow() {
        // Have to use coordinates or basic remote commands
        await this.sendKeyEvent('DPAD_CENTER');
        await this.sendKeyEvent('DPAD_DOWN');
    }
}
```

### Q: What about Amazon's Fire App Builder (FAB)?
A: Fire App Builder (FAB) is a development tool created by Amazon to simplify the process of creating media streaming apps for Fire TV. However, it cannot be used for testing automation purposes.

1. **FAB's Purpose**:
- For building new streaming apps
- Not a testing or automation tool
- Can't be used to automate existing third-party apps

2. **Cost**:
- FAB itself is free to use
- Only need to pay $99/year developer account fee for publishing
- No cost for development and testing

3. **For Testing Instead Use**:
- ADB (Android Debug Bridge)
- UI Automator
- Espresso
- Android Testing Support Library

## Best Practices for Fire TV Automation

1. **Element Location**:
- Use resource IDs when available
- Implement robust element waiting
- Handle focus states properly
- Use reliable selectors

2. **Test Organization**:
- Implement Page Object Model
- Separate test logic from automation logic
- Create reusable components
- Maintain test data separately

3. **Error Handling**:
- Implement robust retry mechanisms
- Add detailed logging
- Take screenshots on failures
- Record test sessions
- Implement recovery procedures

4. **Performance Testing**:
- Monitor app performance
- Track memory usage
- Monitor network conditions
- Verify streaming quality

5. **Test Reporting**:
- Generate detailed reports
- Include screenshots
- Log all interactions
- Track test metrics
- Monitor test trends 