import axios from 'axios';

// Define interfaces for type safety
interface TestExecutionConfig {
  deviceId: string;
  testId?: string;
  suiteId?: string;
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

class TestExecutionService {
  private baseUrl: string;
  private deviceControlEndpoint: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_TEST_FRAMEWORK_URL || 'http://localhost:3001';
    this.deviceControlEndpoint = `${this.baseUrl}/device-control`;
  }

  // Check device status and establish connection
  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.deviceControlEndpoint}/connect`, { deviceId });
      return response.data.connected;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      throw new Error(`Device connection failed: ${error.message}`);
    }
  }

  // Execute a single test
  async executeTest(config: TestExecutionConfig): Promise<TestResult> {
    try {
      // First ensure device is connected
      await this.connectToDevice(config.deviceId);

      // Start test execution
      const response = await axios.post(`${this.baseUrl}/execute`, config);
      
      // Set up WebSocket connection for real-time updates
      this.setupWebSocket(config);

      return response.data;
    } catch (error) {
      console.error('Test execution failed:', error);
      throw new Error(`Test execution failed: ${error.message}`);
    }
  }

  // Execute an entire test suite
  async executeSuite(config: TestExecutionConfig): Promise<TestResult[]> {
    try {
      await this.connectToDevice(config.deviceId);
      const response = await axios.post(`${this.baseUrl}/execute-suite`, config);
      this.setupWebSocket(config);
      return response.data;
    } catch (error) {
      console.error('Suite execution failed:', error);
      throw new Error(`Suite execution failed: ${error.message}`);
    }
  }

  // Execute failed tests in a suite
  async executeFailedTests(config: TestExecutionConfig): Promise<TestResult[]> {
    try {
      await this.connectToDevice(config.deviceId);
      const response = await axios.post(`${this.baseUrl}/execute-failed`, config);
      this.setupWebSocket(config);
      return response.data;
    } catch (error) {
      console.error('Failed tests execution failed:', error);
      throw new Error(`Failed tests execution failed: ${error.message}`);
    }
  }

  // Stop test execution
  async stopExecution(config: TestExecutionConfig): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/stop-execution`, config);
    } catch (error) {
      console.error('Failed to stop execution:', error);
      throw new Error(`Stop execution failed: ${error.message}`);
    }
  }

  // Set up WebSocket connection for real-time updates
  private setupWebSocket(config: TestExecutionConfig): void {
    const ws = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/test-updates`);
    
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
  }

  // Get device status
  async getDeviceStatus(deviceId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.deviceControlEndpoint}/status/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get device status:', error);
      throw new Error(`Device status check failed: ${error.message}`);
    }
  }

  // Get test logs
  async getTestLogs(testId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/logs/${testId}`);
      return response.data.logs;
    } catch (error) {
      console.error('Failed to get test logs:', error);
      throw new Error(`Log retrieval failed: ${error.message}`);
    }
  }

  // Get test screenshots
  async getTestScreenshots(testId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/screenshots/${testId}`);
      return response.data.screenshots;
    } catch (error) {
      console.error('Failed to get test screenshots:', error);
      throw new Error(`Screenshot retrieval failed: ${error.message}`);
    }
  }
} 