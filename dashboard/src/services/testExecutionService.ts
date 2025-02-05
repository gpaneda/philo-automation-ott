import axios from 'axios';

// Define interfaces for type safety
interface TestExecutionConfig {
  suiteId: string;
  testId?: string;
  deviceId: string;
  deviceIp?: string;
  mode: 'single' | 'suite' | 'failed';
}

interface TestResult {
  testId: string;
  status: string;
  duration: number;
  error?: string;
  logs: string[];
  screenshots: string[];
  deviceInfo: {
    id: string;
    name: string;
    version: string;
  };
}

interface TestExecutionResponse {
  success: boolean;
  output: string;
  errors?: string;
}

interface DeviceStatus {
  connected: boolean;
  lastChecked: string;
}

export class TestExecutionService {
  private baseUrl: string;
  private deviceControlEndpoint: string;
  private deviceEmailMap: Map<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_TEST_FRAMEWORK_URL || 'http://localhost:3001';
    this.deviceControlEndpoint = `${this.baseUrl}/api/device-control`;
    this.deviceEmailMap = new Map();
  }

  public getEmailForDevice(deviceIp: string): string {
    console.log(`Device IP received: ${deviceIp}`); // Log the input
    switch (deviceIp) {
      case '10.0.0.130':
        return process.env.PHILO_EMAIL_3!;
      case '10.0.0.55':
        return process.env.PHILO_EMAIL_2!;
      case '10.0.0.98':
        return process.env.PHILO_EMAIL!;
      default:
        return process.env.PHILO_EMAIL!; // Default to first device
    }
  }

  async connectToDevice(deviceId: string, deviceIp?: string): Promise<void> {
    try {
      const email = deviceIp ? this.getEmailForDevice(deviceIp) : process.env.PHILO_EMAIL;
      const url = `${this.deviceControlEndpoint}/connect`;
      console.log('Attempting to connect to device at URL:', url);
      console.log('Request payload:', { deviceId, deviceIp, email });
      
      const response = await axios.post(url, { 
        deviceId,
        deviceIp,
        email
      });

      if (!response.data.connected) {
        throw new Error(response.data.error || 'Failed to connect to device');
      }
    } catch (error: any) {
      console.error('Device connection failed:', error);
      throw new Error(`Device connection failed: ${error.message}`);
    }
  }

  async getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
    try {
      const response = await axios.get(`${this.deviceControlEndpoint}/status/${deviceId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get device status:', error);
      throw new Error(`Failed to get device status: ${error.message}`);
    }
  }

  async executeTest(config: TestExecutionConfig): Promise<TestExecutionResponse> {
    try {
      // First ensure device is connected with the correct email
      await this.connectToDevice(config.deviceId, config.deviceIp);

      // Start test execution
      const response = await axios.post(`${this.baseUrl}/api/execute`, {
        ...config,
        email: config.deviceIp ? this.getEmailForDevice(config.deviceIp) : process.env.PHILO_EMAIL
      });
      
      return {
        success: response.data.success,
        output: response.data.output,
        errors: response.data.errors
      };
    } catch (error: any) {
      console.error('Test execution failed:', error);
      return {
        success: false,
        output: '',
        errors: `Test execution failed: ${error.message}`
      };
    }
  }

  async executeSuite(config: TestExecutionConfig): Promise<TestExecutionResponse> {
    try {
      // First ensure device is connected with the correct email
      await this.connectToDevice(config.deviceId, config.deviceIp);

      // Start suite execution
      const response = await axios.post(`${this.baseUrl}/api/execute-suite`, {
        ...config,
        email: config.deviceIp ? this.getEmailForDevice(config.deviceIp) : process.env.PHILO_EMAIL
      });
      
      return {
        success: response.data.success,
        output: response.data.output,
        errors: response.data.errors
      };
    } catch (error: any) {
      console.error('Suite execution failed:', error);
      return {
        success: false,
        output: '',
        errors: `Suite execution failed: ${error.message}`
      };
    }
  }

  async executeFailedTests(config: TestExecutionConfig): Promise<TestExecutionResponse> {
    try {
      await this.connectToDevice(config.deviceId, config.deviceIp);
      const response = await axios.post(`${this.baseUrl}/api/execute-failed`, {
        ...config,
        email: config.deviceIp ? this.getEmailForDevice(config.deviceIp) : process.env.PHILO_EMAIL
      });
      
      return {
        success: response.data.success,
        output: response.data.output,
        errors: response.data.errors
      };
    } catch (error: any) {
      console.error('Failed tests execution failed:', error);
      return {
        success: false,
        output: '',
        errors: `Failed tests execution failed: ${error.message}`
      };
    }
  }

  async stopExecution(config: TestExecutionConfig): Promise<void> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/stop-execution`, config);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to stop test execution');
      }
    } catch (error: any) {
      console.error('Failed to stop execution:', error);
      throw new Error(`Stop execution failed: ${error.message}`);
    }
  }

  // Get test logs
  async getTestLogs(testId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/logs/${testId}`);
      return response.data.logs;
    } catch (error: any) {
      console.error('Failed to get test logs:', error);
      throw new Error(`Log retrieval failed: ${error.message}`);
    }
  }

  // Get test screenshots
  async getTestScreenshots(testId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/screenshots/${testId}`);
      return response.data.screenshots;
    } catch (error: any) {
      console.error('Failed to get test screenshots:', error);
      throw new Error(`Screenshot retrieval failed: ${error.message}`);
    }
  }
} 