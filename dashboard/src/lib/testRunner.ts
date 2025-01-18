// Test Runner Interface - Safe integration layer between dashboard and test framework
import { spawn } from 'child_process';

interface TestRunOptions {
  suite?: string;
  testCase?: string;
  device?: string;
  retries?: number;
  parallel?: boolean;
  recordVideo?: boolean;
  takeScreenshots?: boolean;
}

export class TestRunner {
  private baseCommand: string;
  private configPath: string;

  constructor() {
    // These should be configurable and loaded from environment variables
    this.baseCommand = 'npm run test'; // Default command
    this.configPath = './test-config.json'; // Default config path
  }

  /**
   * Dry run - validates the command without executing
   */
  async validateCommand(options: TestRunOptions): Promise<{ valid: boolean; command: string }> {
    const command = this.buildCommand(options);
    // Add validation logic here
    return { valid: true, command };
  }

  /**
   * Builds the command string without executing
   */
  private buildCommand(options: TestRunOptions): string {
    const args: string[] = [];

    if (options.suite) {
      args.push(`--suite="${options.suite}"`);
    }
    if (options.testCase) {
      args.push(`--test="${options.testCase}"`);
    }
    if (options.device) {
      args.push(`--device="${options.device}"`);
    }
    if (options.retries) {
      args.push(`--retries=${options.retries}`);
    }
    if (options.parallel) {
      args.push('--parallel');
    }
    if (options.recordVideo) {
      args.push('--record-video');
    }
    if (options.takeScreenshots) {
      args.push('--screenshots');
    }

    return `${this.baseCommand} ${args.join(' ')}`;
  }

  /**
   * Executes a test run with safety checks
   */
  async runTest(options: TestRunOptions): Promise<{ 
    success: boolean; 
    output: string; 
    command: string;
    error?: string;
  }> {
    try {
      // First validate the command
      const validation = await this.validateCommand(options);
      if (!validation.valid) {
        throw new Error('Invalid test command configuration');
      }

      // Create a promise to handle the async execution
      return new Promise((resolve, reject) => {
        const command = this.buildCommand(options);
        let output = '';
        let error = '';

        // Log the command that will be executed
        console.log(`Executing test command: ${command}`);

        // Split command into program and args
        const [prog, ...args] = command.split(' ');
        
        // Spawn the process
        const process = spawn(prog, args, {
          shell: true,
          env: { ...process.env }
        });

        // Collect output
        process.stdout.on('data', (data) => {
          output += data.toString();
        });

        process.stderr.on('data', (data) => {
          error += data.toString();
        });

        // Handle process completion
        process.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              output,
              command,
            });
          } else {
            resolve({
              success: false,
              output,
              command,
              error: error || `Process exited with code ${code}`
            });
          }
        });

        // Handle process errors
        process.on('error', (err) => {
          reject({
            success: false,
            output,
            command,
            error: err.message
          });
        });
      });
    } catch (error) {
      return {
        success: false,
        output: '',
        command: this.buildCommand(options),
        error: error.message
      };
    }
  }

  /**
   * Stops a running test safely
   */
  async stopTest(testId: string): Promise<boolean> {
    // Implement safe test stopping logic
    // This should gracefully stop the test without corrupting any state
    return true;
  }

  /**
   * Gets the current status of a test run
   */
  async getTestStatus(testId: string): Promise<{
    status: 'running' | 'completed' | 'failed' | 'stopped';
    progress?: number;
    currentStep?: string;
  }> {
    // Implement status checking logic
    return {
      status: 'running',
      progress: 50,
      currentStep: 'Executing test cases'
    };
  }
}

// Export a singleton instance
export const testRunner = new TestRunner(); 