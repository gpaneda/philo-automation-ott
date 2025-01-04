import { AppHelper } from '../helpers/app.helper';
import { Browser, Element } from 'webdriverio';
import { LoginPage } from '../pages/login.page';
import { GmailHelper } from '../helpers/gmail.helper';

let driver: Browser<'async'>;
let loginPage: LoginPage;
let email: string;

beforeAll(async () => {
    driver = await AppHelper.launchPhiloApp();
    email = process.env.PHILO_EMAIL || '';
}, 30000);

describe('Open Philo App', () => {
    test.only('TC103 - should complete email sign in flow', async () => {
        // Click on sign in button
        await driver.pause(2000);   
        await driver.$('android=text("Sign in")').click();
        
        // Enter email
        loginPage = new LoginPage(driver);
        await loginPage.clearInput();
        await loginPage.enterEmailFromEnv();
        await loginPage.clickOnSubmitButton();
        
        // Wait for email and process sign-in
        console.log('Waiting for and processing sign-in email...');
        await driver.pause(5000); // Wait for email to arrive
        const success = await GmailHelper.processSignInEmail();
        expect(success).toBe(true);
        
        // Click "Confirm sign in" button on device
        const confirmButton = await driver.$('android=text("Confirm sign in")');
        await confirmButton.waitForDisplayed({ timeout: 10000 });
        await confirmButton.click();
        
        // Verify successful login
        const homeElement = await driver.$('android=text("Home")');
        await homeElement.waitForDisplayed({ timeout: 10000 });
        expect(await homeElement.isDisplayed()).toBe(true);
    }, 120000);
});

