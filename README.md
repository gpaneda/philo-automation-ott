# Fire TV Philo Automation Framework

This repository contains an automated testing framework for the Philo app on Fire TV devices, built with TypeScript, WebdriverIO, and Appium.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- ADB (Android Debug Bridge)
- Appium Server
- Fire TV device or emulator

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd fire-tv-philo-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create OAuth Credentials for Gmail Account**
   To access the Gmail API, you need to create OAuth 2.0 credentials. Follow these steps:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to **API & Services** > **Library** and enable the **Gmail API**.
   - Go to **API & Services** > **Credentials**.
   - Click on **Create Credentials** and select **OAuth client ID**.
   - Configure the consent screen if prompted.
   - Choose **Desktop app** as the application type.
   - Click **Create**. You will receive a **Client ID** and **Client Secret**.
   - Add the following environment variables to your `.env` file:
     ```
     GMAIL_CLIENT_ID=YOUR_CLIENT_ID
     GMAIL_CLIENT_SECRET=YOUR_CLIENT_SECRET
     GMAIL_REFRESH_TOKEN=YOUR_REFRESH_TOKEN
     GMAIL_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
     GMAIL_REDIRECT_URI=urn:ietf:wg:oauth:2.0:oob
     ```

5. **Obtain Access and Refresh Tokens**
   After creating your OAuth credentials, follow these steps to obtain the access and refresh tokens:
   - Construct the authorization URL using the following format:
     ```
     https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=YOUR_REDIRECT_URI&client_id=YOUR_CLIENT_ID
     ```
   - Replace `YOUR_REDIRECT_URI` with `urn:ietf:wg:oauth:2.0:oob` and `YOUR_CLIENT_ID` with your actual client ID.
   - Open this URL in a web browser. You will be prompted to log in to your Google account and grant permissions to your application.
   - After granting permission, you will be redirected to the specified redirect URI with an authorization code in the URL.
   - Use the authorization code to request access and refresh tokens. You can do this using a tool like `curl` or Postman, or by writing a script. Here's an example using `curl`:
     ```bash
     curl --request POST \
       --url https://oauth2.googleapis.com/token \
       --header 'Content-Type: application/x-www-form-urlencoded' \
       --data 'code=YOUR_AUTHORIZATION_CODE' \
       --data 'client_id=YOUR_CLIENT_ID' \
       --data 'client_secret=YOUR_CLIENT_SECRET' \
       --data 'redirect_uri=urn:ietf:wg:oauth:2.0:oob' \
       --data 'grant_type=authorization_code'
     ```
   - Replace `YOUR_AUTHORIZATION_CODE`, `YOUR_CLIENT_ID`, and `YOUR_CLIENT_SECRET` with the appropriate values.
   - This request will return a JSON response containing the `access_token`, `refresh_token`, and other information. Store these tokens securely in your `.env` file.

## 🔧 Device Setup

1. **Enable Developer Options on Fire TV**
   - Navigate to Settings > My Fire TV > About
   - Click on Fire TV Stick/Device Name 7 times
   - Go back to Settings > My Fire TV > Developer Options
   - Enable "ADB debugging" and "Apps from Unknown Sources"

2. **Connect to Fire TV**
   - Find your Fire TV's IP address in Settings > My Fire TV > About > Network
   - Connect via ADB:
     ```bash
     adb connect <FIRE-TV-IP>:5555
     ```

## 🚀 Running Tests

1. **Start Appium Server**
   ```bash
   appium
   ```

2. **Run all tests**
   ```bash
   npm test
   ```

3. **Run specific test suite**
   ```bash
   npm test -- --suite <suite-name>
   ```

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── pages/          # Page objects
├── tests/          # Test suites
├── scripts/        # Utility scripts
└── types/          # TypeScript type definitions
```

## 🧪 Test Suites

- **Playback Tests**: Verify video playback functionality
- **Navigation Tests**: Test app navigation and UI interactions
- **Series/Movies Tests**: Validate content browsing and details
- **Search Tests**: Test search functionality
- **Guide Tests**: Verify program guide features

## 📊 Reports

Test reports are generated in the `reports/` directory after each test run. We use Allure for reporting:

```bash
npm run report
```

## 🔍 Debugging

1. **View Device Logs**
   ```bash
   adb logcat
   ```

2. **UI Hierarchy Dumps**
   ```bash
   adb shell uiautomator dump /sdcard/ui_dump.xml
   adb pull /sdcard/ui_dump.xml 
   ```

3. **Screenshots**
   ```bash
   npm run screenshot
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Environment Variables

Required environment variables in `.env`:

- `FIRE_TV_IP`: IP address of your Fire TV device
- `PHILO_USERNAME`: Philo account username
- `PHILO_PASSWORD`: Philo account password
- Additional variables as specified in `.env.example`
- `GMAIL_CLIENT_ID`: Gmail API client ID
- `GMAIL_CLIENT_SECRET`: Gmail API client secret
- `GMAIL_REFRESH_TOKEN`: Gmail refresh token
- `GMAIL_ACCESS_TOKEN`: Gmail access token
- `GMAIL_REDIRECT_URI`: OAuth redirect URI

## 📚 Documentation

Additional documentation can be found in the `docs/` directory:
- Android TV Automation Guide
- Test Writing Guidelines
- Troubleshooting Guide

## 🐛 Known Issues

- List any known issues or limitations
- Workarounds if available

## 🤖 GitHub Actions Setup

1. **Basic Workflow Setup**
   - Automated linting on code changes
   - Runs on push to main branch
   - Manual trigger option available

2. **Environment Setup**
   Required secrets in GitHub:
   - `FIRE_TV_IP`: Fire TV device IP address
   - `FIRE_TV_PORT`: ADB port (usually 5555)
   - `APPIUM_HOST`: Appium server host
   - `APPIUM_PORT`: Appium server port
   - `APP_PACKAGE`: Philo app package name
   - `APP_ACTIVITY`: Main activity name
   - `PHILO_EMAIL`: Philo account email
   - `GMAIL_CLIENT_ID`: Gmail API client ID
   - `GMAIL_CLIENT_SECRET`: Gmail API client secret
   - `GMAIL_REFRESH_TOKEN`: Gmail refresh token
   - `GMAIL_ACCESS_TOKEN`: Gmail access token
   - `GMAIL_REDIRECT_URI`: OAuth redirect URI
   - `DEFAULT_TIMEOUT`: Default timeout value
   - `RETRY_ATTEMPTS`: Number of retry attempts

3. **Adding Secrets**
   - Go to repository Settings
   - Navigate to Secrets and Variables > Actions
   - Click "New repository secret"
   - Add each required secret

4. **Future Enhancements**
   - Fire TV emulator setup for CI/CD
   - Automated test runs
   - Test result reporting
   - Device/emulator management

   - How to compile websocket server:
     ```bash
     npx tsc simpleWebSocketServer.ts
     ```

   - How to run websocket server:
     ```bash
     node simpleWebSocketServer.js
     ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, please:
1. Check existing issues
2. Review documentation
3. Create a new issue with detailed information

## Testing 🧪

To run individual test suites:
```bash
npm test src/tests/navigation.test.ts
npm test src/tests/playback.test.ts
npm test src/tests/seriesDetails.test.ts
```

To run all test suites sequentially with a pause between each suite:
```bash
npm test src/tests/navigation.test.ts --reporters=jest-html-reporter; sleep 10; npm test src/tests/playback.test.ts --reporters=jest-html-reporter; sleep 10; npm test src/tests/seriesDetails.test.ts --reporters=jest-html-reporter
```

Each test run will generate an HTML report in the `reports` directory.

---
*Note: This framework is designed for testing purposes only and should not be used for any unauthorized automation of the Philo app.* 

