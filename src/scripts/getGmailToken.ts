import { google } from 'googleapis';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('Using email:', process.env.PHILO_EMAIL);
console.log('Make sure you sign in with this email address in the next step!');

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

// Generate auth url
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
  ]
});

console.log('Authorize this app by visiting this url:', authUrl);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get the authorization code from the user
rl.question('Enter the code from that page here: ', async (code) => {
  try {
    // Get tokens using the code
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Your refresh token:', tokens.refresh_token);
    console.log('Your access token:', tokens.access_token);
  } catch (error) {
    console.error('Error getting tokens:', error);
  }
  rl.close();
}); 