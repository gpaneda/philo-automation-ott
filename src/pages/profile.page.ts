import { BasePage } from './base.page';
import { Browser, Element } from 'webdriverio';

export class ProfilePage extends BasePage {
    public selectors = {
        // Profile Header
        profileHeader: 'android=text("Profile")',
        accountName: 'android=text("Account")',
        
        // Account Info
        emailLabel: 'android=text("Email")',
        subscriptionLabel: 'android=text("Subscription")',
        
        // Menu Items
        settingsButton: 'android=text("Settings")',
        helpButton: 'android=text("Help")',
        signOutButton: 'android=text("Sign Out")',
        
        // Navigation
        backButton: 'android=text("Back")',
        homeButton: 'android=text("Home")',

        // Additional Menu Items
        deviceManagement: 'android=text("Device Management")',
        billingHistory: 'android=text("Billing History")',
        privacyPolicy: 'android=text("Privacy Policy")',
        termsOfService: 'android=text("Terms of Service")',
        
        // Version Info
        versionLabel: 'android=text("Version")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Verify profile page elements are displayed
     */
    async verifyProfilePageElements(): Promise<void> {
        await this.verifyElementDisplayed(this.selectors.profileHeader);
        await this.verifyElementDisplayed(this.selectors.accountName);
        await this.verifyElementDisplayed(this.selectors.emailLabel);
        await this.verifyElementDisplayed(this.selectors.settingsButton);
    }

    /**
     * Get profile name
     */
    async getProfileName(): Promise<string> {
        const element = await this.driver.$(this.selectors.accountName);
        return await element.getText();
    }

    /**
     * Get email address
     */
    async getEmailAddress(): Promise<string> {
        const element = await this.driver.$(this.selectors.emailLabel);
        return await element.getText();
    }

    /**
     * Click settings button
     */
    async openSettings(): Promise<void> {
        await this.click(this.selectors.settingsButton);
    }

    /**
     * Click help button
     */
    async openHelp(): Promise<void> {
        await this.click(this.selectors.helpButton);
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        await this.click(this.selectors.signOutButton);
        // Wait for confirmation dialog if needed
    }

    /**
     * Navigate back
     */
    async goBack(): Promise<void> {
        await this.click(this.selectors.backButton);
    }

    /**
     * Navigate to home
     */
    async goHome(): Promise<void> {
        await this.click(this.selectors.homeButton);
    }

    /**
     * Open device management
     */
    async openDeviceManagement(): Promise<void> {
        await this.click(this.selectors.deviceManagement);
    }

    /**
     * Open billing history
     */
    async openBillingHistory(): Promise<void> {
        await this.click(this.selectors.billingHistory);
    }
} 