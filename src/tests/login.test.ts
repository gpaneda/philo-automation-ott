import { AppHelper } from '../helpers/app.helper';
import { Browser, Element } from 'webdriverio';
import { LoginPage } from '../pages/login.page';
import { GmailHelper } from '../helpers/gmail.helper';


let driver: Browser<'async'>;
let loginPage: LoginPage;
let email: string;

beforeAll(async () => {
    try {
        driver = await AppHelper.launchPhiloApp();
        email = process.env.PHILO_EMAIL || '';
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
}, 30000);

afterAll(async () => {
    try {
        if (driver) {
            await driver.terminateApp('com.philo.philo');
            await driver.pause(2000);
            await driver.deleteSession();
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    } catch (error) {
        console.error('Error in afterAll:', error);
    }
});
beforeEach(async () => {
    try {
        await driver.terminateApp('com.philo.philo');
        await driver.pause(2000);
        await driver.activateApp('com.philo.philo');
        await driver.pause(5000);
    } catch (error) {
        console.error('Error in beforeEach:', error);
        throw error;
    }
}); 

describe('Open Philo App', () => {
    test.only('TC103 - should complete email sign in flow', async () => {
        try {
            await driver.pause(2000);   
            await driver.$('android=text("Sign in")').click();
            
            loginPage = new LoginPage(driver);
            await loginPage.clearInput();
            await loginPage.enterEmailFromEnv();
            await loginPage.clickOnSubmitButton();
            
            await driver.pause(5000);
            const success = await GmailHelper.processSignInEmail();
            expect(success).toBe(true);
            
            const confirmButton = await driver.$('android=text("Confirm sign in")');
            await confirmButton.waitForDisplayed({ timeout: 10000 });
            await confirmButton.click();
            
            const homeElement = await driver.$('android=text("Home")');
            await homeElement.waitForDisplayed({ timeout: 10000 });
            expect(await homeElement.isDisplayed()).toBe(true);
            
        } catch (error) {
            console.error('Error in TC103:', error);
            throw error;
        }
    }, 120000);
});

