import type { Options } from '@wdio/types';

export const config: any = {
    runner: 'local',
    specs: [
        './src/tests/**/*.ts'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Fire TV',
        'appium:appPackage': 'com.philo.philo',
        'appium:appActivity': 'com.philo.philo.MainActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 240,
        'appium:udid': `${process.env.FIRE_TV_IP}:${process.env.FIRE_TV_PORT}`,
        // Performance optimizations
        'appium:skipServerInstallation': true,
        'appium:skipDeviceInitialization': true,
        'appium:ignoreUnimportantViews': true,
        'appium:disableWindowAnimation': true,
        // Additional stability settings
        'appium:autoGrantPermissions': true,
        'appium:adbExecTimeout': 120000,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:androidInstallTimeout': 180000,
        'appium:avdLaunchTimeout': 180000,
        'appium:avdReadyTimeout': 180000,
        'appium:systemPort': 8201
    },
    {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android TV',
        'appium:appPackage': 'com.philo.philo.google', 
        'appium:appActivity': 'com.philo.philo.app.activity.MainActivity', 
        'appium:noReset': true,
        'appium:newCommandTimeout': 240,
        'appium:udid': `${process.env.ANDROID_TV_IP}:${process.env.ANDROID_TV_PORT}`,
        // Performance optimizations
        'appium:skipServerInstallation': true,
        'appium:skipDeviceInitialization': true,
        'appium:ignoreUnimportantViews': true,
        'appium:disableWindowAnimation': true,
        // Additional stability settings
        'appium:autoGrantPermissions': true,
        'appium:adbExecTimeout': 120000,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:androidInstallTimeout': 180000,
        'appium:avdLaunchTimeout': 180000,
        'appium:avdReadyTimeout': 180000,
        'appium:systemPort': 8202 // Different port for Android TV
    }
],
    logLevel: 'error',
    bail: 0,
    baseUrl: '',
    waitforTimeout: 30000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 5,
    services: ['appium'],
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineOpts: {
        defaultTimeoutInterval: 120000,
        expectationResultHandler: function(passed: boolean, assertion: any): void {
            // Handle test results
        }
    }
}; 