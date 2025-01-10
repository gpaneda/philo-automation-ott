import { Browser, ChainablePromiseElement } from 'webdriverio';

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
    constructor(protected driver: Browser) {}

    async waitForElement(selector: string, timeout?: number): Promise<ChainablePromiseElement<WebdriverIO.Element>> {
        const element = await this.driver.$(selector);
        if (timeout) {
            await element.waitForDisplayed({ timeout });
        }
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
        await element.waitForDisplayed();
    }

    async click(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.click();
    }

    async getText(selector: string): Promise<string> {
        const element = await this.waitForElement(selector);
        return element.getText();
    }
} 