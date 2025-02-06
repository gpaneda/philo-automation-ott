import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
    readonly LANDING_SCREEN = 'android=resourceId("com.philo.philo:id/landing_screen_page_1")';
    readonly PHILO_LOGO = 'android=resourceId("com.philo.philo:id/philo_logo")';
    readonly HEADER_TEXT = 'android=resourceId("com.philo.philo:id/header_text")';
    readonly START_TRIAL_BUTTON = 'android=resourceId("com.philo.philo:id/get_started_button")';
    readonly SIGN_IN_BUTTON = 'android=resourceId("com.philo.philo:id/get_started_sign_in_button")';
    readonly SEE_ALL_CHANNELS = 'android=resourceId("com.philo.philo:id/see_more")';
    
    // New elements from page 2
    readonly LANDING_SCREEN_PAGE_2 = 'android=resourceId("com.philo.philo:id/landing_screen_page_2")';
    readonly PAGE_2_START_TRIAL_BUTTON = 'android=resourceId("com.philo.philo:id/page_2_get_started_button")';
    readonly PAGE_2_SIGN_IN_BUTTON = 'android=resourceId("com.philo.philo:id/page_2_get_started_sign_in_button")';
    readonly HIDE_CHANNELS = 'android=resourceId("com.philo.philo:id/see_less")';
    readonly CHANNELS_GROUP = 'android=resourceId("com.philo.philo:id/channels_groups_layout")';

    // Login page elements
    private readonly LOGIN_TITLE = 'android=resourceId("com.philo.philo:id/auth_credentials_title")';
    private readonly LOGIN_SWITCH_TO_MOBILE = 'android=resourceId("com.philo.philo:id/auth_credentials_switch_input_type_button")';
    private readonly LOGIN_KEYPAD = 'android=resourceId("com.philo.philo:id/auth_credentials_keypad")';

    constructor(driver: Browser) {
        super(driver);
    }

    async verifyLandingPageElements(): Promise<void> {
        await this.verifyElementDisplayed(this.LANDING_SCREEN);
        await this.verifyElementDisplayed(this.PHILO_LOGO);
        await this.verifyElementDisplayed(this.HEADER_TEXT);
    }

    async verifyChannelsDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.CHANNELS_GROUP);
    }

    async pressExploreFreeChannelsButton(): Promise<void> {
        await this.click(this.SEE_ALL_CHANNELS);
    }

    async verifyLoginScreenDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.LOGIN_TITLE);
        await this.verifyElementDisplayed(this.LOGIN_SWITCH_TO_MOBILE);
        await this.verifyElementDisplayed(this.LOGIN_KEYPAD);
    }

    // New methods for page 2
    async verifyLandingPage2Elements(): Promise<void> {
        await this.verifyElementDisplayed(this.LANDING_SCREEN_PAGE_2);
        await this.verifyElementDisplayed(this.PAGE_2_START_TRIAL_BUTTON);
        await this.verifyElementDisplayed(this.PAGE_2_SIGN_IN_BUTTON);
    }

    async verifyHideChannelsDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.HIDE_CHANNELS);
    }
} 