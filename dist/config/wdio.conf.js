"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },
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
            'appium:newCommandTimeout': 240
        }],
    logLevel: 'info',
    bail: 0,
    baseUrl: '',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineOpts: {
        defaultTimeoutInterval: 60000,
        expectationResultHandler: function (passed, assertion) {
        }
    },
    before: async function (capabilities) {
        if (browser) {
            await browser.setTimeout({ 'implicit': 5000 });
        }
    },
    afterTest: async function (test, context, results) {
        if (!results.passed) {
            if (browser) {
                await browser.takeScreenshot();
            }
        }
    }
};
