import { Browser } from 'webdriverio';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
    private readonly LANDING_PAGE_ELEMENTS = 'android=resourceId("com.philo.philo.google:id/landing_page_elements")';
    private readonly CHANNELS_LIST = 'android=resourceId("com.philo.philo.google:id/channels_list")';
    private readonly EXPLORE_FREE_CHANNELS_BUTTON = 'android=resourceId("com.philo.philo.google:id/explore_free_channels_button")';
    private readonly LOGIN_SCREEN = 'android=resourceId("com.philo.philo.google:id/login_screen")';

    constructor(driver: Browser) {
        super(driver);
    }

    async verifyLandingPageElements(): Promise<void> {
        await this.verifyElementDisplayed(this.LANDING_PAGE_ELEMENTS);
    }

    async verifyChannelsDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.CHANNELS_LIST);
    }

    async pressExploreFreeChannelsButton(): Promise<void> {
        await this.click(this.EXPLORE_FREE_CHANNELS_BUTTON);
    }

    async verifyLoginScreenDisplayed(): Promise<void> {
        await this.verifyElementDisplayed(this.LOGIN_SCREEN);
    }
} 