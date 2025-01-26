"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
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
        }],
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
        expectationResultHandler: function (passed, assertion) {
            // Handle test results
        }
    }
};
