import { Browser, Element, ElementArray } from 'webdriverio';
import { config } from '@config/wdio.conf';

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
    
    constructor(driver?: Browser<'async'>) {
        this.driver = driver || (global as any).driver;
    }
    
    // Common selectors across pages
    protected commonSelectors = {
        // Landing Page Selectors
        landing: {
            // Buttons
            startTrialButton: 'android=text("Start your free trial")',
            signInButton: 'android=text("Sign in")',
            seeAllChannelsButton: 'android=text("See all channels")',
            
            // Images
            heroImage: 'android=className("android.widget.ImageView") && resourceId("com.philo.philo:id/hero_image")',
            philoLogo: 'android=className("android.widget.ImageView") && content-desc("Philo")',
            
            // Text Elements
            headerText: 'com.philo.philo:id/header_text',
            unlimitedDvrText: 'com.philo.philo:id/right_text_top',
            onDemandTitlesText: 'com.philo.philo:id/right_text_bottom',
            freeTrialText: 'com.philo.philo:id/left_text_top',
            noContractText: 'com.philo.philo:id/left_text_bottom',
            
            // Layout Elements
            mainLayout: 'com.philo.philo:id/select_login_action_layout',
            landingPage: 'com.philo.philo:id/landing_screen_page_1',
            dividerLine: 'com.philo.philo:id/text_line_divider_guideline'
        },
        
        // Auth Page Selectors (existing)
        auth: {
            emailInput: 'com.philo.philo:id/auth_credentials_input_text_view',
            submitButton: 'com.philo.philo:id/auth_credentials_submit_button',
            submitContainer: 'com.philo.philo:id/auth_credentials_submit_button_container',
            title: 'com.philo.philo:id/auth_credentials_title',
            switchInputType: 'com.philo.philo:id/auth_credentials_switch_input_type_button',
            disclaimer: 'com.philo.philo:id/auth_credentials_disclaimer',
            productInfo: 'com.philo.philo:id/auth_credentials_product_info_container',
            versionLabel: 'com.philo.philo:id/version_label'
        },
        keypad: {
            base: 'com.philo.philo:id/keypad_',
            container: 'com.philo.philo:id/auth_credentials_keypad',
            backspace: 'com.philo.philo:id/keypad_backspace',
            gmail: 'com.philo.philo:id/keypad_gmail_key',
            yahoo: 'com.philo.philo:id/keypad_yahoo_key',
            com: 'com.philo.philo:id/keypad_com_key',
            at: 'com.philo.philo:id/keypad_at',
            dot: 'com.philo.philo:id/keypad_dot',
            underscore: 'com.philo.philo:id/keypad_underscore',
            plus: 'com.philo.philo:id/keypad_plus',
            dash: 'com.philo.philo:id/keypad_dash'
        },
        // Letter keys a-z
        letters: Object.fromEntries(
            Array.from('abcdefghijklmnopqrstuvwxyz').map(letter => [
                letter,
                `com.philo.philo:id/keypad_${letter}`
            ])
        ),
        // Number keys 0-9
        numbers: Object.fromEntries(
            Array.from('0123456789').map(num => [
                num,
                `com.philo.philo:id/keypad_${num}`
            ])
        ),
        // Common UI elements
        ui: {
            logo: 'com.philo.philo:id/logo',
            rootView: 'com.philo.philo:id/activity_main_root_view',
            fragmentHost: 'com.philo.philo:id/fragment_host_main'
        }
    };

    /**
     * Get all selectors from current page
     */
    async gatherPageSelectors(): Promise<Selector[]> {
        const source = await this.driver.getPageSource();
        const selectors: Selector[] = [];
        
        // Parse XML and extract nodes with resource-id
        const nodes = source.match(/<node[^>]*>/g) || [];
        
        nodes.forEach(node => {
            const resourceId = node.match(/resource-id="([^"]+)"/)?.[1];
            if (resourceId) {
                selectors.push({
                    id: resourceId,
                    text: node.match(/text="([^"]+)"/)?.[1],
                    contentDesc: node.match(/content-desc="([^"]+)"/)?.[1],
                    className: node.match(/class="([^"]+)"/)?.[1] || '',
                    clickable: node.includes('clickable="true"'),
                    enabled: node.includes('enabled="true"'),
                    bounds: node.match(/bounds="([^"]+)"/)?.[1] || ''
                });
            }
        });
        
        return selectors;
    }

    /**
     * Get element by resource ID
     */
    async getElementById(resourceId: string): Promise<Element<'async'>> {
        return await this.waitForElement(`android=resourceId("${resourceId}")`);
    }

    /**
     * Get element by text
     */
    async getElementByText(text: string): Promise<Element<'async'>> {
        return await this.waitForElement(`android=text("${text}")`);
    }

    /**
     * Wait for element to be displayed
     */
    async waitForElement(selector: string, timeout = 10000): Promise<Element<'async'>> {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    }

    /**
     * Click on element
     */
    async click(selector: string): Promise<void> {
        const element = await this.waitForElement(selector);
        await element.click();
    }

    /**
     * Check if element is displayed
     */
    async isElementDisplayed(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }

    /**
     * Get text from element
     */
    async getText(selector: string): Promise<string> {
        const element = await this.waitForElement(selector);
        return await element.getText();
    }

    /**
     * Pause execution
     */
    async pause(ms: number): Promise<void> {
        await this.driver.pause(ms);
    }

    /**
     * Press key on Fire TV remote
     */
    async pressKey(keycode: number): Promise<void> {
        await this.driver.pressKeyCode(keycode);
    }

    /**
     * Navigate back
     */
    async back(): Promise<void> {
        await this.pressKey(4); // KEYCODE_BACK = 4
    }

    /**
     * Navigate home
     */
    async home(): Promise<void> {
        await this.pressKey(3); // KEYCODE_HOME = 3
    }

    /**
     * Get all clickable elements on the page
     */
    async getClickableElements(): Promise<ElementArray> {
        return await this.driver.$$('android=clickable(true)');
    }

    /**
     * Get element bounds
     */
    async getElementBounds(selector: string): Promise<{ x: number; y: number; width: number; height: number }> {
        const element = await this.waitForElement(selector);
        const location = await element.getLocation();
        const size = await element.getSize();
        return {
            x: location.x,
            y: location.y,
            width: size.width,
            height: size.height
        };
    }

    /**
     * Verify landing page elements are displayed
     */
    async verifyLandingPageElements(): Promise<void> {
        const selectors = this.commonSelectors.landing;
        
        // Verify buttons
        await this.verifyElementDisplayed(selectors.startTrialButton, 'Start your free trial');
        await this.verifyElementDisplayed(selectors.signInButton, 'Sign in');
        await this.verifyElementDisplayed(selectors.seeAllChannelsButton, 'See all channels');
        
        // Verify text elements
        await this.verifyElementDisplayed(selectors.headerText, 'Hit shows, blockbuster movies, live TV, and classic collections!');
        await this.verifyElementDisplayed(selectors.unlimitedDvrText, 'Unlimited DVR.');
        await this.verifyElementDisplayed(selectors.onDemandTitlesText, '80,000+ titles on-demand.');
        
        // Verify images
        await this.verifyElementDisplayed(selectors.heroImage);
        await this.verifyElementDisplayed(selectors.philoLogo);
    }

    /**
     * Verify element is displayed with optional text verification
     */
    protected async verifyElementDisplayed(selector: string, expectedText?: string): Promise<void> {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout: 5000 });
        
        if (expectedText) {
            const actualText = await element.getText();
            if (actualText !== expectedText) {
                throw new Error(`Element text mismatch. Expected: "${expectedText}", Got: "${actualText}"`);
            }
        }
    }
} 