import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

// MAC address prefixes for different device types
const MAC_PREFIXES: { [key: string]: { type: string; model?: string } } = {
    // Fire TV devices
    'F0:F0:A4': { type: 'Fire TV', model: 'Fire TV Stick 4K' },
    'F0:27:2D': { type: 'Fire TV', model: 'Fire TV Stick 2nd Gen' },
    '74:C2:46': { type: 'Fire TV', model: 'Fire TV Cube 2nd Gen' },
    'AC:41:6A': { type: 'Fire TV', model: 'Fire TV Stick 3rd Gen' },
    'BC:DF:58': { type: 'Fire TV', model: 'Fire TV Stick 4K Max' },
    '0C:47:C9': { type: 'Fire TV', model: 'Fire TV Cube 3rd Gen' },
    '40:B8:9A': { type: 'Fire TV', model: 'Fire TV Stick Lite' },
    
    // Android TV devices
    '00:B0:7D': { type: 'Android TV', model: 'NVIDIA Shield TV' },
    '7C:76:35': { type: 'Android TV', model: 'Chromecast with Google TV' },
    '48:C7:96': { type: 'Android TV', model: 'Android TV Box' },
    
    // Vizio TVs
    '00:0C:56': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '00:24:2F': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '00:9D:6B': { type: 'Vizio TV', model: 'M50QXM-K01' },
    'C4:48:38': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '8C:DE:52': { type: 'Vizio TV', model: 'M50QXM-K01' },
    'A4:7E:39': { type: 'Vizio TV', model: 'M50QXM-K01' },
    'D8:EB:97': { type: 'Vizio TV', model: 'M50QXM-K01' },
    'CC:95:D7': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '00:24:23': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '00:1C:62': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '00:26:B4': { type: 'Vizio TV', model: 'M50QXM-K01' },
    '84:C9:B2': { type: 'Vizio TV', model: 'M50QXM-K01' },
    
    // LG TVs
    '00:05:C9': { type: 'LG TV', model: 'LG Smart TV' },
    'C8:08:E9': { type: 'LG TV', model: 'LG Smart TV' },
    'C4:36:6C': { type: 'LG TV', model: 'LG Smart TV' },
    
    // Samsung TVs
    '8C:71:F8': { type: 'Samsung TV', model: 'QN43Q60AAFXZA' },
    '84:25:DB': { type: 'Samsung TV', model: 'QN43Q60AAFXZA' },
    '68:27:37': { type: 'Samsung TV', model: 'QN43Q60AAFXZA' }
};

// Common ports used by smart TVs
const SMART_TV_PORTS = {
    vizio: [
        7345,  // Vizio SmartCast
        3000,  // Vizio API
        9000,  // Vizio API (alternate)
        7000,  // Vizio SmartCast (alternate)
        9080   // Vizio HTTP
    ],
    samsung: [
        8001,  // Samsung Smart TV
        8002,  // Samsung Smart TV
        8080,  // Samsung Web Server
        9197,  // Samsung Remote
        55000  // Samsung Remote
    ],
    lg: [
        8080,  // LG WebOS
        3000,  // LG WebOS
        3001,  // LG WebOS
        8090   // LG WebOS Services
    ],
    firetv: [
        5555,  // Fire TV ADB
        5556,  // Fire TV ADB
        8888,  // Fire TV Debug
        8889,  // Fire TV Debug
        9000,  // Fire TV Services
        19000  // Fire TV Discovery
    ],
    androidtv: [
        5555,  // Android TV ADB
        5556,  // Android TV ADB
        8888,  // Android TV Debug
        8889,  // Android TV Debug
        9000,  // Android TV Services
        19000  // Android TV Discovery
    ],
    common: [
        8008,  // Google Cast
        8009,  // Google Cast
        56789, // Smart TV services
    ]
};

interface DeviceInfo {
    ip: string;
    mac?: string;
    deviceType: string;
    model?: string;
    isConnected: boolean;
    lastSeen?: string;
}

interface DeviceConfig {
    devices: DeviceInfo[];
    lastScan: string;
    networkSubnet: string;
}

export class NetworkHelper {
    private static readonly CONFIG_FILE = 'device-config.json';
    private static readonly CONFIG_DIR = 'config';
    private static readonly BATCH_SIZE = 10; // Number of concurrent operations

    /**
     * Get device type based on MAC address prefix
     */
    private static getDeviceType(mac: string): { type: string; model?: string } | undefined {
        const prefix = mac.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6).toUpperCase();
        return MAC_PREFIXES[prefix];
    }

    /**
     * Check if a device is accessible on the network using ping
     */
    static async checkDeviceConnectivity(ip: string): Promise<boolean> {
        try {
            // Faster ping with shorter timeout
            const { stdout } = await execAsync(`ping -c 1 -W 1 ${ip}`);
            return stdout.includes('1 packets transmitted') && stdout.includes('received');
        } catch {
            return false;
        }
    }

    /**
     * Check if a device has smart TV ports open
     */
    private static async checkSmartTVPorts(ip: string): Promise<{ isSmartTV: boolean; deviceType?: string; model?: string }> {
        try {
            console.log(`\nChecking smart TV ports for ${ip}...`);
            
            // Set a timeout for the entire port check
            const timeout = new Promise<{ isSmartTV: boolean }>((resolve) => {
                setTimeout(() => resolve({ isSmartTV: false }), 3000); // 3 second timeout
            });

            const portCheck = new Promise<{ isSmartTV: boolean; deviceType?: string; model?: string }>(async (resolve) => {
                // Check Vizio ports first (since we know about the Vizio TV)
                for (const port of SMART_TV_PORTS.vizio) {
                    try {
                        await execAsync(`nc -z -w1 ${ip} ${port}`);
                        return resolve({ 
                            isSmartTV: true, 
                            deviceType: 'Vizio TV',
                            model: 'M50QXM-K01' // Default Vizio model
                        });
                    } catch {
                        continue;
                    }
                }

                // Check Fire TV ports
                for (const port of SMART_TV_PORTS.firetv) {
                    try {
                        await execAsync(`nc -z -w1 ${ip} ${port}`);
                        return resolve({ 
                            isSmartTV: true, 
                            deviceType: 'Fire TV',
                            model: 'Fire TV Stick 4K' // Default Fire TV model
                        });
                    } catch {
                        continue;
                    }
                }

                // Check Android TV ports
                for (const port of SMART_TV_PORTS.androidtv) {
                    try {
                        await execAsync(`nc -z -w1 ${ip} ${port}`);
                        return resolve({ 
                            isSmartTV: true, 
                            deviceType: 'Android TV',
                            model: 'NVIDIA Shield TV' // Default Android TV model
                        });
                    } catch {
                        continue;
                    }
                }

                // Only check other ports if previous checks failed
                const allPorts = [
                    ...SMART_TV_PORTS.samsung,
                    ...SMART_TV_PORTS.lg,
                    ...SMART_TV_PORTS.common
                ];

                // Check all ports concurrently
                const portPromises = allPorts.map(port => 
                    execAsync(`nc -z -w1 ${ip} ${port}`)
                        .then(() => ({ port, success: true }))
                        .catch(() => ({ port, success: false }))
                );

                const results = await Promise.all(portPromises);
                const openPorts = results.filter(r => r.success).map(r => r.port);

                if (openPorts.length > 0) {
                    // Determine device type based on open ports
                    if (openPorts.some(port => SMART_TV_PORTS.samsung.includes(port))) {
                        return resolve({ 
                            isSmartTV: true, 
                            deviceType: 'Samsung TV',
                            model: 'QN43Q60AAFXZA' // Default Samsung model
                        });
                    } else if (openPorts.some(port => SMART_TV_PORTS.lg.includes(port))) {
                        return resolve({ 
                            isSmartTV: true, 
                            deviceType: 'LG TV',
                            model: 'LG Smart TV' // Default LG model
                        });
                    } else {
                        return resolve({ 
                            isSmartTV: true, 
                            deviceType: 'Smart TV',
                            model: 'Generic Smart TV'
                        });
                    }
                }

                resolve({ isSmartTV: false });
            });

            // Race between the port check and timeout
            return Promise.race([portCheck, timeout]);
        } catch {
            return { isSmartTV: false };
        }
    }

    /**
     * Get device information using arp and additional checks
     */
    private static async getDeviceInfo(ip: string): Promise<DeviceInfo | null> {
        try {
            console.log(`\nGetting device info for ${ip}...`);
            
            // Set a timeout for the entire device check
            const timeout = new Promise<null>((resolve) => {
                setTimeout(() => resolve(null), 5000); // 5 second timeout
            });

            const deviceCheck = new Promise<DeviceInfo | null>(async (resolve) => {
                const { stdout } = await execAsync(`arp -n ${ip}`);
                const macMatch = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
                const mac = macMatch ? macMatch[0] : undefined;
                let deviceInfo = mac ? this.getDeviceType(mac) : undefined;
                
                console.log(`  MAC: ${mac || 'Not found'}`);
                console.log(`  Initial device type: ${deviceInfo?.type || 'Unknown'}`);
                
                const isConnected = await this.checkDeviceConnectivity(ip);
                
                // If no device type was found but device is responding, check for smart TV ports
                if (!deviceInfo && isConnected) {
                    console.log('  Device is responding, checking for smart TV ports...');
                    const portCheck = await this.checkSmartTVPorts(ip);
                    if (portCheck.isSmartTV) {
                        deviceInfo = { 
                            type: portCheck.deviceType || 'Smart TV',
                            model: portCheck.model
                        };
                        console.log(`  ✓ Device identified as ${deviceInfo.type} (${deviceInfo.model})`);
                    } else {
                        console.log('  ✗ Device is not a Smart TV');
                    }
                }
                
                console.log(`  Connection status: ${isConnected ? 'Connected' : 'Not Connected'}`);
                
                resolve({ 
                    ip, 
                    mac, 
                    deviceType: deviceInfo?.type || '', 
                    model: deviceInfo?.model, 
                    isConnected 
                });
            });

            // Race between the device check and timeout
            return Promise.race([deviceCheck, timeout]);
        } catch (error) {
            console.log(`  Error getting device info: ${error}`);
            return null;
        }
    }

    /**
     * Get the local network interface and subnet
     */
    private static async getLocalNetwork(): Promise<{interface: string, subnet: string}> {
        try {
            // Try ipconfig first (faster on macOS)
            try {
                const { stdout } = await execAsync('ipconfig getifaddr en0');
                const ip = stdout.trim();
                const subnet = ip.split('.').slice(0, 3).join('.') + '.0/24';
                return {
                    interface: 'en0',
                    subnet
                };
            } catch {
                // Fallback to ifconfig
                const { stdout } = await execAsync('ifconfig | grep "inet " | grep -v 127.0.0.1');
                const lines = stdout.split('\n');
                for (const line of lines) {
                    const match = line.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);
                    if (match) {
                        const ip = match[1];
                        const subnet = ip.split('.').slice(0, 3).join('.') + '.0/24';
                        const interfaceMatch = line.match(/^(\w+)/);
                        return {
                            interface: interfaceMatch ? interfaceMatch[1] : 'en0',
                            subnet
                        };
                    }
                }
            }
            throw new Error('Could not determine network interface');
        } catch (error) {
            console.error('Error getting local network:', error);
            throw error;
        }
    }

    /**
     * Process devices in batches
     */
    private static async processBatch(devices: DeviceInfo[]): Promise<DeviceInfo[]> {
        const results = await Promise.all(
            devices.map(async device => {
                if (!device.isConnected) {
                    device.isConnected = await this.checkDeviceConnectivity(device.ip);
                }
                return device;
            })
        );
        return results;
    }

    /**
     * Scan the local network for devices
     */
    static async scanLocalNetwork(): Promise<Array<DeviceInfo>> {
        try {
            const { subnet } = await this.getLocalNetwork();
            const devices = new Map<string, DeviceInfo>();
            const baseIP = subnet.split('.').slice(0, 3).join('.');
            
            console.log('Scanning network for Fire TV, Android TV, Vizio, LG TV, and Samsung devices...');

            // Check known device IPs first
            const knownIPs = [
                '10.0.0.63',  // Known Vizio TV
                '10.0.0.46',  // Previous Fire TV
                '10.0.0.15',  // Previous device
                '10.0.0.10'   // Previous device
            ];

            for (const ip of knownIPs) {
                console.log(`\nChecking known device at ${ip}...`);
                const deviceInfo = await this.getDeviceInfo(ip);
                if (deviceInfo) {
                    devices.set(ip, deviceInfo);
                }
            }

            // Get initial device list from ARP table (fast)
            const { stdout: arpStdout } = await execAsync('arp -a');
            const arpLines = arpStdout.split('\n');
            
            for (const line of arpLines) {
                const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)/);
                const macMatch = line.match(/at ([0-9a-fA-F:]+)/);
                
                if (ipMatch && macMatch) {
                    const ip = ipMatch[1];
                    const mac = macMatch[1];
                    
                    // Skip if we already checked this IP
                    if (devices.has(ip)) continue;
                    
                    const deviceInfo = this.getDeviceType(mac);
                    
                    if (ip.startsWith(baseIP)) {
                        if (deviceInfo) {
                            devices.set(ip, { 
                                ip, 
                                mac, 
                                deviceType: deviceInfo.type,
                                model: deviceInfo.model,
                                isConnected: false 
                            });
                        } else {
                            // For unknown devices, check if they respond to smart TV ports
                            const portCheck = await this.checkSmartTVPorts(ip);
                            if (portCheck.isSmartTV) {
                                devices.set(ip, {
                                    ip,
                                    mac,
                                    deviceType: portCheck.deviceType || 'Smart TV',
                                    isConnected: false
                                });
                            }
                        }
                    }
                }
            }

            // Process devices in batches to check connectivity
            const deviceArray = Array.from(devices.values());
            const batches = [];
            for (let i = 0; i < deviceArray.length; i += this.BATCH_SIZE) {
                batches.push(deviceArray.slice(i, i + this.BATCH_SIZE));
            }

            const processedDevices = [];
            for (const batch of batches) {
                const results = await this.processBatch(batch);
                processedDevices.push(...results);
            }

            return processedDevices.filter(device => device.isConnected || device.deviceType);
        } catch (error) {
            console.error('Error scanning local network:', error);
            return [];
        }
    }

    /**
     * Get the full path to the configuration file
     */
    private static getConfigPath(): string {
        const configDir = path.join(process.cwd(), this.CONFIG_DIR);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        return path.join(configDir, this.CONFIG_FILE);
    }

    /**
     * Save device information to configuration file
     * @param devices Array of device information
     */
    private static async saveDeviceConfig(devices: DeviceInfo[], subnet: string): Promise<void> {
        try {
            const config: DeviceConfig = {
                devices: devices.map(device => ({
                    ...device,
                    lastSeen: new Date().toISOString()
                })),
                lastScan: new Date().toISOString(),
                networkSubnet: subnet
            };

            const configPath = this.getConfigPath();
            await writeFileAsync(configPath, JSON.stringify(config, null, 2));
            console.log(`\nDevice configuration saved to: ${configPath}`);
        } catch (error) {
            console.error('Error saving device configuration:', error);
        }
    }

    /**
     * Load device information from configuration file
     * @returns Promise<DeviceConfig | null>
     */
    static async loadDeviceConfig(): Promise<DeviceConfig | null> {
        try {
            const configPath = this.getConfigPath();
            if (!fs.existsSync(configPath)) {
                return null;
            }

            const configData = await readFileAsync(configPath, 'utf8');
            return JSON.parse(configData) as DeviceConfig;
        } catch (error) {
            console.error('Error loading device configuration:', error);
            return null;
        }
    }

    /**
     * Scan and log all devices on the network, saving results to config file
     */
    static async scanAndLogDevices(): Promise<void> {
        console.log('\n=== Network Device Scan ===');
        
        // Load existing configuration
        const existingConfig = await this.loadDeviceConfig();
        if (existingConfig) {
            console.log(`\nLast scan performed: ${existingConfig.lastScan}`);
            console.log(`Previous network subnet: ${existingConfig.networkSubnet}`);
        }

        // Get network information
        const { subnet } = await this.getLocalNetwork();
        
        // Scan local network
        const devices = await this.scanLocalNetwork();
        
        if (devices.length === 0) {
            console.log('No devices found on the network');
            return;
        }

        console.log(`\nFound ${devices.length} device(s):`);
        
        // Get and log info for each device
        for (const device of devices) {
            this.displayDeviceInfo(device);

            // If device exists in previous config, show when it was last seen
            if (existingConfig) {
                const existingDevice = existingConfig.devices.find(d => d.mac === device.mac);
                if (existingDevice?.lastSeen) {
                    console.log(`Last seen: ${existingDevice.lastSeen}`);
                }
            }
        }

        // Save updated device information
        await this.saveDeviceConfig(devices, subnet);
    }

    /**
     * Display device information
     */
    private static displayDeviceInfo(device: DeviceInfo): void {
        console.log('\nDevice Information:');
        console.log(`IP: ${device.ip}`);
        if (device.mac) console.log(`MAC: ${device.mac}`);
        console.log(`Device Type: ${device.deviceType}`);
        if (device.model) console.log(`Model: ${device.model}`);
        console.log(`Network Status: ${device.isConnected ? 'Connected' : 'Not Connected'}`);
        if (device.lastSeen) console.log(`Last seen: ${device.lastSeen}`);
    }
}

// Add this at the end of the file
if (require.main === module) {
    NetworkHelper.scanAndLogDevices()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Error running network scan:', error);
            process.exit(1);
        });
}