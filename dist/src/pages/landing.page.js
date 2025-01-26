"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPage = void 0;
const base_page_1 = require("./base.page");
class LandingPage extends base_page_1.BasePage {
    constructor(driver) {
        super(driver);
        this.LANDING_SCREEN = 'android=resourceId("com.philo.philo:id/landing_screen_page_1")';
        this.PHILO_LOGO = 'android=resourceId("com.philo.philo:id/philo_logo")';
        this.HEADER_TEXT = 'android=resourceId("com.philo.philo:id/header_text")';
        this.START_TRIAL_BUTTON = 'android=resourceId("com.philo.philo:id/get_started_button")';
        this.SIGN_IN_BUTTON = 'android=resourceId("com.philo.philo:id/get_started_sign_in_button")';
        this.SEE_ALL_CHANNELS = 'android=resourceId("com.philo.philo:id/see_more")';
        // New elements from page 2
        this.LANDING_SCREEN_PAGE_2 = 'android=resourceId("com.philo.philo:id/landing_screen_page_2")';
        this.PAGE_2_START_TRIAL_BUTTON = 'android=resourceId("com.philo.philo:id/page_2_get_started_button")';
        this.PAGE_2_SIGN_IN_BUTTON = 'android=resourceId("com.philo.philo:id/page_2_get_started_sign_in_button")';
        this.HIDE_CHANNELS = 'android=resourceId("com.philo.philo:id/see_less")';
        this.CHANNELS_GROUP = 'android=resourceId("com.philo.philo:id/channels_groups_layout")';
        // Login page elements
        this.LOGIN_TITLE = 'android=resourceId("com.philo.philo:id/auth_credentials_title")';
        this.LOGIN_SWITCH_TO_MOBILE = 'android=resourceId("com.philo.philo:id/auth_credentials_switch_input_type_button")';
        this.LOGIN_KEYPAD = 'android=resourceId("com.philo.philo:id/auth_credentials_keypad")';
    }
    async verifyLandingPageElements() {
        await this.verifyElementDisplayed(this.LANDING_SCREEN);
        await this.verifyElementDisplayed(this.PHILO_LOGO);
        await this.verifyElementDisplayed(this.HEADER_TEXT);
    }
    async verifyChannelsDisplayed() {
        await this.verifyElementDisplayed(this.CHANNELS_GROUP);
    }
    async pressExploreFreeChannelsButton() {
        await this.click(this.SEE_ALL_CHANNELS);
    }
    async verifyLoginScreenDisplayed() {
        await this.verifyElementDisplayed(this.LOGIN_TITLE);
        await this.verifyElementDisplayed(this.LOGIN_SWITCH_TO_MOBILE);
        await this.verifyElementDisplayed(this.LOGIN_KEYPAD);
    }
    // New methods for page 2
    async verifyLandingPage2Elements() {
        await this.verifyElementDisplayed(this.LANDING_SCREEN_PAGE_2);
        await this.verifyElementDisplayed(this.PAGE_2_START_TRIAL_BUTTON);
        await this.verifyElementDisplayed(this.PAGE_2_SIGN_IN_BUTTON);
    }
    async verifyHideChannelsDisplayed() {
        await this.verifyElementDisplayed(this.HIDE_CHANNELS);
    }
}
exports.LandingPage = LandingPage;
