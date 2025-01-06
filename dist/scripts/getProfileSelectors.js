"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_helper_1 = require("../helpers/app.helper");
const profile_page_1 = require("../pages/profile.page");
const adb_helper_1 = require("../helpers/adb.helper");
async function getProfileSelectors() {
    try {
        const driver = await app_helper_1.AppHelper.launchPhiloApp();
        const profilePage = new profile_page_1.ProfilePage(driver);
        // Navigate to profile page
        // TODO: Implement navigation to profile page
        // Dump UI hierarchy
        const uiDump = await adb_helper_1.AdbHelper.dumpUiHierarchy();
        const selectors = await adb_helper_1.AdbHelper.parseUiDump(uiDump);
        console.log('Found selectors:', JSON.stringify(selectors, null, 2));
        // Clean up
        await driver.deleteSession();
        return selectors;
    }
    catch (error) {
        console.error('Failed to get profile selectors:', error);
        throw error;
    }
}
getProfileSelectors();
