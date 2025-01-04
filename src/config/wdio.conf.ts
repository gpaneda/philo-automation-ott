import dotenv from 'dotenv';
dotenv.config();

export const config = {
    runner: 'local',
    specs: [
        './src/tests/**/*.test.ts'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Fire TV',
        'appium:automationName': 'UiAutomator2',
        'appium:platformVersion': '9',
        'appium:app': process.env.APP_PACKAGE,
        'appium:appActivity': process.env.APP_ACTIVITY,
        'appium:noReset': false,
        'appium:fullReset': true
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '10000'),
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'jest',
    reporters: ['spec'],
    jasmineOpts: {
        defaultTimeoutInterval: 60000
    },
    appium: {
        command: 'appium',
        args: {
            address: process.env.APPIUM_HOST,
            port: parseInt(process.env.APPIUM_PORT || '4723'),
            relaxedSecurity: true
        }
    },
    before: async function (capabilities, specs) {
        await browser.setTimeout({ 'implicit': 5000 });
    },
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    }
}; 