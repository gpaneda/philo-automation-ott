"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Get device IP from command line arguments or use default
const deviceIp = process.argv[2] || process.env.FIRE_TV_IP;
if (!deviceIp) {
    console.error('Error: No device IP provided. Please provide a device IP as an argument or set FIRE_TV_IP in .env');
    process.exit(1);
}
// Set the device IP in the environment
process.env.FIRE_TV_IP = deviceIp;
// Get the corresponding email based on the device IP
let email;

switch (deviceIp) {
    case '10.0.0.55':
        email = process.env.PHILO_EMAIL_2;
        break;
    case '10.0.0.130':
        email = process.env.PHILO_EMAIL_3; // New device
        break;
    case '10.0.0.98':
        email = process.env.PHILO_EMAIL; // Default email
        break;
    default:
        email = process.env.PHILO_EMAIL; // Fallback to default
}

console.log(`Device IP: ${deviceIp}, Selected Email: ${email}`);

const testFiles =  { }
    'src/tests/login.test.ts',
    'src/tests/homescreen.test.ts',
    'src/tests/navigation.test.ts',
    'src/tests/landingPage.test.ts',
    'src/tests/playback.test.ts',
    'src/tests/seriesDetails.test.ts',
    'src/tests/moviesDetails.test.ts',
    'src/tests/search.test.ts',

// Run each test file
testFiles.forEach(testFile => {
    try {
        console.log(`\nRunning ${testFile}...`);
        (0, child_process_1.execSync)(`NODE_OPTIONS=--experimental-vm-modules jest ${testFile}`, { stdio: 'inherit' });
    }
    catch (error) {
        console.error(`Error running ${testFile}:`, error);
    }
});

process.env.PHILO_EMAIL = email;
console.log(`Running tests for device ${deviceIp} with email ${email}`);