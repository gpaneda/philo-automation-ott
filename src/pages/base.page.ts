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
            startTrialButton: 'android=new UiSelector().text("Start your free trial")',
            signInButton: 'android=new UiSelector().text("Sign in")',
            seeAllChannelsButton: 'android=new UiSelector().text("See all channels, including Free Channels")',
            exploreFreeChannelsButton: 'android=new UiSelector().text("Explore Free Channels")',

            // Images
            heroImage: 'android=new UiSelector().className("android.widget.ImageView").resourceId("com.philo.philo:id/hero_image")',
            philoLogo: 'android=new UiSelector().className("android.widget.ImageView").description("Philo")',

            // Text Elements
            headerText: 'android=new UiSelector().resourceId("com.philo.philo:id/header_text")',
            unlimitedDvrText: 'android=new UiSelector().resourceId("com.philo.philo:id/right_text_top")',
            onDemandTitlesText: 'android=new UiSelector().resourceId("com.philo.philo:id/right_text_bottom")',
            freeTrialText: 'android=new UiSelector().resourceId("com.philo.philo:id/left_text_top")',
            noContractText: 'android=new UiSelector().resourceId("com.philo.philo:id/left_text_bottom")',

            // Layout Elements
            mainLayout: 'android=new UiSelector().resourceId("com.philo.philo:id/select_login_action_layout")',
            landingPage: 'android=new UiSelector().resourceId("com.philo.philo:id/landing_screen_page_1")',
            dividerLine: 'android=new UiSelector().resourceId("com.philo.philo:id/text_line_divider_guideline")'
        },

        // Channel Icons Content Descriptions
        channels: {
            // Live Channels
            aAndE: 'android=new UiSelector().className("android.widget.ImageView").description("A&E")',
            accuWeather: 'android=new UiSelector().className("android.widget.ImageView").description("AccuWeather Network")',
            amc: 'android=new UiSelector().className("android.widget.ImageView").description("AMC")',
            americanHeroes: 'android=new UiSelector().className("android.widget.ImageView").description("American Heroes Channel")',
            animalPlanet: 'android=new UiSelector().className("android.widget.ImageView").description("Animal Planet")',
            aspireTV: 'android=new UiSelector().className("android.widget.ImageView").description("aspireTV")',
            axsTV: 'android=new UiSelector().className("android.widget.ImageView").description("AXS TV")',
            bbcAmerica: 'android=new UiSelector().className("android.widget.ImageView").description("BBC America")',
            bet: 'android=new UiSelector().className("android.widget.ImageView").description("BET")',
            betHer: 'android=new UiSelector().className("android.widget.ImageView").description("BET Her")',
            catchyComedy: 'android=new UiSelector().className("android.widget.ImageView").description("Catchy Comedy")',
            cleoTV: 'android=new UiSelector().className("android.widget.ImageView").description("CLEO TV")',
            cmt: 'android=new UiSelector().className("android.widget.ImageView").description("CMT")',
            comedyCentral: 'android=new UiSelector().className("android.widget.ImageView").description("Comedy Central")',
            cookingChannel: 'android=new UiSelector().className("android.widget.ImageView").description("Cooking Channel")',
            crimeInvestigation: 'android=new UiSelector().className("android.widget.ImageView").description("Crime + Investigation")',
            dabl: 'android=new UiSelector().className("android.widget.ImageView").description("Dabl")',
            deckTheHallmark: 'android=new UiSelector().className("android.widget.ImageView").description("Deck the Hallmark")',
            destinationAmerica: 'android=new UiSelector().className("android.widget.ImageView").description("Destination America")',
            discoveryChannel: 'android=new UiSelector().className("android.widget.ImageView").description("Discovery Channel")',
            discoveryFamily: 'android=new UiSelector().className("android.widget.ImageView").description("Discovery Family")',
            discoveryLife: 'android=new UiSelector().className("android.widget.ImageView").description("Discovery Life")',
            earthX: 'android=new UiSelector().className("android.widget.ImageView").description("EarthX")',
            fetv: 'android=new UiSelector().className("android.widget.ImageView").description("FETV")',
            foodNetwork: 'android=new UiSelector().className("android.widget.ImageView").description("Food Network")',
            fyi: 'android=new UiSelector().className("android.widget.ImageView").description("FYI")',
            gameShowNetwork: 'android=new UiSelector().className("android.widget.ImageView").description("Game Show Network")',
            get: 'android=new UiSelector().className("android.widget.ImageView").description("get")',
            greatAmericanFaith: 'android=new UiSelector().className("android.widget.ImageView").description("Great American Faith & Living")',
            greatAmericanFamily: 'android=new UiSelector().className("android.widget.ImageView").description("Great American Family")',
            hallmarkChannel: 'android=new UiSelector().className("android.widget.ImageView").description("Hallmark Channel")',
            hallmarkFamily: 'android=new UiSelector().className("android.widget.ImageView").description("Hallmark Family")',
            hallmarkMystery: 'android=new UiSelector().className("android.widget.ImageView").description("Hallmark Mystery")',
            heroesAndIcons: 'android=new UiSelector().className("android.widget.ImageView").description("Heroes & Icons")',
            hgtv: 'android=new UiSelector().className("android.widget.ImageView").description("HGTV")',
            history: 'android=new UiSelector().className("android.widget.ImageView").description("HISTORY")',
            ifc: 'android=new UiSelector().className("android.widget.ImageView").description("IFC")',
            insp: 'android=new UiSelector().className("android.widget.ImageView").description("INSP")',
            investigationDiscovery: 'android=new UiSelector().className("android.widget.ImageView").description("Investigation Discovery")',
            lawAndCrime: 'android=new UiSelector().className("android.widget.ImageView").description("Law&Crime")',
            lifetime: 'android=new UiSelector().className("android.widget.ImageView").description("Lifetime")',
            lmn: 'android=new UiSelector().className("android.widget.ImageView").description("LMN")',
            logo: 'android=new UiSelector().className("android.widget.ImageView").description("Logo")',
            magnoliaNetwork: 'android=new UiSelector().className("android.widget.ImageView").description("Magnolia Network")',
            meTV: 'android=new UiSelector().className("android.widget.ImageView").description("MeTV")',
            meTVToons: 'android=new UiSelector().className("android.widget.ImageView").description("MeTV Toons")',
            meTVPlus: 'android=new UiSelector().className("android.widget.ImageView").description("MeTV+")',
            militaryHistory: 'android=new UiSelector().className("android.widget.ImageView").description("Military History Channel")',
            motorTrend: 'android=new UiSelector().className("android.widget.ImageView").description("MotorTrend")',
            mtv: 'android=new UiSelector().className("android.widget.ImageView").description("MTV")',
            mtvClassic: 'android=new UiSelector().className("android.widget.ImageView").description("MTV Classic")',
            mtvLive: 'android=new UiSelector().className("android.widget.ImageView").description("MTV Live")',
            mtv2: 'android=new UiSelector().className("android.widget.ImageView").description("MTV2")',
            nickJr: 'android=new UiSelector().className("android.widget.ImageView").description("Nick Jr.")',
            nickelodeon: 'android=new UiSelector().className("android.widget.ImageView").description("Nickelodeon")',
            nicktoons: 'android=new UiSelector().className("android.widget.ImageView").description("Nicktoons")',
            oprahWinfreyNetwork: 'android=new UiSelector().className("android.widget.ImageView").description("Oprah Winfrey Network")',
            paramountNetwork: 'android=new UiSelector().className("android.widget.ImageView").description("Paramount Network")',
            popTV: 'android=new UiSelector().className("android.widget.ImageView").description("Pop TV")',
            revolt: 'android=new UiSelector().className("android.widget.ImageView").description("REVOLT")',
            scienceChannel: 'android=new UiSelector().className("android.widget.ImageView").description("Science Channel")',
            smithsonianChannel: 'android=new UiSelector().className("android.widget.ImageView").description("Smithsonian Channel")',
            startTV: 'android=new UiSelector().className("android.widget.ImageView").description("Start TV")',
            storyTelevision: 'android=new UiSelector().className("android.widget.ImageView").description("Story Television")',
            sundanceTV: 'android=new UiSelector().className("android.widget.ImageView").description("Sundance TV")',
            tastemade: 'android=new UiSelector().className("android.widget.ImageView").description("Tastemade")',
            teenNick: 'android=new UiSelector().className("android.widget.ImageView").description("TeenNick")',
            tlc: 'android=new UiSelector().className("android.widget.ImageView").description("TLC")',
            travelChannel: 'android=new UiSelector().className("android.widget.ImageView").description("Travel Channel")',
            tvLand: 'android=new UiSelector().className("android.widget.ImageView").description("TV Land")',
            tvOne: 'android=new UiSelector().className("android.widget.ImageView").description("TV One")',
            upTV: 'android=new UiSelector().className("android.widget.ImageView").description("UPtv")',
            vh1: 'android=new UiSelector().className("android.widget.ImageView").description("VH1")',
            vice: 'android=new UiSelector().className("android.widget.ImageView").description("Vice")',
            weTV: 'android=new UiSelector().className("android.widget.ImageView").description("WE tv")',

            // AMC+ Library
            amcPlus: 'android=new UiSelector().className("android.widget.ImageView").description("AMC+")',
            ifcFilmsUnlimited: 'android=new UiSelector().className("android.widget.ImageView").description("IFC Films Unlimited")',
            shudderTV: 'android=new UiSelector().className("android.widget.ImageView").description("Shudder TV")',
            sundanceNow: 'android=new UiSelector().className("android.widget.ImageView").description("Sundance Now")',
            walkingDeadChannel: 'android=new UiSelector().className("android.widget.ImageView").description("The Walking Dead Channel")',

            // Additional Free Channels
            fourUV: 'android=new UiSelector().className("android.widget.ImageView").description("4UV")',
            allRealityWeTV: 'android=new UiSelector().className("android.widget.ImageView").description("All Reality WE tv")',
            allWeddingsWeTV: 'android=new UiSelector().className("android.widget.ImageView").description("All Weddings WE tv")',
            allBlkGems: 'android=new UiSelector().className("android.widget.ImageView").description("AllBlk Gems")',
            amcThrillers: 'android=new UiSelector().className("android.widget.ImageView").description("AMC Thrillers")',
            americasTestKitchen: 'android=new UiSelector().className("android.widget.ImageView").description("America\'s Test Kitchen")',
            angerManagement: 'android=new UiSelector().className("android.widget.ImageView").description("Anger Management")',
            animeHidive: 'android=new UiSelector().className("android.widget.ImageView").description("ANIME x HIDIVE")',
            architecturalDigest: 'android=new UiSelector().className("android.widget.ImageView").description("Architectural Digest")',
            areWeThereYet: 'android=new UiSelector().className("android.widget.ImageView").description("Are We There Yet?")',
            atHomeWithFamilyHandyman: 'android=new UiSelector().className("android.widget.ImageView").description("At Home with Family Handyman")',
            axMen: 'android=new UiSelector().className("android.widget.ImageView").description("Ax Men")',
            baywatch: 'android=new UiSelector().className("android.widget.ImageView").description("Baywatch")',
            bbcNews: 'android=new UiSelector().className("android.widget.ImageView").description("BBC News")',
            beinSportsXtra: 'android=new UiSelector().className("android.widget.ImageView").description("beIN Sports XTRA")',
            bobRossChannel: 'android=new UiSelector().className("android.widget.ImageView").description("The Bob Ross Channel")',
            bonAppetit: 'android=new UiSelector().className("android.widget.ImageView").description("Bon Appétit")',
            buzzr: 'android=new UiSelector().className("android.widget.ImageView").description("Buzzr")',
            cheddarNews: 'android=new UiSelector().className("android.widget.ImageView").description("Cheddar News")',

            // Available Add-ons
            mgmPlus: 'android=new UiSelector().className("android.widget.ImageView").description("MGM+")',
            mgmPlusHits: 'android=new UiSelector().className("android.widget.ImageView").description("MGM+ Hits")',
            mgmPlusMarquee: 'android=new UiSelector().className("android.widget.ImageView").description("MGM+ Marquee")',
            starz: 'android=new UiSelector().className("android.widget.ImageView").description("STARZ")',
            starzEncore: 'android=new UiSelector().className("android.widget.ImageView").description("STARZ Encore")',
            starzKidsAndFamily: 'android=new UiSelector().className("android.widget.ImageView").description("STARZ Kids & Family")',
            fandor: 'android=new UiSelector().className("android.widget.ImageView").description("Fandor")',
            fmc: 'android=new UiSelector().className("android.widget.ImageView").description("FMC")',
            hdnetMovies: 'android=new UiSelector().className("android.widget.ImageView").description("HDNet Movies")',
            movies: 'android=new UiSelector().className("android.widget.ImageView").description("MOVIES!")',
            reelz: 'android=new UiSelector().className("android.widget.ImageView").description("REELZ")',
            sonyMovies: 'android=new UiSelector().className("android.widget.ImageView").description("Sony Movies")',
            hallmarkPlus: 'android=new UiSelector().className("android.widget.ImageView").description("Hallmark+")'
        },

        // Auth Screen Selectors
        auth: {
            emailInput: 'android=new UiSelector().resourceId("com.philo.philo:id/auth_credentials_input_text_view")',
            submitButton: 'android=new UiSelector().resourceId("com.philo.philo:id/auth_credentials_submit_button")',
            title: 'android=new UiSelector().resourceId("com.philo.philo:id/auth_credentials_title")',
            switchInputType: 'android=new UiSelector().resourceId("com.philo.philo:id/auth_credentials_switch_input_type_button")'
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
    async waitForElement(selector: string): Promise<WebdriverIO.Element> {
        try {
            const element = await this.driver.$(selector);
            await element.waitForDisplayed({ timeout: 10000 });
            return element;
        } catch (error) {
            console.error(`Error waiting for element with selector ${selector}:`, error);
            throw error;
        }
    }

    /**
     * Click on element
     */
    async click(selector: string): Promise<void> {
        try {
            const element = await this.driver.$(selector);
            await element.waitForDisplayed({ timeout: 10000 });
            await element.click();
        } catch (error) {
            console.error(`Error clicking element with selector ${selector}:`, error);
            throw error;
        }
    }

    /**
     * Check if element is displayed
     */
    async isElementDisplayed(selector: string): Promise<boolean> {
        try {
            const element = await this.driver.$(selector);
            return await element.isDisplayed();
        } catch (error) {
            console.error(`Error checking if element with selector ${selector} is displayed:`, error);
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
        try {
            const signInButton = await this.driver.$('android=text("Sign in")');
            await signInButton.waitForDisplayed({ timeout: 10000 });
            expect(await signInButton.isDisplayed()).toBe(true);
        } catch (error) {
            console.error('Error verifying landing page elements:', error);
            throw error;
        }
    }

    /**
     * Verify element is displayed with optional text verification
     */
    protected async verifyElementDisplayed(selector: string, expectedText?: string): Promise<void> {
        const element = await this.driver.$(selector);
        await element.waitForDisplayed({ timeout: 30000 });

        if (expectedText) {
            const actualText = await element.getText();
            if (actualText !== expectedText) {
                throw new Error(`Element text mismatch. Expected: "${expectedText}", Got: "${actualText}"`);
            }
        }
    }

    /**
     * Verify channels are displayed
     */
    async verifyChannelsDisplayed(): Promise<void> {
        try {
            const channelsElement = await this.driver.$('android=text("Channels")');
            await channelsElement.waitForDisplayed({ timeout: 10000 });
            expect(await channelsElement.isDisplayed()).toBe(true);
        } catch (error) {
            console.error('Error verifying channels displayed:', error);
            throw error;
        }
    }

    /**
     * Press Explore Free Channels button
     */
    async pressExploreFreeChannelsButton(): Promise<void> {
        try {
            const exploreButton = await this.driver.$('android=text("Explore Free Channels")');
            await exploreButton.waitForDisplayed({ timeout: 10000 });
            await exploreButton.click();
        } catch (error) {
            console.error('Error pressing explore free channels button:', error);
            throw error;
        }
    }

    async verifyLoginScreenDisplayed(): Promise<void> {
        try {
            const loginElement = await this.driver.$('android=text("Sign in")');
            await loginElement.waitForDisplayed({ timeout: 10000 });
            expect(await loginElement.isDisplayed()).toBe(true);
        } catch (error) {
            console.error('Error verifying login screen displayed:', error);
            throw error;
        }
    }
} 