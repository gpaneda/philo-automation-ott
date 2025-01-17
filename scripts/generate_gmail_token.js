const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
    process.argv[2], // Client ID
    process.argv[3], // Client Secret
    'urn:ietf:wg:oauth:2.0:oob' // Redirect URI for desktop apps
);

// Generate the authentication URL
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly']
});

console.log('Visit this URL to get the authorization code:');
console.log(authUrl);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get the authorization code from user input
rl.question('Enter the authorization code: ', async (code) => {
    try {
        // Exchange the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\nYour refresh token:');
        console.log(tokens.refresh_token);
        console.log('\nUpdate your .env file with these values:');
        console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    } catch (error) {
        console.error('Error getting tokens:', error);
    }
    rl.close();
}); 