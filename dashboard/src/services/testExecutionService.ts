import axios from 'axios';

// Define interfaces for type safety
interface TestExecutionConfig {
  deviceId: string;
  testId?: string;
  suiteId?: string;
  mode: 'single' | 'suite' | 'failed';
  deviceIp?: string;  // Add deviceIp to the config
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
  errors: string;
}

export class TestExecutionService {
  private baseUrl: string;
  private deviceControlEndpoint: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_TEST_FRAMEWORK_URL || 'http://localhost:3001';
    this.deviceControlEndpoint = `${this.baseUrl}/api/device-control`;
  }

  // Helper method to determine which email to use based on device IP
  private getEmailForDevice(deviceIp: string): string {
    switch (deviceIp) {
      case '10.0.0.55':
        return process.env.PHILO_EMAIL_2!;
      case '10.0.0.98':
        return process.env.PHILO_EMAIL!;
      default:
        return process.env.PHILO_EMAIL!; // Default to first device
    }
  }

  // Check device status and establish connection
  async connectToDevice(deviceId: string, deviceIp?: string): Promise<boolean> {
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
      return response.data.connected;
    } catch (error: any) {
      console.error('Failed to connect to device:', error);
      throw new Error(`Device connection failed: ${error.message}`);
    }
  }

  // Execute a single test
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

  // Execute an entire test suite
  async executeSuite(config: TestExecutionConfig): Promise<TestExecutionResponse> {
    try {
      await this.connectToDevice(config.deviceId, config.deviceIp);
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

  // Execute failed tests in a suite
  async executeFailedTests(config: TestExecutionConfig): Promise<TestResult[]> {
    try {
      await this.connectToDevice(config.deviceId, config.deviceIp);
      const response = await axios.post(`${this.baseUrl}/api/execute-failed`, {
        ...config,
        email: config.deviceIp ? this.getEmailForDevice(config.deviceIp) : process.env.PHILO_EMAIL
      });
      // Temporarily disable WebSocket
      // this.setupWebSocket(config);
      return response.data;
    } catch (error: any) {
      console.error('Failed tests execution failed:', error);
      throw new Error(`Failed tests execution failed: ${error.message}`);
    }
  }

  // Stop test execution
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

  // Set up WebSocket connection for real-time updates
  private setupWebSocket(config: TestExecutionConfig): void {
    // Temporarily disable WebSocket setup
    /*
    const ws = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/api/test-updates`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Emit events for UI updates
      window.dispatchEvent(new CustomEvent('test-update', { detail: update }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    */
  }

  // Get device status
  async getDeviceStatus(deviceId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.deviceControlEndpoint}/status/${deviceId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get device status:', error);
      throw new Error(`Device status check failed: ${error.message}`);
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