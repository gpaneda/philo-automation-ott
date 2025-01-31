import Vizio from 'vizio-smart-cast';

// Create an instance of the Vizio class
const vizio = new Vizio('10.0.0.131');

// Function to open the Philo app
//async function openPhiloApp() {
//    try {
//        console.log('Opening Philo app...');
//        const appId = 'com.philo.philo.vizio'; // Replace with the actual app ID for Philo
//        const response = await vizio.launchApp(appId);
//        console.log('Philo app opened:', response);
//    } catch (error) {
//        console.error('Failed to open Philo app:', error);
//    }
//}

// Function to initiate pairing
async function initiatePairing() {
    try {
        console.log('Initiating pairing...');
        const response = await vizio.pairing.initiate();
        console.log('Pairing initiated:', response);

        // Wait for a few seconds to allow the user to see the PIN
        await new Promise(resolve => setTimeout(resolve, 10000)); // Adjust the time as needed

        // Step 2: Enter the PIN displayed on the TV
        const pairingPin = '5639'; // Replace with the actual PIN shown on the TV
        const pairResponse = await vizio.pairing.pair(pairingPin);
        console.log('Successfully paired with the TV:', pairResponse);
    } catch (error) {
        console.error('Failed to pair with the TV:', error);
    }
}

// Start the pairing process and then open the Philo app
//async function initiatePairingAndOpenApp() {
//    try {
//        console.log('Initiating pairing...');
//        const response = await vizio.pairing.initiate();
//        console.log('Pairing initiated:', response);

//        // Wait for a few seconds to allow the user to see the PIN
//        await new Promise(resolve => setTimeout(resolve, 10000)); // Adjust the time as needed

//        // Enter the PIN displayed on the TV
//        const pairingPin = '<YOUR_PAIRING_PIN>'; // Replace with the actual PIN shown on the TV
//        const pairResponse = await vizio.pairing.pair(pairingPin);
//        console.log('Successfully paired with the TV:', pairResponse);

//        // Now you can check if you can launch the app
//        await openPhiloApp();
//    } catch (error) {
//        console.error('Failed to pair with the TV or open Philo app:', error);
//    }
//}

// Start the process
initiatePairing();

// Example: Power on the TV
vizio.control.power.on()
    .then((response) => {
        console.log('Power on response:', response);
    })
    .catch((error) => {
        console.error('Failed to power on:', error);
    });

// Example: Change input to HDMI 1
vizio.input.set('HDMI-1')
    .then((response) => {
        console.log('Input changed to HDMI 1:', response);
    })
    .catch((error) => {
        console.error('Failed to change input:', error);
    });