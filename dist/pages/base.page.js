"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
class BasePage {
    constructor(driver) {
        this.driver = driver;
    }
    /**
     * Wait for element to be displayed
     */
    async waitForElement(selector, timeout = 10000) {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    }
    /**
     * Get element by resource ID
     */
    async getElementById(resourceId) {
        return await this.waitForElement(`android=resourceId("${resourceId}")`);
    }
    /**
     * Get element by text
     */
    async getElementByText(text) {
        return await this.waitForElement(`android=text("${text}")`);
    }
    /**
     * Get all clickable elements on the page
     */
    async getClickableElements() {
        return await this.driver.$$('android=clickable(true)');
    }
}
exports.BasePage = BasePage;
