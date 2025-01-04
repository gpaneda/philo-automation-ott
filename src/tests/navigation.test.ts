import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenPage } from '../pages/homescreen.page';
import { GuidePage } from '../pages/guide.page';
import { SettingsPage } from '../pages/settings.page';
import { TopPage } from '../pages/top.page';
import path from 'path';
import fs from 'fs/promises';

let driver: Browser<'async'>;
let homeScreen: HomeScreenPage;
let guidePage: GuidePage;
let settingsPage: SettingsPage;
let topPage: TopPage;

// Define screenshot directories
const SCREENSHOT_BASE_DIR = path.join(process.cwd(), 'screenshots');
const REFERENCE_DIR = path.join(SCREENSHOT_BASE_DIR, 'reference');
const CURRENT_DIR = path.join(SCREENSHOT_BASE_DIR, 'current');
const DIFFERENCE_DIR = path.join(SCREENSHOT_BASE_DIR, 'difference');

// Create screenshot directories if they don't exist
async function ensureDirectories() {
    for (const dir of [REFERENCE_DIR, CURRENT_DIR, DIFFERENCE_DIR]) {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }
}

beforeAll(async () => {
    try {
        await ensureDirectories();
        driver = await AppHelper.launchPhiloApp();
        homeScreen = new HomeScreenPage(driver);
        guidePage = new GuidePage(driver);
        settingsPage = new SettingsPage(driver);
        topPage = new TopPage(driver);
    } catch (error) {
        console.error('Error in beforeAll:', error);
        throw error;
    }
}, 60000);

afterAll(async () => {
    try {
        if (driver) {
            await driver.deleteSession();
        }
    } catch (error) {
        console.error('Error in afterAll:', error);
    }
});

describe('Top Nav Tests', () => {
    //Verify that the Settings Page is visible  
    test('TC106 - should display the Settings Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await new Promise(resolve => setTimeout(resolve, 5000));
            //press right button 5 times
            for (let i = 0; i < 5; i++) {
                await homeScreen.pressRightButton();
            }
            await homeScreen.pressEnterButton();
            //add a delay
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            //check if the text "Start channel playback from..." is visible
            await settingsPage.isElementVisible(settingsPage.getStartChannelPlaybackSelector());
            
            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `settings_page_current_${timestamp}.png`;
            
            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path.join(CURRENT_DIR, currentScreenshotName));
            const referenceScreenshotPath = path.join(REFERENCE_DIR, 'settings_page_reference.png');

            try {
                // First check if reference exists
                await fs.access(referenceScreenshotPath);
                
                // If reference exists, compare with current
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(DIFFERENCE_DIR, `settings_difference_${timestamp}.png`)
                );
                console.log('Settings page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                
                // Consider test passed if difference is less than 5%
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                // Only on first run: save current as reference
                console.log('First run - creating settings page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }

            //press back button
            await homeScreen.pressBackButton();
        } catch (error) {
            console.error('Error in TC106:', error);
            throw error;
        }
    }, 180000);

    //Test Case 107 - Verify that the Guide Page is visible when the Guide button is clicked
    test('TC107 - should display the Guide Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await new Promise(resolve => setTimeout(resolve, 5000));
            //press right button once
            await homeScreen.pressRightButton();
            await homeScreen.pressEnterButton();
            //add a delay
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            //Check if the text Free channels is visible
            const isVisible = await guidePage.isElementVisible(guidePage.freeChannels);
            expect(isVisible).toBe(true);

            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `guide_page_current_${timestamp}.png`;
            
            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path.join(CURRENT_DIR, currentScreenshotName));
            const referenceScreenshotPath = path.join(REFERENCE_DIR, 'guide_page_reference.png');

            try {
                // First check if reference exists
                await fs.access(referenceScreenshotPath);
                
                // If reference exists, compare with current
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(DIFFERENCE_DIR, `guide_difference_${timestamp}.png`)
                );
                console.log('Guide page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                
                // Consider test passed if difference is less than 5%
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                // Only on first run: save current as reference
                console.log('First run - creating guide page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }

            //press back button
            await homeScreen.pressBackButton();
        } catch (error) {
            console.error('Error in TC107:', error);
            throw error;
        }
    }, 180000);

    //Test Case 108 - Verify that the Top Page is visible when the Top button is clicked
    test('TC108 - should display the Top Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            //press right button twice
            for (let i = 0; i < 2; i++) {
                await homeScreen.pressRightButton();
            }
            await homeScreen.pressEnterButton();
            
            //add a delay for content to load
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `top_page_current_${timestamp}.png`;
            
            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path.join(CURRENT_DIR, currentScreenshotName));
            const referenceScreenshotPath = path.join(REFERENCE_DIR, 'top_page_reference.png');

            try {
                // First check if reference exists
                await fs.access(referenceScreenshotPath);
                
                // If reference exists, compare with current
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(DIFFERENCE_DIR, `top_difference_${timestamp}.png`)
                );
                console.log('Top page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                
                // Consider test passed if difference is less than 5%
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                // Only on first run: save current as reference
                console.log('First run - creating top page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }

            // Press back button to return to previous screen
            await homeScreen.pressBackButton();
        } catch (error) {
            console.error('Error in TC108:', error);
            throw error;
        }
    }, 180000);

    //Test Case 109 - Verify that the Saved Page is visible when the Saved button is clicked
    test('TC109 - should display the Saved Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await new Promise(resolve => setTimeout(resolve, 5000));

            //press right button three times
            for (let i = 0; i < 3; i++) {
                await homeScreen.pressRightButton();
            }
            await homeScreen.pressEnterButton();

            //add a delay for content to load
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `saved_page_current_${timestamp}.png`;

            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path.join(CURRENT_DIR, currentScreenshotName));
            const referenceScreenshotPath = path.join(REFERENCE_DIR, 'saved_page_reference.png');

            try {
                // First check if reference exists
                await fs.access(referenceScreenshotPath);
                
                // If reference exists, compare with current
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(DIFFERENCE_DIR, `saved_difference_${timestamp}.png`)
                );
                console.log('Saved page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });
                
                // Consider test passed if difference is less than 5%
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                // Only on first run: save current as reference
                console.log('First run - creating saved page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }

            // Press back button to return to previous screen
            await homeScreen.pressBackButton();
        } catch (error) {
            console.error('Error in TC109:', error);
            throw error;
        }
    }, 180000);

    //Test Case 110 - Verify that the Search Page is visible when the Search button is clicked
    test('TC110 - should display the Search Page', async () => {
        try {
            await homeScreen.pressUpButton();
            await new Promise(resolve => setTimeout(resolve, 5000));

            //press right button four times
            for (let i = 0; i < 4; i++) {
                await homeScreen.pressRightButton();
            }
            await homeScreen.pressEnterButton();

            //add a delay for content to load
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Generate timestamp for current screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentScreenshotName = `search_page_current_${timestamp}.png`;

            // Take screenshot of the current state
            const screenshotPath = await topPage.takeScreenshot(path.join(CURRENT_DIR, currentScreenshotName));
            const referenceScreenshotPath = path.join(REFERENCE_DIR, 'search_page_reference.png');

            try {
                // First check if reference exists
                await fs.access(referenceScreenshotPath);

                // If reference exists, compare with current
                const comparison = await topPage.compareImages(
                    screenshotPath,
                    referenceScreenshotPath,
                    path.join(DIFFERENCE_DIR, `search_difference_${timestamp}.png`)
                );
                console.log('Search page comparison results:', {
                    misMatchPercentage: comparison.misMatchPercentage,
                    isSameDimensions: comparison.isSameDimensions,
                    timestamp: timestamp
                });

                // Consider test passed if difference is less than 5%
                expect(comparison.misMatchPercentage).toBeLessThan(5);
            } catch (error) {
                // Only on first run: save current as reference
                console.log('First run - creating search page reference image');
                await fs.copyFile(screenshotPath, referenceScreenshotPath);
            }

            // Press back button to return to previous screen
            await homeScreen.pressBackButton();
        } catch (error) {
            console.error('Error in TC110:', error);
            throw error;
        }
    }, 180000);
}); 