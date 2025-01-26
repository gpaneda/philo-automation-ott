"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireTVCapabilities = void 0;
const dotenv_1 = require("dotenv");
// Load environment variables
(0, dotenv_1.config)();
exports.fireTVCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Fire TV',
    'appium:udid': `${process.env.FIRE_TV_IP}:${process.env.FIRE_TV_PORT}`,
    'appium:platformVersion': '8.1.2.5',
    'appium:appPackage': 'com.philo.philo',
    'appium:appActivity': 'com.philo.philo.app.activity.MainActivity',
    'appium:noReset': true,
    'appium:newCommandTimeout': 120000,
    'appium:adbExecTimeout': 180000,
    'appium:sessionCommandTimeout': 180000
};
