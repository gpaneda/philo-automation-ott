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
- [ ] Include historical run both in Test Suite Page and Test History page 
- [ ] Troubleshoot Stop Run button - does not work
- [ ] Device should be disabled when it is running a test
- [ ] Landing page status not updating
- [ ] Add android TV to .env file and capabilities file
  APP_ACTIVITY=com.philo.philo.ui.activity.MainTabbedActivity
  APP_PACKAGE=com.philo.philo.google
  ANDROID_TV_IP=10.0.0.130
  ANDROID_TV_PORT=5555
Test Credentials:

### Notes for the Dashboard UI
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Test History page
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Pie Chart page
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the  Reports page
- [ ] Need to have the results of the tests integrated into the dashboard so that it can be displayed in the Test Execution page

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