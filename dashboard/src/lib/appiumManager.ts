import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AppiumManager {
  private static readonly APPIUM_URL = 'http://localhost:4723/wd/hub/status';
  private static isStarting = false;

  static async isAppiumRunning(): Promise<boolean> {
    try {
      const response = await axios.get(this.APPIUM_URL);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  static async startAppium(): Promise<boolean> {
    if (this.isStarting) {
      console.log('Appium server is already starting...');
      return false;
    }

    try {
      this.isStarting = true;
      console.log('Starting Appium server...');
      
      // Use the direct appium command
      const { stdout, stderr } = await execAsync('appium --base-path /wd/hub', {
        cwd: process.cwd()
      });
      
      // Wait for Appium to be fully started
      let attempts = 0;
      while (attempts < 10) {
        if (await this.isAppiumRunning()) {
          console.log('Appium server started successfully');
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      
      console.error('Appium server failed to start. stdout:', stdout, 'stderr:', stderr);
      throw new Error('Appium server failed to start: ' + stderr);
    } catch (error) {
      console.error('Failed to start Appium:', error);
      return false;
    } finally {
      this.isStarting = false;
    }
  }

  static async ensureAppiumRunning(): Promise<boolean> {
    const isRunning = await this.isAppiumRunning();
    if (!isRunning) {
      return this.startAppium();
    }
    return true;
  }
} 