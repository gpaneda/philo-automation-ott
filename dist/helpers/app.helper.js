"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHelper = void 0;
const webdriverio_1 = require("webdriverio");
const capabilities_1 = require("../config/capabilities");
class AppHelper {
    static async initializeDriver() {
        if (!this.driver) {
            try {
                this.driver = await (0, webdriverio_1.remote)({
                    hostname: 'localhost',
                    port: 4723,
                    logLevel: 'info',
                    path: '/',
                    capabilities: capabilities_1.fireTVCapabilities
                });
            }
            catch (error) {
                console.error('Failed to initialize WebDriver:', error);
                throw error;
            }
        }
        return this.driver;
    }
    static async launchPhiloApp() {
        const driver = await this.initializeDriver();
        try {
            await driver.startActivity('com.philo.philo', 'com.philo.philo.app.activity.MainActivity');
            // Wait for app to launch
            await new Promise(resolve => setTimeout(resolve, 2000));
            return driver;
        }
        catch (error) {
            console.error('Failed to launch Philo app:', error);
            throw error;
        }
    }
}
exports.AppHelper = AppHelper;
