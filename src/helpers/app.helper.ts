import { remote, Browser } from 'webdriverio';
import { fireTVCapabilities, androidTVCapabilities } from '../config/capabilities';
import { exec } from 'child_process';
import { GmailHelper } from './gmail.helper';
import { LoginPage } from '../fireTVPages/login.page';
import { LoginPage as AndroidLoginPage } from '../androidTVPages/login.page';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { promisify } from 'util';
import fetch from 'node-fetch';

interface VersionManifest {
    version: string;
}

const execAsync = promisify(exec);

export class AppHelper {
    private static driver: Browser;
    static currentDeviceType: 'fireTV' | 'androidTV' | null = null;
    static appPackage = 'com.philo.philo'; // Default to Fire TV package

    // Placeholder for the package source URL - to be implemented based on actual source
    private static readonly PACKAGE_SOURCE_URL = 'https://example.com/philo/latest';

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
        console.log('\n=== Detecting Device Type ===');
        const fireTVIP = process.env.FIRE_TV_IP;
        const androidTVIP = process.env.ANDROID_TV_IP;
        
        console.log('Fire TV IP:', fireTVIP);
        console.log('Android TV IP:', androidTVIP);
        console.log('Fire TV Port:', process.env.FIRE_TV_PORT);
        console.log('Android TV Port:', process.env.ANDROID_TV_PORT);

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
        console.log('\n=== Initializing WebDriver ===');
        if (!this.driver) {
            try {
                // Detect device type if not already set
                if (!this.currentDeviceType) {
                    console.log('Device type not set, detecting...');
                    this.currentDeviceType = await this.detectDeviceType();
                    if (!this.currentDeviceType) {
                        throw new Error('No supported device detected');
                    }
                }

                console.log('Using device type:', this.currentDeviceType);
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
        console.log('\n=== Starting Philo Login Process ===');
        try {
            // Ensure device type is detected
            if (!this.currentDeviceType) {
                console.log('Device type not set, detecting...');
                this.currentDeviceType = await this.detectDeviceType();
                if (!this.currentDeviceType) {
                    throw new Error('Failed to detect device type');
                }
            }
            
            console.log('Current device type:', this.currentDeviceType);

            // Initialize driver if not already initialized
            console.log('Launching Philo app...');
            const driver = await this.launchPhiloApp();
            console.log('App launched successfully');

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
            console.log('Looking for sign-in button...');
            const signInButton = await driver.$('android=text("Sign in")');
            if (!signInButton) {
                throw new Error('Sign in button not found');
            }
            console.log('Found sign-in button, clicking...');
            await signInButton.click();

            // Use the correct login page based on device type
            console.log('Initializing login page...');
            const loginPage = this.currentDeviceType === 'androidTV' 
                ? new AndroidLoginPage(driver)
                : new LoginPage(driver);

            console.log('Clearing input field...');
            await loginPage.clearInput();
            console.log('Entering email from environment...');
            await loginPage.enterEmailFromEnv();
            console.log('Clicking submit button...');
            await loginPage.clickOnSubmitButton();

            // Wait for email to be sent and process it
            console.log('Waiting for email to be delivered...');
            await driver.pause(10000);
            
            console.log('\nStep 3: Processing sign-in email...');
            console.log(`Using device IP: ${deviceIp} for device type: ${this.currentDeviceType}`);
            const success = await GmailHelper.processSignInEmail(deviceIp);
            
            if (!success) {
                throw new Error('Failed to process sign-in email');
            }

            console.log('✅ Successfully processed sign-in email');
            return true;
        } catch (error) {
            console.error('\n=== Login Process Failed ===');
            console.error('Error details:', error);
            if (error instanceof Error) {
                console.error('Error stack:', error.stack);
            }
            throw error;
        }
    }

    /**
     * Get the currently installed version of the app on the device
     * @returns Promise<string> The version number of the installed app
     */
    static async getInstalledVersion(): Promise<string> {
        const deviceId = this.getDeviceId();
        const packageName = this.currentDeviceType === 'fireTV' 
            ? 'com.philo.philo'
            : 'com.philo.philo.google';

        try {
            const { stdout } = await execAsync(`adb -s ${deviceId} shell dumpsys package ${packageName} | grep versionName`);
            const versionMatch = stdout.match(/versionName=([^\s]+)/);
            return versionMatch ? versionMatch[1] : '';
        } catch (error) {
            console.error('Error getting installed version:', error);
            throw error;
        }
    }

    /**
     * Get the latest version available from the package source
     * @returns Promise<string> The version number of the latest available package
     */
    static async getLatestVersion(): Promise<string> {
        try {
            // Method 1: Check from a version manifest file
            const manifestUrl = 'https://example.com/philo/version.json';
            const response = await fetch(manifestUrl);
            const manifest = await response.json() as VersionManifest;
            
            if (manifest && manifest.version) {
                return manifest.version;
            }

            // Method 2: Check from package.json if available
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (packageJson.version) {
                    return packageJson.version;
                }
            }

            // Method 3: Check from a local version file
            const versionFilePath = path.join(process.cwd(), 'version.txt');
            if (fs.existsSync(versionFilePath)) {
                const version = fs.readFileSync(versionFilePath, 'utf8').trim();
                if (version) {
                    return version;
                }
            }

            // Method 4: Check from environment variable
            const envVersion = process.env.PHILO_APP_VERSION;
            if (envVersion) {
                return envVersion;
            }

            throw new Error('Could not determine latest version from any available source');
        } catch (error) {
            console.error('Error getting latest version:', error);
            throw error;
        }
    }

    /**
     * Compare two version strings
     * @param v1 First version string
     * @param v2 Second version string
     * @returns number -1 if v1 < v2, 0 if v1 = v2, 1 if v1 > v2
     */
    private static compareVersions(v1: string, v2: string): number {
        const v1Parts = v1.split('.').map(Number);
        const v2Parts = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            if (v1Part < v2Part) return -1;
            if (v1Part > v2Part) return 1;
        }
        return 0;
    }

    /**
     * Download the latest version of the app from the package source
     * @returns Promise<string> Path to the downloaded file
     */
    private static async downloadLatestVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            const downloadDir = path.join(process.cwd(), 'downloads');
            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir);
            }

            const filePath = path.join(downloadDir, 'philo-latest.apk');
            const file = fs.createWriteStream(filePath);

            https.get(this.PACKAGE_SOURCE_URL, response => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filePath);
                });
            }).on('error', err => {
                fs.unlink(filePath, () => reject(err));
            });
        });
    }

    /**
     * Uninstall the current version of the app
     */
    private static async uninstallApp(): Promise<void> {
        const deviceId = this.getDeviceId();
        const packageName = this.currentDeviceType === 'fireTV' 
            ? 'com.philo.philo'
            : 'com.philo.philo.google';

        try {
            await execAsync(`adb -s ${deviceId} uninstall ${packageName}`);
            console.log('App uninstalled successfully');
        } catch (error) {
            console.error('Error uninstalling app:', error);
            throw error;
        }
    }

    /**
     * Install the app from an APK file
     * @param apkPath Path to the APK file
     */
    private static async installApp(apkPath: string): Promise<void> {
        const deviceId = this.getDeviceId();

        try {
            await execAsync(`adb -s ${deviceId} install ${apkPath}`);
            console.log('App installed successfully');
        } catch (error) {
            console.error('Error installing app:', error);
            throw error;
        }
    }

    /**
     * Check and update the app version if needed
     * @returns Promise<boolean> True if update was performed, false otherwise
     */
    static async checkAndUpdateVersion(): Promise<boolean> {
        try {
            // Get current and latest versions
            const installedVersion = await this.getInstalledVersion();
            const latestVersion = await this.getLatestVersion();

            console.log(`Installed version: ${installedVersion}`);
            console.log(`Latest version: ${latestVersion}`);

            // Compare versions
            if (this.compareVersions(installedVersion, latestVersion) < 0) {
                console.log('Update needed. Starting update process...');

                // Download latest version
                const apkPath = await this.downloadLatestVersion();

                // Uninstall current version
                await this.uninstallApp();

                // Install new version
                await this.installApp(apkPath);

                // Clean up downloaded file
                fs.unlinkSync(apkPath);

                return true;
            }

            console.log('App is up to date');
            return false;
        } catch (error) {
            console.error('Error during version check and update:', error);
            throw error;
        }
    }
} 