import { remote, Browser } from 'webdriverio';
import { fireTVCapabilities, androidTVCapabilities } from '../config/capabilities';
import { exec } from 'child_process';
import { GmailHelper } from './gmail.helper';
import { LoginPage } from '../fireTVPages/login.page';
import { LoginPage as AndroidLoginPage } from '../androidTVPages/login.page';

export class AppHelper {
    private static driver: Browser;
    private static currentDeviceType: 'fireTV' | 'androidTV' | null = null;
    static appPackage = 'com.philo.philo'; // Default to Fire TV package

    // Public getter for device type
    static get deviceType(): 'fireTV' | 'androidTV' | null {
        return this.currentDeviceType;
    }

    // Get the current device ID based on device type
    static getDeviceId(): string {
        if (!this.currentDeviceType) {
            throw new Error('Device type not detected');
        }

        const ip = this.currentDeviceType === 'fireTV' 
            ? process.env.FIRE_TV_IP 
            : process.env.ANDROID_TV_IP;
        const port = this.currentDeviceType === 'fireTV'
            ? process.env.FIRE_TV_PORT
            : process.env.ANDROID_TV_PORT;

        if (!ip || !port) {
            throw new Error(`${this.currentDeviceType} device IP or port not set in environment variables`);
        }

        return `${ip}:${port}`;
    }

    static async detectDeviceType(): Promise<'fireTV' | 'androidTV' | null> {
        const fireTVIP = process.env.FIRE_TV_IP;
        const androidTVIP = process.env.ANDROID_TV_IP;

        return new Promise((resolve) => {
            // Get list of connected devices
            exec('adb devices', (error, stdout) => {
                if (error) {
                    console.error('Error checking connected devices:', error);
                    resolve(null);
                    return;
                }

                console.log('Connected devices:', stdout);

                // Check if Fire TV is connected
                if (stdout.includes(`${fireTVIP}:${process.env.FIRE_TV_PORT}`)) {
                    console.log('Fire TV device detected');
                    this.currentDeviceType = 'fireTV';
                    this.appPackage = 'com.philo.philo';
                    resolve('fireTV');
                }
                // Check if Android TV is connected
                else if (stdout.includes(`${androidTVIP}:${process.env.ANDROID_TV_PORT}`)) {
                    console.log('Android TV device detected');
                    this.currentDeviceType = 'androidTV';
                    this.appPackage = 'com.philo.philo.google';
                    resolve('androidTV');
                }
                else {
                    console.log('No supported device detected');
                    resolve(null);
                }
            });
        });
    }

    static async initializeDriver(): Promise<Browser> {
        if (!this.driver) {
            try {
                // Detect device type if not already set
                if (!this.currentDeviceType) {
                    this.currentDeviceType = await this.detectDeviceType();
                }

                if (!this.currentDeviceType) {
                    throw new Error('No supported device detected');
                }

                const capabilities = this.currentDeviceType === 'fireTV' ? fireTVCapabilities : androidTVCapabilities;
                console.log(`Initializing WebDriver for ${this.currentDeviceType} with capabilities:`, JSON.stringify(capabilities, null, 2));
                
                this.driver = await remote({
                    hostname: 'localhost',
                    port: 4723,
                    logLevel: 'info',
                    path: '/wd/hub',
                    capabilities: capabilities,
                    connectionRetryTimeout: 120000,
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
        try {
            const driver = await this.initializeDriver();
            console.log(`Current device type: ${this.currentDeviceType}`);
            
            if (this.currentDeviceType === 'androidTV') {
                console.log('Launching Android TV app...');
                console.log('Package: com.philo.philo.google');
                
                const deviceId = this.getDeviceId();
                
                // First check if the app is installed
                const isInstalled = await new Promise((resolve) => {
                    exec(`adb -s ${deviceId} shell pm list packages com.philo.philo.google`, (error, stdout) => {
                        resolve(!error && stdout.includes('com.philo.philo.google'));
                    });
                });
                
                if (!isInstalled) {
                    console.error('Philo app not found on Android TV device');
                    throw new Error('Philo app not installed on Android TV device');
                }
                
                // Try to launch the app using the launcher intent
                try {
                    await new Promise((resolve, reject) => {
                        exec(
                            `adb -s ${deviceId} shell monkey -p com.philo.philo.google -c android.intent.category.LAUNCHER 1`,
                            (error, stdout, stderr) => {
                                if (error) {
                                    console.error('Failed to launch app via monkey:', stderr);
                                    reject(error);
                                } else {
                                    console.log('Successfully launched Android TV app via monkey');
                                    resolve(stdout);
                                }
                            }
                        );
                    });
                } catch (launchError) {
                    console.error('Failed to launch Android TV app:', launchError);
                    throw launchError;
                }
            } else {
                console.log('Launching Fire TV app...');
                await driver.startActivity('com.philo.philo', 'com.philo.philo.app.activity.MainActivity');
                console.log('Successfully started Fire TV activity');
            }
            
            console.log('Waiting for app to launch...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            console.log('App launch completed');
            return driver;
        } catch (error) {
            console.error('Failed to launch Philo app:', error);
            throw error;
        }
    }

    static async clearAppData(): Promise<void> {
        if (!this.currentDeviceType) {
            await this.detectDeviceType();
        }
        
        const deviceId = this.getDeviceId();
        const packageName = this.currentDeviceType === 'fireTV' 
            ? 'com.philo.philo'
            : 'com.philo.philo.google';

        return new Promise((resolve, reject) => {
            exec(`adb -s ${deviceId} shell pm clear ${packageName}`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Failed to clear app data:', stderr);
                    reject(error);
                } else {
                    console.log('App data cleared successfully');
                    resolve();
                }
            });
        });
    }

    static async loginToPhilo(): Promise<boolean> {
        try {
            console.log('\n=== Starting Philo Sign-in Process ===');
            
            // Initialize driver if not already initialized
            const driver = await this.launchPhiloApp();
            
            // Search for existing emails first
            console.log('Step 1: Searching for existing Philo emails...');
            const deviceIp = this.currentDeviceType === 'fireTV' 
                ? process.env.FIRE_TV_IP 
                : process.env.ANDROID_TV_IP;

            if (!deviceIp) {
                throw new Error('Device IP not found in environment variables');
            }

            console.log(`Using device IP: ${deviceIp} for device type: ${this.currentDeviceType}`);
            await GmailHelper.searchPhiloEmails(deviceIp);
            
            console.log('\nStep 2: Triggering sign-in email...');
            await driver.pause(2000);
            await driver.$('android=text("Sign in")').click();
            
            // Use the correct login page based on device type
            const loginPage = this.currentDeviceType === 'androidTV' 
                ? new AndroidLoginPage(driver)
                : new LoginPage(driver);

            await loginPage.clearInput();
            await loginPage.enterEmailFromEnv();
            await loginPage.clickOnSubmitButton();
            
            // Wait for email to be sent and process it
            console.log('Waiting for email to be delivered...');
            await driver.pause(10000);
            
            console.log('\nStep 3: Processing sign-in email...');
            console.log(`Using device IP: ${deviceIp} for device type: ${this.currentDeviceType}`);
            const success = await GmailHelper.processSignInEmail(deviceIp);
            
            if (success) {
                console.log('✅ Successfully processed sign-in email');
                
                // Wait for app to complete sign-in
                console.log('Step 4: Waiting for app to complete sign-in...');
                await driver.pause(10000);
                
                // Use correct package name for resource IDs
                const packageName = this.currentDeviceType === 'androidTV' ? 'com.philo.philo.google' : 'com.philo.philo';
                
                // Verify profile selection screen
                const profilesTitle = await driver.$(`android=resourceId("${packageName}:id/profiles_title")`);
                await profilesTitle.waitForDisplayed({ timeout: 20000 });
                
                // Click profile to enter homescreen
                const profileAvatar = await driver.$(`android=resourceId("${packageName}:id/avatar")`);
                await profileAvatar.waitForDisplayed({ timeout: 5000 });
                await profileAvatar.click();
                
                console.log('✅ Successfully completed sign-in process');
                return true;
            }
            
            console.log('❌ Sign-in process failed');
            return false;
        } catch (error) {
            console.error('❌ Error during sign-in process:', error);
            return false;
        }
    }
} 