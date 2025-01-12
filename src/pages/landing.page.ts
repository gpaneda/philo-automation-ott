import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
    readonly LANDING_SCREEN = 'android=resourceId("com.philo.philo:id/landing_screen_page_1")';
    readonly PHILO_LOGO = 'android=resourceId("com.philo.philo:id/philo_logo")';
    readonly HEADER_TEXT = 'android=resourceId("com.philo.philo:id/header_text")';
    readonly START_TRIAL_BUTTON = 'android=resourceId("com.philo.philo:id/get_started_button")';
    readonly SIGN_IN_BUTTON = 'android=resourceId("com.philo.philo:id/get_started_sign_in_button")';
    readonly SEE_ALL_CHANNELS = 'android=resourceId("com.philo.philo:id/see_more")';

    constructor(driver: Browser<'async'>) {
        super(driver);
    }

    async verifyLandingPageElements(): Promise<void> {
        await this.verifyElementDisplayed(this.LANDING_SCREEN);
        await this.verifyElementDisplayed(this.PHILO_LOGO);
        await this.verifyElementDisplayed(this.HEADER_TEXT);
    }

    async verifyChannelsDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.SEE_ALL_CHANNELS);
    }

    async pressExploreFreeChannelsButton(): Promise<void> {
        await this.click(this.SEE_ALL_CHANNELS);
    }

    async verifyLoginScreenDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.SIGN_IN_BUTTON);
    }
} 