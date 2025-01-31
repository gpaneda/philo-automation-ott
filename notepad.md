### 2025-01-23
### General Notes
- [ ] Resolve the issue with the Passed Tests not being displayed correctly
- [x] Add another device to the pool of devices to test on
- [x] Create a project in Google Cosole using philotestb@gmail.com
- [x] Get these values from the Google Console:
    - [x] Client ID
    - [x] Client Secret
    - [x] Refresh Token
    - [x] Access Token
    - [x] Redirect URL
- [x] Add these values to the .env file
- [x] Add the values to the dashboard/src/app/api/tests/route.ts file
- [x] Ask how to integrate the new email and new device into the dashboard so that it can be used to run parallel tests
- [ ] Need to add more test cases to all the areas of the application - Playback, Series Details Page, Movies, etc.
- [x] Need to create Search Test Cases 
- [ ] Need to create test cases for live channels
- [ ] Add android TV to .env file and capabilities file
  APP_ACTIVITY=com.philo.philo.ui.activity.MainTabbedActivity
  APP_PACKAGE=com.philo.philo.google
  ANDROID_TV_IP=10.0.0.130
  ANDROID_TV_PORT=5555
- logs need to be cleared on dashbboard after each run
- [ ] Create an excel google sheets for test cases seen in the use_cases.md file


### Notes for the Dashboard UI
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Test History page
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Pie Chart page
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the  Reports page
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Test Execution page
- test suite runs should be retained in the dashboard after they are run
- logs should not be too verbose - only failed errors should be displayed or if the test passed
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Test Suite page
-[ ] Include historical run both in Test Suite Page and Test History page 
- [ ] Troubleshoot Stop Run button - does not work
- [ ] Pass Failed state not updating in test suite page
- [ ] Not all tests are logged into the test history page
- [ ] Device should be disabled when it is running a test
- [ ] Landing page status not updating

### Notes for Performance Testing
- [ ] Research on common performance testing tools and frameworks
- [ ] Research on how to integrate the performance testing tools and frameworks into the dashboard
- [ ] Research on how to run the performance testing tools and frameworks in parallel

## Adding New Devices

To add new devices to the dashboard and ensure they are properly integrated with the main `runAllTests.ts` file, follow these steps:

1. **Update the `.env` File**:
   - Add the new device's IP address and corresponding email credentials to your `.env` file. For example:

   ```env
   DEVICE_3_EMAIL=philotestc@gmail.com
   DEVICE_3_IP=10.0.0.99
   DEVICE_3_PORT=5557
   ```

2. **Modify `runAllTests.ts`**:
   - Update the logic to handle the new device IP and set the appropriate email. You can use a similar conditional or switch statement as in previous examples:

   ```typescript
   const email = deviceIp === '10.0.0.55' ? process.env.PHILO_EMAIL_2 :
                 deviceIp === '10.0.0.99' ? process.env.DEVICE_3_EMAIL :
                 process.env.PHILO_EMAIL;
   process.env.PHILO_EMAIL = email;
   ```

3. **Modify `testExecutionService.ts`**:
   - Update the `getEmailForDevice` method to include a case for the new device IP:

   ```typescript
   private getEmailForDevice(deviceIp: string): string {
       switch (deviceIp) {
         case '10.0.0.55':
           return process.env.PHILO_EMAIL_2!;
         case '10.0.0.98':
           return process.env.PHILO_EMAIL!;
         case '10.0.0.99': // New device case
           return process.env.DEVICE_3_EMAIL!;
         default:
           return process.env.PHILO_EMAIL!; // Default to first device
       }
   }
   ```

By following these steps, you can successfully add new devices to your dashboard and ensure that the correct email credentials are used when running tests.



## User Interactions to get API Data
- User opens the app
- User clicks sign in button
- User enters email
- User clicks on submit button
- User clicks on profile picture
- User pressed up button
- User chooses 

**Google OAuth2.0**
**Get an authorization code**
https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_id=956039011085-f89cdcov6mncuedfkqaflhfa0gfoh629.apps.googleusercontent.com

 curl --request POST \
       --url https://oauth2.googleapis.com/token \
       --header 'Content-Type: application/x-www-form-urlencoded' \
       --data 'code=4/1ASVgi3JLRQe2YG4xMZE2XjnOiyuq9ciA8UI8lNOtwtMkINx92ZkiL1r2Q60' \
       --data 'client_id=956039011085-f89cdcov6mncuedfkqaflhfa0gfoh629.apps.googleusercontent.com' \
       --data 'client_secret=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' \
       --data 'redirect_uri=urn:ietf:wg:oauth:2.0:oob' \
       --data 'grant_type=authorization_code'

**Playback Tests**
**Function to check if the play or resume button is visible**
       For playback tests, it needs to account for choosing a content that does not have a play or resume button and should exit, go to the next movie or series, then check if the play or resume button is visible then proceed with the test

       - If movie or series does not have play or resume button, 
       then it should go back to the last screen where the movies or series are listed, 
       press the right button, enter the next movie or series, 
       then check if the play or resume button is visible then proceed with the test

       - This should be a helper function that can be called in the playback tests

       - Should be able to insert it into other methods like startMoviePlayback, startSeriesPlayback, etc.
- [ ] Migrate methods from the playback tests to the playback page - do it one by one
- [ ] Finish running the playback tests on the Android TV

Please write typescript code that would randomly pick a movie title or a series title when user is in the page where the user can choose a movie or a series. The code should be:
1. Well-documented with clear comments
2. Follow best practices and design patterns
3. Include error handling
4. Be efficient and maintainable
5. it should take into account existing methods like startMoviePlayback, startSeriesPlayback, etc. and integrate it into the existing methods

Please write typescript code that would check if the play or resume button is visible when user enters a details page of a movie or a series.  If not then it should go back to the last screen where the user can choose a movie or a series and then check again.  When the play or resume button is visible then it should proceed with the test. The code should be:
1. Well-documented with clear comments
2. Follow best practices and design patterns
3. Include error handling
4. Be efficient and maintainable
5. it should take into account existing methods like startMoviePlayback, startSeriesPlayback, etc. and integrate it into the existing methods