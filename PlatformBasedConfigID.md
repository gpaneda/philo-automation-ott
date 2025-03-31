I'll help create a comprehensive markdown file that includes all the topics we discussed in our chat:

# Device ID Configuration Per Platform

## Table of Contents
1. [Overview](#overview)
2. [WebDriver Configuration](#webdriver-configuration)
3. [Platform Detection Methods](#platform-detection-methods)
4. [Device Configurations](#device-configurations)
5. [Implementation Structure](#implementation-structure)
6. [Error Handling](#error-handling)
7. [File Structure](#file-structure)

## Overview
This document outlines the implementation of platform-specific device identification and configuration for test automation across different TV platforms.

## WebDriver Configuration
```typescript
// Initial WebDriver setup with implicit waits
await this.driver.setTimeout({
    implicit: 15000,    // Wait up to 15 seconds for elements
    pageLoad: 40000,    // Wait up to 40 seconds for page loads
    script: 30000       // Wait up to 30 seconds for script execution
});
```

## Platform Detection Methods

### Fire TV & Android TV (Android-Based)
```bash
# Device identification via ADB
adb shell getprop ro.product.model
adb shell getprop ro.product.manufacturer
adb shell getprop ro.product.device
```

### Samsung TV (Tizen OS)
```javascript
// Device identification via Tizen API
tizen.systeminfo.getPropertyValue("BUILD", function(build) {
    const model = build.model;
    const manufacturer = "Samsung";
});
```

### LG TV (webOS)
```javascript
// Device identification via webOS Service Bridge
webOS.service.request("luna://com.webos.service.tv.systemproperty", {
    method: "getSystemInfo",
    onSuccess: function(response) {
        const model = response.modelName;
        const manufacturer = "LG";
    }
});
```

### Vizio TV (SmartCast)
- Uses Vizio's HTTP API
- Requires network connection and API authentication
- Device information available through REST endpoints

## Device Configurations

### Interface Definitions
```typescript
interface DeviceConfig {
    appPackage: string;
    manufacturer: string;
    model: string;
    deviceName: string;
    platform: PlatformType;
    pageObjects: PageObjects;
}

type PlatformType = 'FireTV' | 'AndroidTV' | 'SamsungTV' | 'LGTV' | 'VizioTV';

interface PageObjects {
    HomeScreen: typeof HomeScreenPage;
    Landing: typeof LandingPage;
    Search: typeof SearchPage;
    Player: typeof PlayerPage;
    Guide: typeof GuidePage;
    Settings: typeof SettingsPage;
}
```

### Sample Configurations

#### Fire TV
```typescript
{
    appPackage: 'com.philo.philo',
    manufacturer: 'Amazon',
    model: 'Fire TV Stick 4K',
    deviceName: 'AFTMM',
    platform: 'FireTV',
    pageObjects: {
        HomeScreen: FireTVHomeScreenPage,
        Landing: FireTVLandingPage,
        Search: FireTVSearchPage,
        Player: FireTVPlayerPage,
        Guide: FireTVGuidePage,
        Settings: FireTVSettingsPage
    }
}
```

[Similar configurations for Android TV, Samsung TV, LG TV, and Vizio TV...]

## Implementation Structure

### Platform Helper Class
```typescript
export class PlatformHelper {
    private static instance: PlatformHelper;
    private currentConfig: DeviceConfig | null = null;

    public static getInstance(): PlatformHelper {
        if (!PlatformHelper.instance) {
            PlatformHelper.instance = new PlatformHelper();
        }
        return PlatformHelper.instance;
    }

    public async initializePlatform(): Promise<DeviceConfig> {
        // Platform detection and configuration logic
    }
}
```

### Usage in Tests
```typescript
describe('Test Suite', () => {
    let deviceConfig: DeviceConfig;
    let driver: Browser;
    let pageObjects: any;

    beforeAll(async () => {
        // Detect device and load appropriate configuration
        deviceConfig = await detectDevice();
        
        // Initialize driver with device-specific capabilities
        driver = await initializeDriver(deviceConfig);
        
        // Load appropriate page objects
        pageObjects = deviceConfig.pageObjects;
    });

    // Tests now use device-specific configuration
    test('example test', async () => {
        const homePage = new pageObjects.HomeScreen(driver);
        // ... rest of test
    });
});


// platformHelper.ts

import { Browser } from 'webdriverio';

// Types and Interfaces
type PlatformType = 'FireTV' | 'AndroidTV' | 'SamsungTV' | 'LGTV' | 'VizioTV';

interface DeviceInfo {
    manufacturer: string;
    model: string;
    deviceName: string;
    platform: PlatformType;
}

interface PageObjects {
    HomeScreen: any;  // Replace 'any' with your actual page object types
    Landing: any;
    Search: any;
    Player: any;
    Guide: any;
    Settings: any;
}

interface DeviceConfig {
    appPackage: string;
    manufacturer: string;
    model: string;
    deviceName: string;
    platform: PlatformType;
    pageObjects: PageObjects;
}

export class PlatformHelper {
    private static instance: PlatformHelper;
    private currentConfig: DeviceConfig | null = null;
    private driver: Browser | null = null;

    // Device Configurations
    private readonly deviceConfigs: Record<string, DeviceConfig> = {
        // Fire TV Devices
        'AFTMM': {
            appPackage: 'com.philo.philo',
            manufacturer: 'Amazon',
            model: 'Fire TV Stick 4K',
            deviceName: 'AFTMM',
            platform: 'FireTV',
            pageObjects: {
                HomeScreen: FireTVHomeScreenPage,
                Landing: FireTVLandingPage,
                Search: FireTVSearchPage,
                Player: FireTVPlayerPage,
                Guide: FireTVGuidePage,
                Settings: FireTVSettingsPage
            }
        },
        // Add other device configs here...
    };

    private constructor() {}

    public static getInstance(): PlatformHelper {
        if (!PlatformHelper.instance) {
            PlatformHelper.instance = new PlatformHelper();
        }
        return PlatformHelper.instance;
    }

    private async detectPlatform(): Promise<PlatformType> {
        try {
            // First try Android-based detection (Fire TV & Android TV)
            const androidInfo = await this.detectAndroidPlatform();
            if (androidInfo) return androidInfo.platform;

            // Try other platforms
            const otherPlatformInfo = await this.detectOtherPlatforms();
            if (otherPlatformInfo) return otherPlatformInfo.platform;

            throw new Error('Unable to detect platform');
        } catch (error) {
            throw new Error(`Platform detection failed: ${error}`);
        }
    }

    private async detectAndroidPlatform(): Promise<DeviceInfo | null> {
        try {
            // Implementation for Android-based platform detection
            // This would use ADB commands in actual implementation
            return null;
        } catch {
            return null;
        }
    }

    private async detectOtherPlatforms(): Promise<DeviceInfo | null> {
        try {
            // Implementation for other platforms
            // This would use platform-specific APIs in actual implementation
            return null;
        } catch {
            return null;
        }
    }

    public async initializePlatform(): Promise<DeviceConfig> {
        try {
            // 1. Detect Platform
            const platform = await this.detectPlatform();
            console.log(`Detected platform: ${platform}`);

            // 2. Get Device Info based on platform
            const deviceInfo = await this.getDeviceInfo(platform);
            console.log(`Detected device: ${deviceInfo.deviceName}`);

            // 3. Get Device Configuration
            const config = this.deviceConfigs[deviceInfo.deviceName];
            if (!config) {
                throw new Error(`No configuration found for device: ${deviceInfo.deviceName}`);
            }

            this.currentConfig = config;
            return config;
        } catch (error) {
            throw new Error(`Platform initialization failed: ${error}`);
        }
    }

    private async getDeviceInfo(platform: PlatformType): Promise<DeviceInfo> {
        switch (platform) {
            case 'FireTV':
            case 'AndroidTV':
                return await this.getAndroidDeviceInfo();
            case 'SamsungTV':
                return await this.getSamsungDeviceInfo();
            case 'LGTV':
                return await this.getLGDeviceInfo();
            case 'VizioTV':
                return await this.getVizioDeviceInfo();
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    // Platform-specific device info methods
    private async getAndroidDeviceInfo(): Promise<DeviceInfo> {
        // Implementation for Android-based devices
        throw new Error('Not implemented');
    }

    private async getSamsungDeviceInfo(): Promise<DeviceInfo> {
        // Implementation for Samsung TV
        throw new Error('Not implemented');
    }

    private async getLGDeviceInfo(): Promise<DeviceInfo> {
        // Implementation for LG TV
        throw new Error('Not implemented');
    }

    private async getVizioDeviceInfo(): Promise<DeviceInfo> {
        // Implementation for Vizio TV
        throw new Error('Not implemented');
    }

    public getCurrentConfig(): DeviceConfig {
        if (!this.currentConfig) {
            throw new Error('Platform not initialized');
        }
        return this.currentConfig;
    }

    public getPageObjects(): PageObjects {
        if (!this.currentConfig) {
            throw new Error('Platform not initialized');
        }
        return this.currentConfig.pageObjects;
    }
}

// Usage in tests:
```typescript
describe('Test Suite', () => {
    let platformHelper: PlatformHelper;
    let deviceConfig: DeviceConfig;
    let pageObjects: PageObjects;

    beforeAll(async () => {
        try {
            // Initialize platform
            platformHelper = PlatformHelper.getInstance();
            deviceConfig = await platformHelper.initializePlatform();
            pageObjects = platformHelper.getPageObjects();

            // Now you can use the correct configuration and page objects
            console.log(`Running tests for ${deviceConfig.manufacturer} ${deviceConfig.model}`);
        } catch (error) {
            console.error('Test setup failed:', error);
            throw error;
        }
    });

    test('example test', async () => {
        const homePage = new pageObjects.HomeScreen(driver);
        // Test implementation using platform-specific page objects
    });
});
```

This template provides:
1. Platform detection
2. Device configuration management
3. Page object management
4. Type safety
5. Singleton pattern for platform helper
6. Error handling

The actual implementation of platform detection methods would need to be filled in based on your specific needs and the available APIs for each platform.

Would you like me to explain any part of this template in more detail?
```

Based on our discussion, here's a list of files you would need to create:

1. **Helper Files**:
   - `platformHelper.ts` - Main platform detection and configuration
   - `deviceConfig.ts` - Device configuration interfaces and mappings

2. **Platform-Specific Page Objects**:
   - **Fire TV**:
     - `fireTVPages/homeScreen.page.ts`
     - `fireTVPages/landing.page.ts`
     - `fireTVPages/search.page.ts`
     - `fireTVPages/player.page.ts`
     - `fireTVPages/guide.page.ts`
     - `fireTVPages/settings.page.ts`

   - **Android TV**:
     - `androidTVPages/homeScreen.page.ts`
     - `androidTVPages/landing.page.ts`
     - `androidTVPages/search.page.ts`
     - `androidTVPages/player.page.ts`
     - `androidTVPages/guide.page.ts`
     - `androidTVPages/settings.page.ts`

   - **Samsung TV**:
     - `samsungTVPages/homeScreen.page.ts`
     - `samsungTVPages/landing.page.ts`
     - `samsungTVPages/search.page.ts`
     - `samsungTVPages/player.page.ts`
     - `samsungTVPages/guide.page.ts`
     - `samsungTVPages/settings.page.ts`

   - **LG TV**:
     - `lgTVPages/homeScreen.page.ts`
     - `lgTVPages/landing.page.ts`
     - `lgTVPages/search.page.ts`
     - `lgTVPages/player.page.ts`
     - `lgTVPages/guide.page.ts`
     - `lgTVPages/settings.page.ts`

   - **Vizio TV**:
     - `vizioTVPages/homeScreen.page.ts`
     - `vizioTVPages/landing.page.ts`
     - `vizioTVPages/search.page.ts`
     - `vizioTVPages/player.page.ts`
     - `vizioTVPages/guide.page.ts`
     - `vizioTVPages/settings.page.ts`

3. **Base Classes**:
   - `base.page.ts` - Common functionality for all page objects
   - `base.test.ts` - Common test setup and teardown logic

4. **Type Definitions**:
   - `types/platform.types.ts` - Platform-specific type definitions
   - `types/device.types.ts` - Device configuration types

5. **Test Files**:
   - `tests/landing.test.ts`
   - `tests/search.test.ts`
   - `tests/playback.test.ts`
   - etc.

This structure allows for:
- Clear separation of platform-specific code
- Reusable base functionality
- Type-safe device configuration
- Organized test files
- Easy addition of new platforms or page objects
