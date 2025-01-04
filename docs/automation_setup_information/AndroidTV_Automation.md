# Android TV Automation Guide

## Core Requirements

1. **Core Requirements**:
- ADB (Android Debug Bridge):
  1. [ ] Install via Android Studio:
     - [ ] Open Android Studio > SDK Manager
     - [ ] Select "SDK Tools" tab
     - [ ] Check "Android SDK Platform-Tools"
     - [ ] Click Apply to install
  2. [ ] Add to system PATH:
     - [ ] Windows: Add `%LOCALAPPDATA%\Android\Sdk\platform-tools`
     - [ ] macOS/Linux: Add `$HOME/Library/Android/sdk/platform-tools`
  3. [ ] Verify installation:
     ```bash
     adb --version
     adb devices
     ```
  4. [ ] For wireless debugging:
     ```bash
     # Connect TV via USB first
     adb tcpip 5555
     adb connect <TV-IP-ADDRESS>:5555
     ```

- UIAutomator:
  1. [ ] Add to project dependencies:
     ```gradle
     dependencies {
         androidTestImplementation 'androidx.test.uiautomator:uiautomator:2.2.0'
         androidTestImplementation 'androidx.test:runner:1.5.2'
         androidTestImplementation 'androidx.test:rules:1.5.0'
     }
     ```
  2. [ ] Enable in Android Studio:
     - [ ] Go to Build Variants
     - [ ] Select "Android Instrumented Tests"
  3. [ ] Configure test runner in build.gradle:
     ```gradle
     android {
         defaultConfig {
             testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
         }
     }
     ```

- Espresso:
  1. [ ] Add dependencies:
     ```gradle
     dependencies {
         androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
         androidTestImplementation 'androidx.test.espresso:espresso-contrib:3.5.1'
     }
     ```
  2. [ ] Enable accessibility checks:
     ```kotlin
     @Rule @JvmField
     val accessibilityChecks = AccessibilityChecks.enable()
     ```

2. **Device Setup**:
- Physical Android TV:
  1. [ ] Enable Developer Options:
     - [ ] Go to Settings > Device Preferences
     - [ ] Navigate to About
     - [ ] Click Build Number 7 times
  2. [ ] Enable USB Debugging:
     - [ ] Go to Developer Options
     - [ ] Enable USB debugging
     - [ ] Enable Network debugging
  3. [ ] Network Setup:
     ```bash
     # Get TV IP address from Settings > Network
     adb connect <TV-IP-ADDRESS>:5555
     ```

- Android TV Emulator:
  1. [ ] Launch from Android Studio:
     - [ ] Open Device Manager
     - [ ] Start Android TV AVD
  2. [ ] Verify connection:
     ```bash
     adb devices
     ```
  3. [ ] Configure display settings:
     ```bash
     adb shell wm size 1920x1080
     adb shell wm density 320
     ```

3. **Development Environment**:
- Project Setup:
  1. [ ] Create new Android project:
     - [ ] Select "Android TV" template
     - [ ] Configure project settings
     - [ ] Set minimum SDK level
  2. [ ] Configure build.gradle:
     ```gradle
     android {
         defaultConfig {
             minSdkVersion 21
             targetSdkVersion 33
             leanbackSupport true
         }
     }
     ```
  3. [ ] Install required dependencies:
     ```gradle
     dependencies {
         implementation 'androidx.leanback:leanback:1.0.0'
         implementation 'androidx.tvprovider:tvprovider:1.0.0'
     }
     ```

## Key Components

1. **UI Interaction Methods**:
```typescript
class TVInteractions {
    async navigationControls() {
        // D-pad navigation
        await this.device.pressKeyCode('DPAD_RIGHT');
        await this.device.pressKeyCode('DPAD_CENTER');
        
        // Find elements
        const playButton = await this.uiAutomator
            .findElement('resourceId', 'play_button');
        await playButton.click();
        
        // Text input
        await this.device.inputText('search_query');
    }
    
    async focusHandling() {
        // Handle Android TV focus
        await this.waitForFocus('playButton');
        await this.verifyFocusedState();
    }
}
```

2. **Element Location Strategies**:
```typescript
class ElementFinding {
    async findElements() {
        // By resource ID
        await this.findById('player_controls');
        
        // By text
        await this.findByText('Play Now');
        
        // By class
        await this.findByClass('android.widget.Button');
        
        // Complex selectors
        await this.uiAutomator.findElement(
            'new UiSelector().text("Play").focused(true)'
        );
    }
}
```

3. **Playback Verification**:
```typescript
class StreamingTests {
    async verifyPlayback() {
        // Check player state
        const isPlaying = await this.device
            .executeShellCommand('dumpsys media_session');
        
        // Verify video surface
        const videoView = await this.findById('exo_player_view');
        await this.verifyVideoPlaying(videoView);
        
        // Monitor streaming quality
        await this.captureMetrics({
            resolution: true,
            framerate: true,
            bitrate: true
        });
    }
}
```

## Performance Monitoring

1. **System Metrics**:
```typescript
class PerformanceMonitor {
    async monitorApp() {
        // CPU usage
        await this.device.shell('top -n 1');
        
        // Memory usage
        await this.device.shell('dumpsys meminfo package_name');
        
        // Network stats
        await this.device.shell('dumpsys netstats');
        
        // Frame metrics
        await this.device.shell('dumpsys gfxinfo package_name');
    }
}
```

2. **Error Handling**:
```typescript
class ErrorHandling {
    async handleErrors() {
        try {
            await this.performAction();
        } catch (error) {
            // Take screenshot
            await this.device.takeScreenshot();
            
            // Capture logs
            await this.device.logcat();
            
            // Recovery actions
            await this.recoverFromError();
        }
    }
    
    async recoverFromError() {
        // Return to home
        await this.device.pressHome();
        
        // Clear app data if needed
        await this.device.clearAppData('package_name');
        
        // Restart app
        await this.device.restartApp();
    }
}
```

## Best Practices

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

## Development Setup

1. **Initial Setup**:
- Install Android Studio
- Configure Android SDK
- Set up Android TV emulator
- Install necessary tools
- Configure ADB

2. **Device Configuration**:
- Enable developer options
- Configure network settings
- Set up debugging ports
- Install test certificates

3. **Testing Framework Setup**:
- Configure UIAutomator
- Set up Espresso
- Configure reporting tools
- Set up CI/CD integration 