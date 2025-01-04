import { remote, Browser } from 'webdriverio';
import { fireTVCapabilities } from '../config/capabilities';

export class AppHelper {
    private static driver: Browser<'async'>;

    static async initializeDriver(): Promise<Browser<'async'>> {
        if (!this.driver) {
            try {
                this.driver = await remote({
                    hostname: 'localhost',
                    port: 4723,
                    logLevel: 'info',
                    path: '/',
                    capabilities: fireTVCapabilities
                });
            } catch (error) {
                console.error('Failed to initialize WebDriver:', error);
                throw error;
            }
        }
        return this.driver;
    }

    static async launchPhiloApp(): Promise<Browser<'async'>> {
        const driver = await this.initializeDriver();
        try {
            await driver.startActivity('com.philo.philo', 'com.philo.philo.app.activity.MainActivity');
            // Wait for app to launch
            await new Promise(resolve => setTimeout(resolve, 2000));
            return driver;
        } catch (error) {
            console.error('Failed to launch Philo app:', error);
            throw error;
        }
    }
} 