"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
const googleapis_1 = require("googleapis");
class GmailService {
    constructor() {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob');
        this.oauth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            access_token: process.env.GMAIL_ACCESS_TOKEN,
        });
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
        // Implement regex or parsing logic to extract the verification link
        const linkRegex = /https:\/\/philo.com\/verify\/[\w-]+/;
        const match = emailBody.match(linkRegex);
        if (!match) {
            throw new Error('Verification link not found in email');
        }
        return match[0];
    }
}
exports.GmailService = GmailService;
