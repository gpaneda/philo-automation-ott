import { AppHelper } from '../helpers/app.helper';
import { ProfilePage } from '../fireTVPages/profile.page';
import { AdbHelper } from '../helpers/adb.helper';

async function getProfileSelectors() {
    try {
        const driver = await AppHelper.launchPhiloApp();
        const profilePage = new ProfilePage(driver);
        
        // Navigate to profile page
        // TODO: Implement navigation to profile page
        
        // Dump UI hierarchy
        const uiDump = await AdbHelper.dumpUiHierarchy();
        const selectors = await AdbHelper.parseUiDump(uiDump);
        
        console.log('Found selectors:', JSON.stringify(selectors, null, 2));
        
        // Clean up
        await driver.deleteSession();
        
        return selectors;
    } catch (error) {
        console.error('Failed to get profile selectors:', error);
        throw error;
    }
}

getProfileSelectors(); 