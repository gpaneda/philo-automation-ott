import { BasePage } from './base.page';
import { Browser } from 'webdriverio';

export class SettingsPage extends BasePage {
    [x: string]: any;
    clickTopNavSettingsButtonElement() {
        throw new Error('Method not implemented.');
    }
    verifySettingsPage() {
        throw new Error('Method not implemented.');
    }
    public selectors = {
        // Header
        settingsHeader: 'android=resourceId("com.philo.philo:id/settings_header")',
        backButton: 'android=resourceId("com.philo.philo:id/back_button")',
        
        // Account Section
        signInInformation: 'android=text("Sign-in information")',
        addMobileNumber: 'android=text("Add mobile number")',
        addProfiles: 'android=text("Add profiles")',
        
        // Edit Options
        editButton: 'android=text("Edit")',
        
        // Playback Settings
        playbackSection: 'android=text("Playback")',
        startChannelPlayback: 'android=text("Start channel playback from...")',
        programBeginning: 'android=text("Program beginning")',
        
        // Version Info
        versionInfo: 'android=resourceId("com.philo.philo:id/version_info")',
        appVersion: 'android=resourceId("com.philo.philo:id/app_version")',
        
        // Sign Out
        signOutButton: 'android=text("Sign out")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Verify settings page elements are displayed
     */
    async verifySettingsPageElements(): Promise<void> {
        // Verify header elements
        await this.verifyElementDisplayed(this.selectors.settingsHeader);
        await this.verifyElementDisplayed(this.selectors.backButton);

        // Verify account section
        
        await this.verifyElementDisplayed(this.selectors.signInInformation);
        await this.verifyElementDisplayed(this.selectors.addMobileNumber);
        await this.verifyElementDisplayed(this.selectors.addProfiles);
        await this.verifyElementDisplayed(this.selectors.editButton);

        // Verify version info
        await this.verifyElementDisplayed(this.selectors.versionInfo);
        await this.verifyElementDisplayed(this.selectors.appVersion);

        // Verify sign out button
        await this.verifyElementDisplayed(this.selectors.signOutButton);
    }

    /**
     * Navigate back
     */
    async goBack(): Promise<void> {
        await this.click(this.selectors.backButton);
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        await this.click(this.selectors.signOutButton);
        // You might want to add handling for confirmation dialog here
    }

    /**
     * Get app version
     */
    async getAppVersion(): Promise<string> {
        const element = await this.driver.$(this.selectors.appVersion);
        return await element.getText();
    }
    /**
     * Verify settings page is displayed
     */
    async isSettingsPageDisplayed(): Promise<boolean> {
        try {
            await this.verifyElementDisplayed(this.selectors.settingsHeader);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Click edit button
     */
    async clickEdit(): Promise<void> {
        await this.click(this.selectors.editButton);
    }

    /**
     * Open start channel playback settings
     */
    async openStartChannelPlayback(): Promise<void> {
        await this.click(this.selectors.startChannelPlayback);
    }

    /**
     * Select program beginning option
     */
    async selectProgramBeginning(): Promise<void> {
        await this.click(this.selectors.programBeginning);
    }

    /**
     * Open sign-in information
     */
    async openSignInInformation(): Promise<void> {
        await this.click(this.selectors.signInInformation);
    }

    /**
     * Verify sign in information is displayed
     */
    async isSignInInformationDisplayed(): Promise<boolean> {
        try {
            await this.verifyElementDisplayed(this.selectors.signInInformation);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Add mobile number
     */
    async addMobileNumber(): Promise<void> {
        await this.click(this.selectors.addMobileNumber);
    }

    /**
     * Open add profiles
     */
    async openAddProfiles(): Promise<void> {
        await this.click(this.selectors.addProfiles);
    }

    async isStartChannelPlaybackDisplayed(): Promise<boolean> {
        try {
            await this.verifyElementDisplayed(this.selectors.startChannelPlayback);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Method to get the start channel playback selector
    public getStartChannelPlaybackSelector(): string {
        return this.selectors.startChannelPlayback;
    }

    /**
     * Check if an element is visible
     * @param selector The selector of the element to check
     */
    async isElementVisible(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed(); // Check if the element is displayed
        } catch (error) {
            console.error(`Error checking visibility of element: ${error}`);
            return false; // Return false if there's an error
        }
    }
} 