import { AppHelper } from '../helpers/app.helper';
import { Browser } from 'webdriverio';
import { HomeScreenSignedInPage } from '../pages/homeScreenSignedIn.page';
import { MoviesDetailsPage } from '../pages/moviesDetails.page';
import { SeriesDetailsPage } from '../pages/seriesDetails.page';

let driver: Browser<'async'>;
let homeScreenSignedInPage: HomeScreenSignedInPage;
let moviesDetailsPage: MoviesDetailsPage;
let seriesDetailsPage: SeriesDetailsPage;

beforeAll(async () => {
    driver = await AppHelper.launchPhiloApp();
    homeScreenSignedInPage = new HomeScreenSignedInPage(driver);
    moviesDetailsPage = new MoviesDetailsPage(driver);
    seriesDetailsPage = new SeriesDetailsPage(driver);
}, 30000);

afterAll(async () => {
    await driver.terminateApp('com.philo.philo');
    await driver.deleteSession();
});

describe('Home Screen Signed In Tests', () => {
    //Test Case 104 - Verify all home screen elements are visible
    test('TC104 - should display all home screen elements', async () => {
        await homeScreenSignedInPage.pressUpButton();
        await homeScreenSignedInPage.verifyTopMenuElements();
    }, 60000);

    //Test Case 105 - Verify that the Title from the Movie Tile is the same as the Title seen in the Movie Details Page     
    test('TC105 - should be the same as the Title seen in the Movie Details Page', async () => {
        // 1 & 2. Get the title from the first movie in Top Free Movies
        const tileTitle = await homeScreenSignedInPage.getFirstMovieTitle();
        console.log('Tile Title:', tileTitle);
        // 3. Click on the movie tile
        await homeScreenSignedInPage.clickFirstMovie();
        
        // Wait for movie details page to load
        await moviesDetailsPage.waitForLoaded();
        
        // 4. Get and compare the title from the details page
        //add sleep
        await new Promise(resolve => setTimeout(resolve, 10000));
        //Press page down button
        await homeScreenSignedInPage.pressDownButton();
        const detailsTitle = await moviesDetailsPage.getMovieTitle();
        console.log('Details Title:', detailsTitle);
        expect(detailsTitle).toBe(tileTitle);
        
        // 5. Press back button to return to home screen
        await homeScreenSignedInPage.pressBackButton();
    }, 60000);

    
}); 