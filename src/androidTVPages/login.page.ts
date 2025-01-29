import { Browser } from 'webdriverio';
import { BasePage } from './base.page';
import dotenv from 'dotenv';
import { GmailHelper } from '../helpers/gmail.helper';

// Load environment variables
dotenv.config();

export class LoginPage extends BasePage {
    // Selectors
    private selectors = {
        // Title and Instructions
        title: 'android=resourceId("com.philo.philo.google:id/auth_credentials_title")',
        subtitle: 'android=resourceId("com.philo.philo.google:id/auth_credentials_subtitle")',
        
        // Input Field
        emailInput: 'android=resourceId("com.philo.philo.google:id/auth_credentials_input_text_view")',
        
        // Action Buttons
        submitButton: 'android=new UiSelector().description("Submit")',
        submitContainer: 'android=new UiSelector().description("Submit")',
        switchToMobileButton: 'android=resourceId("com.philo.philo.google:id/auth_credentials_switch_input_type_button")',
        
        // Keyboard
        keypadContainer: 'android=resourceId("com.philo.philo.google:id/auth_credentials_keypad")',
        backspace: 'android=resourceId("com.philo.philo.google:id/keypad_backspace")',
        
        // Email Shortcuts
        gmailShortcut: 'android=resourceId("com.philo.philo.google:id/keypad_gmail_key")',
        yahooShortcut: 'android=resourceId("com.philo.philo.google:id/keypad_yahoo_key")',
        comShortcut: 'android=resourceId("com.philo.philo.google:id/keypad_com_key")',
        
        // Special Characters
        atSymbol: 'android=resourceId("com.philo.philo.google:id/keypad_at")',
        dot: 'android=resourceId("com.philo.philo.google:id/keypad_dot")',
        underscore: 'android=resourceId("com.philo.philo.google:id/keypad_underscore")',
        plus: 'android=resourceId("com.philo.philo.google:id/keypad_plus")',
        dash: 'android=resourceId("com.philo.philo.google:id/keypad_dash")',
        
        // Letters (a-z)
        ...Object.fromEntries(
            Array.from('abcdefghijklmnopqrstuvwxyz').map(letter => [
                letter,
                `android=resourceId("com.philo.philo.google:id/keypad_${letter}")`
            ])
        ),
        
        // Numbers (0-9)
        ...Object.fromEntries(
            Array.from('0123456789').map(num => [
                num,
                `android=resourceId("com.philo.philo.google:id/keypad_${num}")`
            ])
        ),
        
        // Bottom Row
        bottomRow: 'android=resourceId("com.philo.philo.google:id/keypad_bottom_row")'
    };

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    /**
     * Verify login page is displayed with all elements
     */
    async verifyLoginPageElements(): Promise<void> {
        // Verify title and instructions
        await this.verifyElementDisplayed(this.selectors.title);
        await this.verifyElementDisplayed(this.selectors.subtitle);
        
        // Verify input field
        await this.verifyElementDisplayed(this.selectors.emailInput);
        
        // Verify buttons
        await this.verifyElementDisplayed(this.selectors.submitButton);
        await this.verifyElementDisplayed(this.selectors.switchToMobileButton);
        
        // Verify keyboard shortcuts
        await this.verifyElementDisplayed(this.selectors.gmailShortcut);
        await this.verifyElementDisplayed(this.selectors.yahooShortcut);
        await this.verifyElementDisplayed(this.selectors.comShortcut);
    }

    /**
     * Type email using on-screen keyboard
     */
    async typeEmail(email: string): Promise<void> {
        for (const char of email.toLowerCase()) {
            if (char === '@') {
                await this.click(this.selectors.atSymbol);
            } else if (char === '.') {
                await this.click(this.selectors.dot);
            } else if (char === '_') {
                await this.click(this.selectors.underscore);
            } else if (char.match(/[a-z]/)) {
                await this.click(`android=resourceId("com.philo.philo.google:id/keypad_${char}")`);
            } else if (char.match(/[0-9]/)) {
                await this.click(`android=resourceId("com.philo.philo.google:id/keypad_${char}")`);
            }
            await this.pause(100); // Small pause between keypresses
        }
    }

    /**
     * Use email domain shortcuts
     */
    async useEmailShortcut(type: 'gmail' | 'yahoo' | 'com'): Promise<void> {
        switch (type) {
            case 'gmail':
                await this.click(this.selectors.gmailShortcut);
                break;
            case 'yahoo':
                await this.click(this.selectors.yahooShortcut);
                break;
            case 'com':
                await this.click(this.selectors.comShortcut);
                break;
        }
    }

    /**
     * Submit email
     */
    async submit(): Promise<void> {
        await this.click(this.selectors.submitButton);
    }

    /**
     * Switch to mobile number input
     */
    async switchToMobileInput(): Promise<void> {
        await this.click(this.selectors.switchToMobileButton);
    }

    /**
     * Enter email from environment variables
     */
    async enterEmailFromEnv(): Promise<void> {
        const email = process.env.PHILO_EMAIL;
        if (!email) {
            throw new Error('PHILO_EMAIL not found in environment variables');
        }
        await this.typeEmail(email);
    }

    /**
     * Complete login flow with email from environment
     */
    async loginWithEnvEmail(): Promise<void> {
        await this.enterEmailFromEnv();
        await this.submit();
    }

    /**
     * Clear input using backspace
     */
    async clearInput(): Promise<void> {
        const input = await this.driver.$(this.selectors.emailInput);
        const text = await input.getText();
        for (let i = 0; i < text.length; i++) {
            await this.click(this.selectors.backspace);
            await this.pause(100);
        }
    }

    async clickOnEmailInput(): Promise<void> {
        await this.click(this.selectors.emailInput);
    }

    async clickOnSubmitButton(): Promise<void> {
        await this.click(this.selectors.submitButton);
    }

    /**
     * Enter verification code using keyboard
     */
    async enterVerificationCode(code: string): Promise<void> {
        // Clear any existing input first
        await this.clearInput();
        
        // Type each digit of the code
        for (const digit of code) {
            await this.click(`android=resourceId("com.philo.philo.google:id/keypad_${digit}")`);
            await this.pause(100);
        }
    }

    /**
     * Complete verification flow
     */
    async completeVerification(): Promise<void> {
        // Wait for email and process sign-in
        console.log('Processing sign-in email...');
        const success = await GmailHelper.processSignInEmail(process.env.ANDROID_TV_IP);
        if (!success) {
            throw new Error('Failed to process sign-in email');
        }

        // Wait for device confirmation
        const confirmButton = await this.driver.$('android=text("Confirm sign in")');
        await confirmButton.waitForDisplayed({ timeout: 10000 });
        await confirmButton.click();
    }

    /**
     * Pause execution for a specified time
     * @param ms Time to pause in milliseconds
     */
    async pause(ms: number): Promise<void> {
        await this.driver.pause(ms);
    }
} 
