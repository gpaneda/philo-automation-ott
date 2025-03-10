# Philo Mobile Automation Strategy

This document outlines the strategy for automating Philo's mobile applications across iOS and Android platforms using a unified framework.

## Unified Framework Approach

### Benefits of a Combined Framework

- **Code Reusability**: Share test logic, page objects, and utilities across platforms
- **Maintenance Efficiency**: Single codebase to maintain rather than separate iOS and Android frameworks
- **Consistent Testing Methodology**: Standardized approach to test design and execution
- **Simplified CI/CD Integration**: Single pipeline configuration with platform-specific execution paths
- **Unified Reporting**: Consolidated test results across platforms

### Potential Challenges

- **Platform-Specific Elements**: Different UI elements and interactions between iOS and Android
- **Performance Variations**: Tests may execute at different speeds on different platforms
- **Device-Specific Issues**: Some bugs may only appear on specific device/OS combinations
- **Maintenance Complexity**: Changes must be tested across both platforms

## Technical Architecture

### Core Technologies

- **Primary Framework**: Appium
- **Test Runner**: Jest
- **Programming Language**: TypeScript
- **Assertion Library**: Jest built-in assertions + custom matchers
- **Reporting**: Allure Report or Jest HTML Reporter

### Framework Structure 

## Implementation Strategy

### 1. Abstraction Layer

Create a platform abstraction layer that handles differences between iOS and Android:

```typescript
// Example of platform-adapter.ts
export class PlatformAdapter {
  static getElementStrategy(elementKey: string): LocatorStrategy {
    switch (process.env.PLATFORM) {
      case 'ios':
        return iosElementMap[elementKey];
      case 'android':
        return androidElementMap[elementKey];
      default:
        throw new Error(`Unsupported platform: ${process.env.PLATFORM}`);
    }
  }
  
  static performScroll(direction: 'up' | 'down'): void {
    if (process.env.PLATFORM === 'ios') {
      // iOS-specific scroll implementation
    } else {
      // Android-specific scroll implementation
    }
  }
}
```

### 2. Page Object Model

Implement a shared page object model with platform-specific implementations when necessary:

```typescript
// Base page object
export abstract class BasePage {
  async waitForPageLoaded(): Promise<void> {
    // Common implementation
  }
  
  // Methods that might need platform-specific implementations
  abstract navigateBack(): Promise<void>;
}

// iOS implementation
export class IosHomePage extends BasePage {
  navigateBack(): Promise<void> {
    // iOS-specific back navigation
  }
}

// Android implementation
export class AndroidHomePage extends BasePage {
  navigateBack(): Promise<void> {
    // Android-specific back navigation
  }
}

// Factory to get the right implementation
export class HomePageFactory {
  static getHomePage(): BasePage {
    return process.env.PLATFORM === 'ios' 
      ? new IosHomePage() 
      : new AndroidHomePage();
  }
}
```

### 3. Test Structure

Write platform-agnostic tests that use the abstraction layer:

```typescript
describe('Login Flow', () => {
  let loginPage;
  let homePage;
  
  beforeEach(() => {
    loginPage = LoginPageFactory.getLoginPage();
    homePage = HomePageFactory.getHomePage();
  });
  
  test('User can login with valid credentials', async () => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    expect(await homePage.isUserLoggedIn()).toBe(true);
  });
});
```

## Test Execution Strategy

### Local Development

- Use `platform` parameter to specify target platform:
  ```bash
  npm run test -- --platform=ios
  npm run test -- --platform=android
  ```

### CI/CD Integration

- Run tests in parallel for both platforms
- Use device farms (BrowserStack, AWS Device Farm, etc.) for broader device coverage
- Matrix builds to test across multiple OS versions

```yaml
# Example GitHub Actions workflow
jobs:
  test:
    strategy:
      matrix:
        platform: [ios, android]
        include:
          - platform: ios
            device: 'iPhone 13'
          - platform: android
            device: 'Samsung Galaxy S21'
    
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: npm run test -- --platform=${{ matrix.platform }} --device=${{ matrix.device }}
```

## Test Data Management

- Use environment-specific test data when needed
- Implement test data factories that can generate platform-specific data
- Maintain shared test users and credentials

## Reporting and Analysis

- Generate unified reports showing results across platforms
- Tag tests with platform-specific metadata
- Track platform-specific metrics (execution time, failure rates)

## Best Practices

1. **Write Platform-Agnostic Tests**: Focus on user journeys rather than implementation details
2. **Isolate Platform-Specific Code**: Keep platform-specific code isolated in dedicated modules
3. **Parameterize Tests**: Use parameters for values that differ between platforms
4. **Consistent Selectors**: Use accessibility IDs that are consistent across platforms when possible
5. **Graceful Degradation**: Handle platform-specific features gracefully
6. **Visual Testing**: Consider visual testing tools to catch UI inconsistencies between platforms

## Phased Implementation

1. **Phase 1**: Set up core framework and implement login/authentication tests
2. **Phase 2**: Add content browsing and playback tests
3. **Phase 3**: Implement account management and settings tests
4. **Phase 4**: Add edge cases and performance tests

## Conclusion

A unified mobile automation framework for Philo's iOS and Android applications is not only feasible but recommended. By leveraging TypeScript's type system, Appium's cross-platform capabilities, and Jest's robust testing features, we can create a maintainable and efficient testing solution that ensures quality across both mobile platforms.

The key to success will be proper abstraction of platform differences while maintaining a single source of truth for test logic and business rules. This approach balances the efficiency of a unified codebase with the flexibility needed to handle platform-specific behaviors. 

philo-mobile-automation/
├── config/
│ ├── ios.config.ts
│ ├── android.config.ts
│ └── common.config.ts
├── src/
│ ├── core/
│ │ ├── base-page.ts
│ │ ├── base-element.ts
│ │ ├── platform-adapter.ts
│ │ └── test-context.ts
│ ├── pages/
│ │ ├── common/
│ │ │ ├── login-page.ts
│ │ │ ├── home-page.ts
│ │ │ └── player-page.ts
│ │ ├── ios/
│ │ │ └── [iOS-specific page objects]
│ │ └── android/
│ │ └── [Android-specific page objects]
│ ├── utils/
│ │ ├── gestures.ts
│ │ ├── wait-utils.ts
│ │ └── test-data.ts
│ └── tests/
│ ├── login.test.ts
│ ├── navigation.test.ts
│ ├── playback.test.ts
│ └── settings.test.ts
├── resources/
│ ├── test-data/
│ └── test-users/
├── reports/
├── package.json
└── tsconfig.json