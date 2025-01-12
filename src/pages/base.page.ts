import { Browser, ChainablePromiseElement, Element } from 'webdriverio';

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
    protected readonly DEFAULT_TIMEOUT = 30000;

    constructor(protected driver: Browser<'async'>) {}

    async pause(ms: number): Promise<void> {
        await this.driver.pause(ms);
    }

    async waitForElement(selector: string, timeout?: number): Promise<ChainablePromiseElement<Element<'async'>>> {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout: timeout || this.DEFAULT_TIMEOUT });
        return element;
    }

    async isElementDisplayed(selector: string): Promise<boolean> {
        try {
            const element = await this.waitForElement(selector);
            return element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async verifyElementDisplayed(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.waitForDisplayed({ timeout: this.DEFAULT_TIMEOUT });
    }

    async click(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.click();
    }

    async getText(selector: string): Promise<string> {
        const element = await this.waitForElement(selector);
        return element.getText();
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