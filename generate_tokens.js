const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_3_CLIENT_ID,
    process.env.GMAIL_3_CLIENT_SECRET,
    process.env.GMAIL_3_REDIRECT_URI
);

// Generate the URL for authorization
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    prompt: 'consent'  // This forces to generate a new refresh token
});

console.log('1. Visit this URL to authorize the application:');
console.log(authUrl);
console.log('\n2. After authorization, you will get a code. Enter it in the .env file');
console.log('\n3. Then run this script again with the code as an argument:');
console.log('   node generate_tokens.js <code>');

// If a code is provided as an argument, exchange it for tokens
if (process.argv[2]) {
    const code = process.argv[2];
    oauth2Client.getToken(code).then(({ tokens }) => {
        console.log('\nHere are your tokens:\n');
        console.log('GMAIL_3_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('GMAIL_3_ACCESS_TOKEN=' + tokens.access_token);
    }).catch(error => {
        console.error('Error getting tokens:', error);
    });
} 