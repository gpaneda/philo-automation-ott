import { config } from 'dotenv';

// Load environment variables
config();

export const fireTVCapabilities = {
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

 export const androidTVCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android TV',
    'appium:udid': `${process.env.ANDROID_TV_IP}:${process.env.ANDROID_TV_PORT}`,
    'appium:platformVersion': '11',
    'appium:appPackage': 'com.philo.philo.google',
    'appium:appActivity': 'com.philo.philo.app.activity.MainActivity',
    'appium:noReset': true,
    'appium:newCommandTimeout': 120000,
    'appium:adbExecTimeout': 180000,
    'appium:sessionCommandTimeout': 180000
}; 