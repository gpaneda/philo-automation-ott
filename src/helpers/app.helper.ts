import { remote, Browser } from 'webdriverio';
import { fireTVCapabilities } from '../config/capabilities';

export class AppHelper {
    private static driver: Browser;

    static async initializeDriver(): Promise<Browser> {
        if (!this.driver) {
            try {
                console.log('Initializing WebDriver with capabilities:', JSON.stringify(fireTVCapabilities, null, 2));
                this.driver = await remote({
                    hostname: 'localhost',
                    port: 4723,
                    logLevel: 'info',
                    path: '/wd/hub',
                    capabilities: fireTVCapabilities,
                    connectionRetryTimeout: 120000, // Increase connection timeout to 2 minutes
                    connectionRetryCount: 5
                });
                console.log('WebDriver initialized successfully');
            } catch (error) {
                console.error('Failed to initialize WebDriver:', error);
                throw error;
            }
        }
        return this.driver;
    }

    static async launchPhiloApp(): Promise<Browser> {
        console.log('Attempting to launch Philo app...');
        const driver = await this.initializeDriver();
        try {
            console.log('Starting Philo activity...');
            await driver.startActivity('com.philo.philo', 'com.philo.philo.app.activity.MainActivity');
            console.log('Waiting for app to launch...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Increased wait time to 5 seconds
            console.log('App launch completed');
            return driver;
        } catch (error) {
            console.error('Failed to launch Philo app:', error);
            throw error;
        }
    }
} 