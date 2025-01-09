"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
class BasePage {
    constructor(driver) {
        this.driver = driver;
    }
    async waitForElement(selector, timeout) {
        const element = await this.driver.$(selector);
        if (timeout) {
            await element.waitForDisplayed({ timeout });
        }
        return element;
    }
    async isElementDisplayed(selector) {
        try {
            const element = await this.waitForElement(selector);
            return element.isDisplayed();
        }
        catch (error) {
            return false;
        }
    }
    async verifyElementDisplayed(selector) {
        const element = await this.waitForElement(selector);
        await element.waitForDisplayed();
    }
    async click(selector) {
        const element = await this.waitForElement(selector);
        await element.click();
    }
}
exports.BasePage = BasePage;
