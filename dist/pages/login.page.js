"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const base_page_1 = require("./base.page");
const dotenv_1 = __importDefault(require("dotenv"));
const gmail_helper_1 = require("../helpers/gmail.helper");
// Load environment variables
dotenv_1.default.config();
class LoginPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        // Selectors
        this.selectors = {
            // Title and Instructions
            title: 'android=resourceId("com.philo.philo:id/auth_credentials_title")',
            subtitle: 'android=resourceId("com.philo.philo:id/auth_credentials_subtitle")',
            // Input Field
            emailInput: 'android=resourceId("com.philo.philo:id/auth_credentials_input_text_view")',
            // Action Buttons
            submitButton: 'android=new UiSelector().description("Submit")',
            submitContainer: 'android=new UiSelector().description("Submit")',
            switchToMobileButton: 'android=resourceId("com.philo.philo:id/auth_credentials_switch_input_type_button")',
            // Keyboard
            keypadContainer: 'android=resourceId("com.philo.philo:id/auth_credentials_keypad")',
            backspace: 'android=resourceId("com.philo.philo:id/keypad_backspace")',
            // Email Shortcuts
            gmailShortcut: 'android=resourceId("com.philo.philo:id/keypad_gmail_key")',
            yahooShortcut: 'android=resourceId("com.philo.philo:id/keypad_yahoo_key")',
            comShortcut: 'android=resourceId("com.philo.philo:id/keypad_com_key")',
            // Special Characters
            atSymbol: 'android=resourceId("com.philo.philo:id/keypad_at")',
            dot: 'android=resourceId("com.philo.philo:id/keypad_dot")',
            underscore: 'android=resourceId("com.philo.philo:id/keypad_underscore")',
            plus: 'android=resourceId("com.philo.philo:id/keypad_plus")',
            dash: 'android=resourceId("com.philo.philo:id/keypad_dash")',
            // Letters (a-z)
            ...Object.fromEntries(Array.from('abcdefghijklmnopqrstuvwxyz').map(letter => [
                letter,
                `android=resourceId("com.philo.philo:id/keypad_${letter}")`
            ])),
            // Numbers (0-9)
            ...Object.fromEntries(Array.from('0123456789').map(num => [
                num,
                `android=resourceId("com.philo.philo:id/keypad_${num}")`
            ])),
            // Bottom Row
            bottomRow: 'android=resourceId("com.philo.philo:id/keypad_bottom_row")'
        };
    }
    /**
     * Verify login page is displayed with all elements
     */
    async verifyLoginPageElements() {
        // Verify title and instructions
        await this.verifyElementDisplayed(this.selectors.title, 'Enter your email address');
        await this.verifyElementDisplayed(this.selectors.subtitle, "We'll send you a link.");
        // Verify input field
        await this.verifyElementDisplayed(this.selectors.emailInput);
        // Verify buttons
        await this.verifyElementDisplayed(this.selectors.submitButton);
        await this.verifyElementDisplayed(this.selectors.switchToMobileButton, 'Switch to mobile number');
        // Verify keyboard shortcuts
        await this.verifyElementDisplayed(this.selectors.gmailShortcut, '@gmail.com');
        await this.verifyElementDisplayed(this.selectors.yahooShortcut, '@yahoo.com');
        await this.verifyElementDisplayed(this.selectors.comShortcut, '.com');
    }
    /**
     * Type email using on-screen keyboard
     */
    async typeEmail(email) {
        for (const char of email.toLowerCase()) {
            if (char === '@') {
                await this.click(this.selectors.atSymbol);
            }
            else if (char === '.') {
                await this.click(this.selectors.dot);
            }
            else if (char === '_') {
                await this.click(this.selectors.underscore);
            }
            else if (char.match(/[a-z]/)) {
                await this.click(`android=resourceId("com.philo.philo:id/keypad_${char}")`);
            }
            else if (char.match(/[0-9]/)) {
                await this.click(`android=resourceId("com.philo.philo:id/keypad_${char}")`);
            }
            await this.pause(100); // Small pause between keypresses
        }
    }
    /**
     * Use email domain shortcuts
     */
    async useEmailShortcut(type) {
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
    async submit() {
        await this.click(this.selectors.submitButton);
    }
    /**
     * Switch to mobile number input
     */
    async switchToMobileInput() {
        await this.click(this.selectors.switchToMobileButton);
    }
    /**
     * Enter email from environment variables
     */
    async enterEmailFromEnv() {
        const email = process.env.PHILO_EMAIL;
        if (!email) {
            throw new Error('PHILO_EMAIL not found in environment variables');
        }
        await this.typeEmail(email);
    }
    /**
     * Complete login flow with email from environment
     */
    async loginWithEnvEmail() {
        await this.enterEmailFromEnv();
        await this.submit();
    }
    /**
     * Clear input using backspace
     */
    async clearInput() {
        const input = await this.driver.$(this.selectors.emailInput);
        const text = await input.getText();
        for (let i = 0; i < text.length; i++) {
            await this.click(this.selectors.backspace);
            await this.pause(100);
        }
    }
    async clickOnEmailInput() {
        await this.click(this.selectors.emailInput);
    }
    async clickOnSubmitButton() {
        await this.click(this.selectors.submitButton);
    }
    /**
     * Enter verification code using keyboard
     */
    async enterVerificationCode(code) {
        // Clear any existing input first
        await this.clearInput();
        // Type each digit of the code
        for (const digit of code) {
            await this.click(`android=resourceId("com.philo.philo:id/keypad_${digit}")`);
            await this.pause(100);
        }
    }
    /**
     * Complete verification flow
     */
    async completeVerification() {
        // Wait for email and process sign-in
        console.log('Processing sign-in email...');
        const success = await gmail_helper_1.GmailHelper.processSignInEmail();
        if (!success) {
            throw new Error('Failed to process sign-in email');
        }
        // Wait for device confirmation
        const confirmButton = await this.driver.$('android=text("Confirm sign in")');
        await confirmButton.waitForDisplayed({ timeout: 10000 });
        await confirmButton.click();
    }
}
exports.LoginPage = LoginPage;
