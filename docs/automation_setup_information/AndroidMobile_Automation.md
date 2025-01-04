# Android Mobile Automation Guide

## Core Requirements

1. **Essential Tools**:
- Android Studio: IDE and Android SDK
  1. [ ] Download Android Studio from https://developer.android.com/studio
  2. [ ] Run the installer and follow the setup wizard
  3. [ ] During installation, ensure "Android SDK" and "Android Virtual Device" are selected
  4. [ ] Launch Android Studio and complete the initial setup wizard
  5. [ ] Go to Tools > SDK Manager to install additional SDK platforms if needed

- ADB (Android Debug Bridge):
  1. [ ] ADB comes with Android SDK Platform Tools
  2. [ ] Add platform-tools to system PATH:
     - [ ] Windows: Add `%LOCALAPPDATA%\Android\Sdk\platform-tools`
     - [ ] macOS/Linux: Add `$HOME/Library/Android/sdk/platform-tools`
  3. [ ] Verify installation: `adb --version`
  4. [ ] Connect device and run `adb devices` to verify connection

- Appium:
  1. [ ] Install Node.js from https://nodejs.org/
  2. [ ] Install Appium using npm:
     ```bash
     npm install -g appium
     ```
  3. [ ] Install Appium Doctor:
     ```bash
     npm install -g appium-doctor
     ```
  4. [ ] Run `appium-doctor` to verify setup
  5. [ ] Install Appium Inspector for GUI element inspection
  6. [ ] Start Appium server: `appium`

- UIAutomator/Espresso:
  1. [ ] Add dependencies to app's build.gradle:
     ```gradle
     dependencies {
         androidTestImplementation 'androidx.test.uiautomator:uiautomator:2.2.0'
         androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
     }
     ```
  2. [ ] Sync project with gradle files
  3. [ ] Enable testing support in Android Studio

- TypeScript/Java Setup:
  1. [ ] For TypeScript:
     ```bash
     npm install -g typescript
     npm install -g ts-node
     ```
  2. [ ] Initialize TypeScript project:
     ```bash
     npm init -y
     npm install typescript @types/node --save-dev
     npx tsc --init
     ```
  3. [ ] For Java:
     - [ ] Install JDK (version 8 or higher)
     - [ ] Set JAVA_HOME environment variable
     - [ ] Add Java bin directory to PATH

- Android SDK Platform Tools:
  1. [ ] Open Android Studio > SDK Manager
  2. [ ] Select "SDK Tools" tab
  3. [ ] Check "Android SDK Platform-Tools"
  4. [ ] Click Apply to install
  5. [ ] Verify installation:
     ```bash
     adb version
     fastboot --version
     ```

- Android Emulator/Physical Device Setup:
  1. [ ] Emulator Setup:
     - [ ] Open Android Studio > Device Manager
     - [ ] Click "Create Device"
     - [ ] Select hardware profile and system image
     - [ ] Configure device settings and finish
  2. [ ] Physical Device Setup:
     - [ ] Enable Developer Options (tap Build Number 7 times)
     - [ ] Enable USB Debugging
     - [ ] Connect device via USB
     - [ ] Accept debugging authorization prompt
     - [ ] Verify with `adb devices`

2. **Framework Setup Example**:
```typescript
import { AndroidDriver } from 'appium-android-driver';
import { UIAutomator2 } from 'appium-uiautomator2-driver';

class AndroidAutomation {
    private driver: AndroidDriver;
    
    async setup() {
        this.driver = await new AndroidDriver({
            platformName: 'Android',
            automationName: 'UiAutomator2',
            deviceName: 'Pixel_6',
            app: '/path/to/app.apk',
            appPackage: 'com.example.app',
            appActivity: 'MainActivity'
        });
    }
    
    async teardown() {
        await this.driver.quit();
    }
}
```

## Key Components

1. **Element Location Strategies**:
```typescript
class ElementFinding {
    async findElements() {
        // By resource ID
        await this.driver.findElement('id', 'com.app.id:id/button');
        
        // By accessibility ID
        await this.driver.findElement('~accessibility_id');
        
        // By XPath
        await this.driver.findElement('xpath', '//android.widget.Button');
        
        // By class name
        await this.driver.findElement('className', 'android.widget.EditText');
        
        // By content-desc
        await this.driver.findElement('-android uiautomator', 'new UiSelector().description("Login")');
    }
}
```

2. **Gesture Handling**:
```typescript
class GestureAutomation {
    async performGestures() {
        // Tap
        await this.driver.tap(element);
        
        // Swipe
        await this.driver.swipe(startX, startY, endX, endY);
        
        // Long press
        await this.driver.longPress(element, 2000);
        
        // Scroll
        await this.driver.execute('mobile: scroll', {
            direction: 'down',
            element: scrollElement
        });
        
        // Multi-touch
        await this.driver.performMultiAction([
            [tap1, tap2],
            [press, moveTo, release]
        ]);
    }
}
```

3. **App Interaction**:
```typescript
class AppInteraction {
    async appControls() {
        // App state
        await this.driver.background(5);
        await this.driver.closeApp();
        await this.driver.launchApp();
        await this.driver.reset();
        
        // Context switching
        await this.driver.context('NATIVE_APP');
        await this.driver.context('WEBVIEW');
        
        // Notifications
        await this.driver.openNotifications();
    }
}
```

## Advanced Features

1. **Performance Monitoring**:
```typescript
class PerformanceMonitor {
    async captureMetrics() {
        // CPU usage
        const cpuInfo = await this.driver.execute('mobile: shell', {
            command: 'dumpsys cpuinfo'
        });
        
        // Memory usage
        const memInfo = await this.driver.execute('mobile: shell', {
            command: 'dumpsys meminfo'
        });
        
        // Battery stats
        const batteryInfo = await this.driver.execute('mobile: shell', {
            command: 'dumpsys battery'
        });
        
        // Network stats
        const networkStats = await this.driver.execute('mobile: shell', {
            command: 'dumpsys netstats'
        });
    }
}
```

2. **Debug Tools**:
```typescript
class DebugTools {
    async debuggingHelpers() {
        // Take screenshot
        await this.driver.takeScreenshot();
        
        // Record screen
        await this.driver.startRecordingScreen();
        
        // Get logs
        const logs = await this.driver.getLogs('logcat');
        
        // Device info
        const info = await this.driver.getDeviceInfo();
    }
}
```

## Best Practices

1. **Test Organization**:
- Implement Page Object Model
- Use data-driven testing
- Create reusable components
- Maintain test data separately
- Use explicit waits

2. **Element Location**:
- Prefer resource IDs over XPath
- Use accessibility IDs
- Implement robust waiting mechanisms
- Handle dynamic content
- Create stable selectors

3. **Error Handling**:
```typescript
class ErrorHandling {
    async handleErrors() {
        try {
            await this.performAction();
        } catch (error) {
            // Screenshot
            await this.driver.takeScreenshot();
            
            // Logs
            await this.driver.getLogs('logcat');
            
            // Recovery
            await this.recoverFromError();
        }
    }
}
```

## Common Challenges and Solutions

1. **Device Fragmentation**:
- Use responsive design testing
- Test on different screen sizes
- Handle different Android versions
- Account for manufacturer customizations
- Test on various device types

2. **Performance Testing**:
```typescript
class PerformanceTests {
    async measurePerformance() {
        // App launch time
        await this.measureLaunchTime();
        
        // UI responsiveness
        await this.measureUIResponse();
        
        // Memory leaks
        await this.monitorMemoryUsage();
        
        // Battery consumption
        await this.trackBatteryUsage();
    }
}
```

3. **Security Testing**:
```typescript
class SecurityTests {
    async securityChecks() {
        // Permission handling
        await this.verifyPermissions();
        
        // Data encryption
        await this.checkEncryption();
        
        // Network security
        await this.verifySSLPinning();
    }
}
```

## Development Setup

1. **Environment Setup**:
- Install Android Studio
- Configure Android SDK
- Set up Appium server
- Configure test framework
- Set up CI/CD integration

2. **Device Setup**:
- Enable developer options
- Configure USB debugging
- Set up wireless debugging
- Install necessary certificates
- Configure app permissions

3. **Test Framework Setup**:
```typescript
class TestSetup {
    async configureFramework() {
        // Initialize test framework
        await this.setupTestRunner();
        
        // Configure reporting
        await this.setupReporting();
        
        // Set up test data
        await this.prepareTestData();
        
        // Configure CI integration
        await this.setupCI();
    }
}
``` 