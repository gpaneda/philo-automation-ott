# App Installation Helper Documentation

## Overview
This document provides comprehensive information about the app installation and version management functionality in the Philo automation framework. It covers the implementation details, usage examples, and best practices for managing app versions during testing.

## Table of Contents
1. [Version Management Implementation](#version-management-implementation)
2. [Device Type Handling](#device-type-handling)
3. [Version Checking Methods](#version-checking-methods)
4. [Installation Process](#installation-process)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

## Version Management Implementation

### Core Components
The version management functionality is integrated into the `AppHelper` class, which handles:
- Device type detection (Fire TV vs Android TV)
- Package name management
- Version checking
- App installation/uninstallation
- ADB connection management

### Key Methods
```typescript
// Get installed version
static async getInstalledVersion(): Promise<string>

// Get latest version from source
static async getLatestVersion(): Promise<string>

// Compare versions
private static compareVersions(v1: string, v2: string): number

// Download latest version
private static async downloadLatestVersion(): Promise<string>

// Uninstall current version
private static async uninstallApp(): Promise<void>

// Install new version
private static async installApp(apkPath: string): Promise<void>

// Main update check and process
static async checkAndUpdateVersion(): Promise<boolean>
```

## Device Type Handling

### Device Detection
```typescript
const packageName = AppHelper.deviceType === 'fireTV' 
    ? 'com.philo.philo'
    : 'com.philo.philo.google';
```

The system automatically detects the device type and uses the appropriate package name:
- Fire TV: `com.philo.philo`
- Android TV: `com.philo.philo.google`

### Device ID Management
```typescript
const deviceId = AppHelper.getDeviceId();
```
Returns the device ID in the format `IP:PORT` for ADB commands.

## Version Checking Methods

### Getting Installed Version
```typescript
static async getInstalledVersion(): Promise<string> {
    const deviceId = this.getDeviceId();
    const packageName = this.currentDeviceType === 'fireTV' 
        ? 'com.philo.philo'
        : 'com.philo.philo.google';

    try {
        const { stdout } = await execAsync(`adb -s ${deviceId} shell dumpsys package ${packageName} | grep versionName`);
        const versionMatch = stdout.match(/versionName=([^\s]+)/);
        return versionMatch ? versionMatch[1] : '';
    } catch (error) {
        console.error('Error getting installed version:', error);
        throw error;
    }
}
```

### Getting Latest Version
```typescript
static async getLatestVersion(): Promise<string> {
    try {
        // Method 1: Check from a version manifest file
        const manifestUrl = 'https://example.com/philo/version.json';
        const response = await fetch(manifestUrl);
        const manifest = await response.json();
        
        if (manifest && manifest.version) {
            return manifest.version;
        }

        // Method 2: Check from package.json
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (packageJson.version) {
                return packageJson.version;
            }
        }

        // Method 3: Check from a local version file
        const versionFilePath = path.join(process.cwd(), 'version.txt');
        if (fs.existsSync(versionFilePath)) {
            const version = fs.readFileSync(versionFilePath, 'utf8').trim();
            if (version) {
                return version;
            }
        }

        // Method 4: Check from environment variable
        const envVersion = process.env.PHILO_APP_VERSION;
        if (envVersion) {
            return envVersion;
        }

        throw new Error('Could not determine latest version from any available source');
    } catch (error) {
        console.error('Error getting latest version:', error);
        throw error;
    }
}
```

## Installation Process

### Version Comparison
```typescript
private static compareVersions(v1: string, v2: string): number {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        if (v1Part < v2Part) return -1;
        if (v1Part > v2Part) return 1;
    }
    return 0;
}
```

### Update Process
1. Get current version from device
2. Get latest version from source
3. Compare versions
4. If update needed:
   - Download new version
   - Uninstall old version
   - Install new version
   - Clean up downloaded file

## Usage Examples

### Basic Version Check and Update
```typescript
async function updateApp() {
    try {
        // Make sure device type is detected
        await AppHelper.detectDeviceType();
        
        // Check and update if needed
        const wasUpdated = await AppHelper.checkAndUpdateVersion();
        if (wasUpdated) {
            console.log('App was successfully updated');
        } else {
            console.log('App was already up to date');
        }
    } catch (error) {
        console.error('Failed to update app:', error);
    }
}
```

### Force Reinstall in Test Setup
```typescript
describe('Philo App Tests', () => {
    beforeAll(async () => {
        try {
            // Detect device type first
            await AppHelper.detectDeviceType();
            
            // Force reinstall the app
            console.log('Reinstalling app...');
            const apkPath = await AppHelper.downloadLatestVersion();
            await AppHelper.uninstallApp();
            await AppHelper.installApp(apkPath);
            fs.unlinkSync(apkPath); // Clean up
            
            // Initialize the driver and launch the app
            await AppHelper.launchPhiloApp();
        } catch (error) {
            console.error('Error in beforeAll:', error);
            throw error;
        }
    });

    // Your test cases here
    it('should do something', async () => {
        // Test code
    });
});
```

## Best Practices

1. **Version Source Management**
   - Choose one primary source for version information
   - Implement fallback sources in order of preference
   - Keep version information in a centralized location

2. **Error Handling**
   - Always include try-catch blocks
   - Log errors with meaningful messages
   - Clean up temporary files in case of errors

3. **Device Management**
   - Always detect device type before operations
   - Use appropriate package names for each device type
   - Verify device connection before operations

4. **Testing Considerations**
   - Consider force reinstalling for clean test state
   - Handle version mismatches gracefully
   - Log version information for debugging

5. **Security**
   - Use secure URLs for package downloads
   - Implement proper authentication if needed
   - Clean up sensitive information after use

## Configuration Requirements

1. **Environment Variables**
   - `PHILO_APP_VERSION`: Latest app version
   - `FIRE_TV_IP`: Fire TV device IP
   - `FIRE_TV_PORT`: Fire TV device port
   - `ANDROID_TV_IP`: Android TV device IP
   - `ANDROID_TV_PORT`: Android TV device port

2. **Package Source**
   - Update `PACKAGE_SOURCE_URL` with actual source
   - Implement proper version manifest format
   - Ensure secure download process

3. **File Structure**
   - Create `downloads` directory for temporary files
   - Maintain version files in appropriate locations
   - Follow project structure conventions

## Troubleshooting

Common issues and solutions:

1. **Version Detection Issues**
   - Verify ADB connection
   - Check package name correctness
   - Ensure proper permissions

2. **Installation Failures**
   - Check device storage
   - Verify APK file integrity
   - Ensure proper ADB permissions

3. **Source Access Problems**
   - Verify network connectivity
   - Check URL accessibility
   - Validate authentication if required 