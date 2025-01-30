import Vizio from 'vizio-smart-cast'; // Import the Vizio class

// Create an instance of the Vizio class
const vizio = new Vizio('10.0.0.131'); // Replace with your TV's IP address

async function sendKeyEvent(keyCode: number) {
    try {
        await vizio.control.sendKey(keyCode); // Use the vizio instance
        console.log(`Key event ${keyCode} sent.`);
    } catch (error) {
        console.error('Failed to send key event:', error);
    }
}

// Example usage
await sendKeyEvent(66); // Keycode 66 is for Enter
await sendKeyEvent(85); // Keycode 85 is for Play/Pause (if supported)
