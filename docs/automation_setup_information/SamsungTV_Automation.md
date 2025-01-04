# Samsung TV Automation Guide

## Core Requirements

1. **Essential Tools & Libraries**:
- Tizen Studio:
  1. [ ] Download and install Tizen Studio:
     - [ ] Visit developer.samsung.com/smarttv
     - [ ] Download Tizen Studio with TV extensions
     - [ ] Run installer and follow setup wizard
  2. [ ] Install required packages:
     - [ ] Launch Package Manager
     - [ ] Install TV Extensions-X.X
     - [ ] Install Samsung Certificate Extension
  3. [ ] Verify installation:
     ```bash
     tizen version
     sdb version
     ```

- Samsung Certificate Manager:
  1. [ ] Generate certificate:
     - [ ] Open Certificate Manager
     - [ ] Create new Samsung certificate
     - [ ] Create author certificate
     - [ ] Create distributor certificate
  2. [ ] Register certificate:
     ```bash
     tizen security-profiles add -n MyProfile -a author.p12 -p password
     ```
  3. [ ] Configure profile:
     ```bash
     tizen cli-config "default.profiles.path=path/to/profiles.xml"
     ```

- Samsung TV SDK:
  1. [ ] Install TV SDK tools:
     - [ ] Open Package Manager
     - [ ] Install "TV SDK Tools"
     - [ ] Install "TV SDK Build Tools"
  2. [ ] Configure environment:
     ```bash
     # Add to PATH
     export TIZEN_STUDIO=/path/to/tizen-studio
     export PATH=$PATH:$TIZEN_STUDIO/tools/ide/bin
     ```
  3. [ ] Install TV extensions:
     ```bash
     package-manager-cli install TizenTVSDK
     ```

- TypeScript Setup:
  1. Initialize project:
     ```bash
     npm init -y
     npm install --save-dev typescript @types/node
     ```
  2. Configure TypeScript:
     ```bash
     npx tsc --init
     ```
  3. Add test dependencies:
     ```bash
     npm install --save-dev jest @types/jest ts-jest
     ```

2. **Device Setup**:
- Physical Samsung TV:
  1. [ ] Enable Developer Mode:
     - [ ] Go to Apps
     - [ ] Press "1", "2", "3", "4", "5" in sequence
     - [ ] Enable Developer Mode
  2. [ ] Configure Network:
     - [ ] Connect TV to network
     - [ ] Note down TV's IP address
     - [ ] Enable Developer Mode options
  3. [ ] Install Development Certificate:
     ```bash
     sdb connect <TV-IP>
     tizen certificate -a MyProfile
     ```
  4. [ ] Enable Debug Mode:
     - [ ] Settings > System > Developer Options
     - [ ] Enable Debug Mode
     - [ ] Accept debugging connections

3. **Development Environment**:
- Project Setup:
  1. [ ] Create project structure:
     ```bash
     tizen create web-project -n samsung-tv-automation -t BasicTemplate
     cd samsung-tv-automation
     ```
  2. [ ] Initialize test environment:
     ```bash
     npm init -y
     npm install --save-dev @samsung/tv-test-automation
     ```
  3. [ ] Configure debugging:
     ```bash
     sdb connect <TV-IP>
     sdb devices
     ```

4. **Testing Framework Setup**:
- Test Structure:
  1. Install testing utilities:
     ```bash
     npm install --save-dev webdriver puppeteer
     npm install --save-dev @types/webdriver @types/puppeteer
     ```
  2. Configure test runner:
     ```typescript
     // test/setup.ts
     import { SamsungTV } from '@samsung/tv-test-automation';
     
     export async function setupDevice() {
       const tv = new SamsungTV({
         ip: process.env.TV_IP,
         port: 8001,
         token: process.env.TV_TOKEN
       });
       await tv.connect();
       return tv;
     }
     ```
  3. Add helper functions:
     ```typescript
     // utils/tv-helpers.ts
     export class TVHelper {
       static async pressKey(key: string) {
         await this.tv.sendKey(key);
       }
       
       static async launchApp(appId: string) {
         await this.tv.launch(appId);
       }
     }
     ```

5. **Debugging Tools Setup**:
- Chrome DevTools:
  1. Enable Web Inspector:
     - Developer Mode must be enabled
     - Note down TV's IP address
  2. Connect to DevTools:
     ```bash
     # Open Chrome and navigate to:
     # chrome://inspect/#devices
     ```
  3. Configure debugging:
     ```typescript
     async function setupDebugger() {
       const devtools = await ChromeDevTools.connect({
         ip: TV_IP,
         port: 9998
       });
       await devtools.Network.enable();
     }
     ```

6. **CI/CD Integration**:
- GitHub Actions Setup:
  1. Create workflow:
     ```yaml
     # .github/workflows/samsung-tv-tests.yml
     name: Samsung TV Tests
     on: [push, pull_request]
     
     jobs:
       test:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v2
           - name: Setup Node.js
             uses: actions/setup-node@v2
           - name: Install dependencies
             run: npm ci
           - name: Run tests
             env:
               TV_IP: ${{ secrets.TV_IP }}
               TV_TOKEN: ${{ secrets.TV_TOKEN }}
             run: npm test
     ```
  2. Add test reporting:
     ```bash
     npm install --save-dev jest-junit
     ```
  3. Configure reporting:
     ```json
     {
       "jest": {
         "reporters": [
           "default",
           ["jest-junit", {"outputDirectory": "test-results"}]
         ]
       }
     }
     ```

## Core Questions & Answers

### Q: For Samsung TV what do I need aside from TypeScript and Puppeteer to be able to automate tests on streaming applications?
A: Here's what you need for Samsung TV automation:

1. **Core Requirements**:
- Tizen Studio: Samsung's official IDE for TV app development and testing
- Samsung TV SDK: Development kit for Samsung TV applications
- SDB (Samsung Debug Bridge): Similar to ADB, for device communication
- TypeScript: For writing structured test code
- WebDriver: For UI automation (Samsung TVs use web-based platform)

2. **Framework Setup Example**:
```typescript
// Basic structure for Samsung TV automation
import { SamsungTV } from 'samsung-tv-control';
import { WebDriver } from 'webdriver';

class SamsungTVAutomation {
    private tv: SamsungTV;
    private driver: WebDriver;
    
    constructor() {
        this.tv = new SamsungTV({
            ip: '192.168.1.x',  // TV's IP address
            port: 8001,
            token: 'xxxxx'      // TV's token
        });
    }
    
    async connectToTV() {
        await this.tv.isAvailable();
        await this.driver.connect();
    }
}
```

3. **Additional Tools Needed**:
- Samsung Certificate Manager: For app signing
- Samsung Remote Test Lab: For testing on virtual devices
- Network debugging tools: For monitoring TV communication
- Device Inspector: For element inspection
- Test frameworks: Jest or Mocha for test organization

4. **Key Components**:
```typescript
class StreamingAppTest {
    // Remote control simulation
    async remoteControl() {
        await this.tv.sendKey('KEY_ENTER');
        await this.tv.sendKey('KEY_RIGHT');
    }
    
    // Element interaction
    async interactWithApp() {
        await this.driver.findElement('playButton').click();
        await this.waitForPlayback();
    }
    
    // Network monitoring
    async checkStreaming() {
        await this.monitor.checkBandwidth();
        await this.monitor.verifyResolution();
    }
}
```

## Development Environment Setup

1. **Initial Setup**:
- Install Tizen Studio
- Configure Samsung TV certificates
- Set up development mode on TV
- Configure network connection
- Install necessary extensions

2. **Device Configuration**:
- Enable developer mode on TV
- Configure IP connection
- Set up debugging ports
- Install development certificates

3. **Testing Framework Setup**:
- Configure WebDriver
- Set up test runners
- Configure reporting tools
- Set up CI/CD integration

## Best Practices

1. **Element Location**:
- Use unique identifiers
- Implement proper waits
- Handle focus states
- Use reliable selectors

2. **Test Organization**:
- Implement Page Object Model
- Separate test logic
- Create reusable components
- Maintain test data

3. **Error Handling**:
- Implement retry mechanisms
- Add detailed logging
- Take screenshots on failures
- Record test sessions

4. **Performance Testing**:
- Monitor app performance
- Track memory usage
- Monitor network conditions
- Verify streaming quality

5. **Test Reporting**:
- Generate detailed reports
- Include screenshots
- Log all interactions
- Track test metrics 