"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePage = void 0;
const base_page_1 = require("./base.page");
class ProfilePage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
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
    }
    /**
     * Verify profile page elements are displayed
     */
    async verifyProfilePageElements() {
        await this.verifyElementDisplayed(this.selectors.profileHeader);
        await this.verifyElementDisplayed(this.selectors.accountName);
        await this.verifyElementDisplayed(this.selectors.emailLabel);
        await this.verifyElementDisplayed(this.selectors.settingsButton);
    }
    /**
     * Get profile name
     */
    async getProfileName() {
        const element = await this.driver.$(this.selectors.accountName);
        return await element.getText();
    }
    /**
     * Get email address
     */
    async getEmailAddress() {
        const element = await this.driver.$(this.selectors.emailLabel);
        return await element.getText();
    }
    /**
     * Click settings button
     */
    async openSettings() {
        await this.click(this.selectors.settingsButton);
    }
    /**
     * Click help button
     */
    async openHelp() {
        await this.click(this.selectors.helpButton);
    }
    /**
     * Sign out
     */
    async signOut() {
        await this.click(this.selectors.signOutButton);
        // Wait for confirmation dialog if needed
    }
    /**
     * Navigate back
     */
    async goBack() {
        await this.click(this.selectors.backButton);
    }
    /**
     * Navigate to home
     */
    async goHome() {
        await this.click(this.selectors.homeButton);
    }
    /**
     * Open device management
     */
    async openDeviceManagement() {
        await this.click(this.selectors.deviceManagement);
    }
    /**
     * Open billing history
     */
    async openBillingHistory() {
        await this.click(this.selectors.billingHistory);
    }
}
exports.ProfilePage = ProfilePage;
