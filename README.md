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
   npm run dump-ui
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

## 📚 Documentation

Additional documentation can be found in the `docs/` directory:
- Android TV Automation Guide
- Test Writing Guidelines
- Troubleshooting Guide

## 🐛 Known Issues

- List any known issues or limitations
- Workarounds if available

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