import { BasePage } from './base.page';
import { Browser, Element } from 'webdriverio';

export class ProfilePage extends BasePage {
    public selectors = {
        // Profile Header
        profileHeader: 'com.philo.philo.google:id/fragment_user_settings',
        userAvatar: 'com.philo.philo.google:id/user_avatar',
        userName: 'com.philo.philo.google:id/user_name',
        
        // Account Info
        emailLabel: 'com.philo.philo.google:id/sign_in_info_email',
        signInInfoLabel: 'android=text("Sign-in information")',
        
        // Buttons
        editProfileButton: 'android=text("Edit")',
        editEmailButton: 'android=text("Edit")',
        addMobileNumberButton: 'android=text("Add mobile number")',
        signOutButton: 'android=text("Sign out")',
        addProfilesButton: 'android=text("Add profiles")',
        
        // Navigation
        homeTab: 'android=text("Home")',
        
        // Playback Settings
        startAtLiveLabel: 'android=text("Start channel playback from…")',
        startAtLiveButton: 'android=text("Program beginning")',
        
        // Version Info
        deviceInfo: 'com.philo.philo.google:id/device_info',
        helpText: 'android=text("Need help? Visit help.philo.com.")',
        legalText: 'com.philo.philo.google:id/legal_text'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Verify profile page elements are displayed
     */
    async verifyProfilePageElements(): Promise<void> {
        await this.verifyElementDisplayed(this.selectors.profileHeader);
        await this.verifyElementDisplayed(this.selectors.userName);
        await this.verifyElementDisplayed(this.selectors.emailLabel);
        await this.verifyElementDisplayed(this.selectors.signInInfoLabel);
    }

    /**
     * Get profile name
     */
    async getProfileName(): Promise<string> {
        const element = await this.driver.$(this.selectors.userName);
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
     * Click edit profile button
     */
    async editProfile(): Promise<void> {
        await this.click(this.selectors.editProfileButton);
    }

    /**
     * Click edit email button
     */
    async editEmail(): Promise<void> {
        await this.click(this.selectors.editEmailButton);
    }

    /**
     * Add mobile number
     */
    async addMobileNumber(): Promise<void> {
        await this.click(this.selectors.addMobileNumberButton);
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        await this.click(this.selectors.signOutButton);
    }

    /**
     * Add profiles
     */
    async addProfiles(): Promise<void> {
        await this.click(this.selectors.addProfilesButton);
    }

    /**
     * Navigate to home
     */
    async goHome(): Promise<void> {
        await this.click(this.selectors.homeTab);
    }

    /**
     * Get device info
     */
    async getDeviceInfo(): Promise<string> {
        const element = await this.driver.$(this.selectors.deviceInfo);
        return await element.getText();
    }
} 