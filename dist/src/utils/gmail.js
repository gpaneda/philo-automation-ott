"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
const googleapis_1 = require("googleapis");
class GmailService {
    constructor(email = process.env.PHILO_EMAIL) {
        this.currentEmail = email;
        const credentials = this.getGmailCredentials(email);
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(credentials.clientId, credentials.clientSecret, credentials.redirectUri);
        this.oauth2Client.setCredentials({
            refresh_token: credentials.refreshToken,
            access_token: credentials.accessToken,
        });
    }
    getGmailCredentials(email) {
        const isSecondDevice = email === process.env.PHILO_EMAIL_2;
        return {
            clientId: isSecondDevice ? process.env.GMAIL_2_CLIENT_ID : process.env.GMAIL_CLIENT_ID,
            clientSecret: isSecondDevice ? process.env.GMAIL_2_CLIENT_SECRET : process.env.GMAIL_CLIENT_SECRET,
            refreshToken: isSecondDevice ? process.env.GMAIL_2_REFRESH_TOKEN : process.env.GMAIL_REFRESH_TOKEN,
            accessToken: isSecondDevice ? process.env.GMAIL_2_ACCESS_TOKEN : process.env.GMAIL_ACCESS_TOKEN,
            redirectUri: isSecondDevice ? process.env.GMAIL_2_REDIRECT_URI : process.env.GMAIL_REDIRECT_URI
        };
    }
    async getPhiloVerificationCode() {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client });
        // Search for recent emails from Philo
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'from:no-reply@philo.com subject:"Verify your TV" newer_than:1d',
            maxResults: 1
        });
        if (!response.data.messages || response.data.messages.length === 0) {
            throw new Error('No verification email found');
        }
        // Get the latest email
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: response.data.messages[0].id
        });
        // Extract the verification link from email body
        const emailBody = Buffer.from(message.data.payload.body.data, 'base64').toString();
        const verificationLink = this.extractVerificationLink(emailBody);
        return verificationLink;
    }
    extractVerificationLink(emailBody) {
        const linkMatch = emailBody.match(/https:\/\/[^\s<>"]+/);
        if (!linkMatch) {
            throw new Error('Verification link not found in email');
        }
        return linkMatch[0];
    }
}
exports.GmailService = GmailService;
