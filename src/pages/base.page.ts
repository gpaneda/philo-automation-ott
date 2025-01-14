import { Browser, ChainablePromiseElement, Element } from 'webdriverio';
import { exec } from 'child_process';
import fs from 'fs';

export interface Selector {
    id: string;
    text?: string;
    contentDesc?: string;
    className: string;
    clickable: boolean;
    enabled: boolean;
    bounds: string;
}

export class BasePage {
    protected driver: Browser<'async'>;
    protected defaultTimeout = 5000; // Reduced from default 10000

    constructor(driver: Browser<'async'>) {
        this.driver = driver;
    }

    /**
     * Wait for an element to be present
     * @param selector The element selector
     * @param timeout Optional timeout in milliseconds
     * @returns The element when found
     */
    async waitForElement(selector: string, timeout: number = this.defaultTimeout) {
        const element = await this.driver.$(selector);
        await element.waitForExist({ timeout });
        return element;
    }

    /**
     * Check if an element is displayed
     * @param selector The element selector
     * @returns True if the element is displayed
     */
    async isElementDisplayed(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Click on an element
     * @param selector The element selector
     */
    async click(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.click();
    }

    /**
     * Get text from an element
     * @param selector The element selector
     * @returns The element text
     */
    async getText(selector: string): Promise<string> {
        const element = await this.waitForElement(selector);
        return await element.getText();
    }

    /**
     * Wait for a specific amount of time
     * @param seconds Number of seconds to wait
     */
    async wait(seconds: number): Promise<void> {
        await this.driver.pause(seconds * 1000);
    }

    async pause(ms: number): Promise<void> {
        await this.driver.pause(ms);
    }

    async verifyElementDisplayed(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.waitForDisplayed({ timeout: this.defaultTimeout });
    }

    async verifyElementWithText(selector: string, expectedText: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.waitForDisplayed({ timeout: this.defaultTimeout });
        const actualText = await element.getText();
        if (actualText !== expectedText) {
            throw new Error(`Expected text "${expectedText}" but found "${actualText}"`);
        }
    }

    async findPlayableTitle(maxAttempts: number = 5): Promise<boolean> {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                // Check for Play or Resume button
                const hasPlayButton = await this.isElementDisplayed('android=new UiSelector().className("android.view.View").description("Play")');
                const hasResumeButton = await this.isElementDisplayed('android=new UiSelector().className("android.widget.TextView").text("Resume")');
                
                if (hasPlayButton || hasResumeButton) {
                    console.log('Found a playable title');
                    return true;
                }
                
                console.log('No playable buttons found, going back to try next title');
                await this.driver.back();
                await this.driver.pause(2000);
                
                // Move to next title (press right)
                await this.driver.pressKeyCode(22); // Right key
                await this.driver.pause(2000);
                
                // Enter the new title
                await this.driver.pressKeyCode(66); // Enter key
                await this.driver.pause(3000);
                
            } catch (error) {
                console.log('Error while checking title:', error);
                // Go back in case of error
                await this.driver.back();
                await this.driver.pause(2000);
            }
        }
        
        console.log(`No playable title found after ${maxAttempts} attempts`);
        return false;
    }
} 