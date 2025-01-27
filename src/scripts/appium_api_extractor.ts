import { remote } from 'webdriverio';
import axios from 'axios';
import * as fs from 'fs';
import { fireTVCapabilities } from '../config/capabilities';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { LoggingInterceptor } from './loggingInterceptor';
import { exec } from 'child_process';

const execAsync = promisify(require('child_process').exec);

// Create an Axios instance with the LoggingInterceptor
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
    const loggingInterceptor = new LoggingInterceptor();
    await loggingInterceptor.intercept(config);
    return config;
});

class AppiumAPIExtractor {
    private driver: any;
    private networkLogs: any[] = [];
    private isRunning: boolean = false;
    private logProcess: any;
    private deviceId: string = '10.0.0.98:5555';
    private logFilePath: string = 'api_logs.json';
    private async stopLogging() {
        if (this.logProcess) {
            this.logProcess.kill(); // Terminate the logcat process
            console.log('Logging stopped.');
        }
        // Additional cleanup logic if necessary
    }
    private async saveAPILogs(logs: { timestamp: string; message: string; level: string }[]) {
        const logFilePath = 'api_logs.json'; // Define your log file path
        try {
            // Read existing logs
            const existingLogs = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8')) : [];
            // Combine existing logs with new logs
            const updatedLogs = existingLogs.concat(logs);
            // Write updated logs back to the file
            fs.writeFileSync(logFilePath, JSON.stringify(updatedLogs, null, 2));
            console.log('Logs saved successfully.');
        } catch (error) {
            console.error('Error saving logs:', error);
        }
    }
    constructor() {
        // Remove the OkHttpClient initialization
        // this.httpClient = new OkHttpClient.Builder()
        //     .addInterceptor(new LoggingInterceptor())
        //     .build();
    }   
    async initializeAppium() {
        this.driver = await remote({
            path: '/wd/hub',
            hostname: 'localhost',
            port: 4723,
            capabilities: fireTVCapabilities
        });
    }

    async captureAPIData() {
        if (!this.driver) {
            throw new Error('Appium session not initialized');
        }

        console.log('Please ensure Charles Proxy is running on port 8888');
        console.log('Enable SSL Proxying in Charles: Proxy > SSL Proxying Settings');
        console.log('Add "*" to the list of SSL hosts to capture all HTTPS traffic');
        
        try {
            // Enable more verbose logging for all relevant components
            const loggingCommands = [
                'setprop log.tag.OkHttp VERBOSE',
                'setprop log.tag.okhttp3 VERBOSE',
                'setprop log.tag.Retrofit VERBOSE',
                'setprop log.tag.PhiloApp VERBOSE',
                'setprop log.tag.VideoPlayer VERBOSE',
                'setprop log.tag.WebView VERBOSE',
                'setprop log.tag.MediaPlayer VERBOSE',
                'setprop log.tag.ExoPlayer VERBOSE',
                'setprop debug.firebase.analytics.app com.philo.philo',
                'setprop log.tag.System.out VERBOSE',
                'setprop log.tag.System.err VERBOSE',
                'setprop log.tag.ActivityManager VERBOSE',
                'setprop log.tag.HttpURLConnection VERBOSE',
                'setprop log.tag.chromium VERBOSE',
                'setprop log.tag.TcpSocket VERBOSE',
                'setprop log.tag.WebViewClient VERBOSE',
                'setprop log.tag.JavaBridge VERBOSE',
                'setprop log.tag.JS VERBOSE',
                'setprop log.tag.art VERBOSE',
                'setprop log.tag.InputDispatcher VERBOSE',
                'setprop log.tag.KeyEvent VERBOSE',
                'setprop log.tag.View VERBOSE',
                'setprop log.tag.ViewRootImpl VERBOSE',
                'setprop log.tag.ActivityManager VERBOSE',
            ];

            for (const cmd of loggingCommands) {
                await execAsync(`adb -s ${this.deviceId} shell ${cmd}`);
            }
            
            await this.driver.startActivity(
                'com.philo.philo',
                'com.philo.philo.app.activity.MainActivity',
                'com.philo.philo',
                'com.philo.philo.app.activity.MainActivity'
            );

            console.log('\nStarting to capture API traffic...');
            console.log('Please interact with the app. All API calls will be recorded.');
            console.log('Press Ctrl+C to stop capturing and save the logs.');
            
            await this.startContinuousLogging();

            // Run Postman tests after capturing API data
            await this.runPostmanTests();
        } catch (error) {
            console.error('Error during API capture:', error);
            throw error;
        }
    }

    private async startContinuousLogging() {
        this.isRunning = true;
        
        // Set up Ctrl+C handler
        process.on('SIGINT', async () => {
            console.log('\nReceived stop signal. Cleaning up...');
            await this.stopLogging();
            process.exit(0);
        });

        console.log('Starting continuous logging...');
        console.log('Log files will be saved in:', process.cwd() + '/src/logs');
        
        // Use direct adb logcat for better log capture with expanded tags
        const logcatProcess = spawn('adb', [
            '-s', this.deviceId,
            'logcat',
            '*:S',  // Suppress all tags by default
            'OkHttp:V',  // Network calls
            'okhttp3:V',
            'Retrofit:V',  // API calls
            'PhiloApp:V',  // App-specific logs
            'VideoPlayer:V',  // Video playback
            'WebView:V',  // WebView interactions
            'MediaPlayer:V',  // Media playback
            'ExoPlayer:V',  // Video player
            'System.out:V',
            'System.err:V',
            'ActivityManager:V',
            'HttpURLConnection:V',
            'chromium:V',
            'TcpSocket:V',
            'WebViewClient:V',
            'JavaBridge:V',
            'JS:V',  // JavaScript console logs
            'art:V',  // Runtime logs that might include API calls
            'InputDispatcher:V',  // Remote control presses
            'KeyEvent:V',  // Key presses
            'View:V',  // Button presses
            'ViewRootImpl:V',  // Focus changes
            'ActivityManager:V',  // Navigation events
        ]);

        this.logProcess = logcatProcess;
        console.log('Started logcat process with PID:', logcatProcess.pid);

        let buffer = '';
        logcatProcess.stdout.on('data', (data) => {
            buffer += data.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

            const networkLogs = lines.filter(line => {
                const lowerLine = line.toLowerCase();
                return (
                    // API and network related
                    lowerLine.includes('http') ||
                    lowerLine.includes('api') ||
                    lowerLine.includes('network') ||
                    lowerLine.includes('request') ||
                    lowerLine.includes('response') ||
                    lowerLine.includes('curl') ||
                    lowerLine.includes('okhttp') ||
                    // Playback related
                    lowerLine.includes('player') ||
                    lowerLine.includes('video') ||
                    lowerLine.includes('media') ||
                    lowerLine.includes('playback') ||
                    // Navigation related
                    lowerLine.includes('navigation') ||
                    lowerLine.includes('webview') ||
                    lowerLine.includes('activity') ||
                    // App specific
                    lowerLine.includes('philo') ||
                    lowerLine.includes('retrofit') ||
                    // General connection info
                    lowerLine.includes('socket') ||
                    lowerLine.includes('connection')
                );
            });

            if (networkLogs.length > 0) {
                const timestamp = new Date().toISOString();
                console.log(`[${timestamp}] Captured ${networkLogs.length} logs`);
                this.saveAPILogs(networkLogs.map(log => ({
                    timestamp: new Date().toISOString(),
                    message: log,
                    level: 'DEBUG'
                })));
            }
        });

        logcatProcess.stderr.on('data', (data) => {
            console.error('Logcat error:', data.toString());
        });

        logcatProcess.on('close', (code) => {
            console.log('Logcat process closed with code:', code);
        });

        // Keep the process running
        return new Promise(() => {});
    }

    private async simulateAppInteractions() {
        // Programmatically navigate through app
        await this.driver.navigateToHomeScreen();
        await this.driver.clickElement('browse_content');
        await this.driver.clickElement('first_recommended_show');
    }

    private async extractNetworkLogs(): Promise<any[]> {
        const logs = await this.driver.getLogs('network');
        return logs.filter((log: any) =>
            log.url.includes('/api/') &&
            (log.method === 'GET' || log.method === 'POST')
        );
    }

    private saveAPIData() {
        fs.writeFileSync(
            'api_logs.json',
            JSON.stringify(this.networkLogs, null, 2)
        );
    }

    async validateAPIData() {
        for (const log of this.networkLogs) {
            try {
                const response = await axiosInstance.get(log.url, {
                    headers: log.requestHeaders
                });

                console.log(`Validated: ${log.url}`);
            } catch (error) {
                console.error(`Validation failed: ${log.url}`, error);
            }
        }
    }

    async cleanup() {
        await this.driver.deleteSession();
    }

    private logApiCall(entry: any) {
        fs.readFile(this.logFilePath, (err, data) => {
            if (err) throw err;
            const logs = JSON.parse(data.toString() || '[]');
            logs.push(entry);
            fs.writeFile(this.logFilePath, JSON.stringify(logs, null, 2), (err) => {
                if (err) throw err;
            });
        });
    }

    async runPostmanTests() {
        return new Promise((resolve, reject) => {
            exec('newman run path/to/your/postman_collection.json', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error running Postman tests: ${error.message}`);
                    return reject(error);
                }
                if (stderr) {
                    console.error(`Postman test stderr: ${stderr}`);
                    return reject(stderr);
                }
                console.log(`Postman test stdout: ${stdout}`);
                resolve(stdout);
            });
        });
    }
}

// Execution script
async function runAPIExtraction() {
    const extractor = new AppiumAPIExtractor();

    try {
        await extractor.initializeAppium();
        await extractor.captureAPIData();
        await extractor.validateAPIData();
    } catch (error) {
        console.error('API Extraction Failed', error);
    } finally {
        await extractor.cleanup();
    }
}

runAPIExtraction();