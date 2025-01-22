import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get device IP from command line arguments or use default
const deviceIp = process.argv[2] || process.env.FIRE_TV_IP;

if (!deviceIp) {
    console.error('Error: No device IP provided. Please provide a device IP as an argument or set FIRE_TV_IP in .env');
    process.exit(1);
}

// Set the device IP in the environment
process.env.FIRE_TV_IP = deviceIp;

// Get the corresponding email based on the device IP
const email = deviceIp === '10.0.0.55' ? process.env.PHILO_EMAIL_2 : process.env.PHILO_EMAIL;
process.env.PHILO_EMAIL = email;

console.log(`Running tests for device ${deviceIp} with email ${email}`);

const testFiles = [
    'src/tests/login.test.ts',
    'src/tests/homescreen.test.ts',
    'src/tests/navigation.test.ts',
    'src/tests/landingPage.test.ts',
    'src/tests/playback.test.ts',
    'src/tests/seriesDetails.test.ts',
    'src/tests/moviesDetails.test.ts'
];

// Run each test file
testFiles.forEach(testFile => {
    try {
        console.log(`\nRunning ${testFile}...`);
        execSync(`NODE_OPTIONS=--experimental-vm-modules jest ${testFile}`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error running ${testFile}:`, error);
    }
});