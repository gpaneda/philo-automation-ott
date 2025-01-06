"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailHelper = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
class GmailHelper {
    static clickSignInLink() {
        throw new Error('Method not implemented.');
    }
    static getPhiloSignInLink() {
        throw new Error('Method not implemented.');
    }
    /**
     * Initialize Gmail API client
     */
    static async initializeGmailClient() {
        try {
            console.log('=== Starting Gmail Client Initialization ===');
            this.oauth2Client = new google_auth_library_1.OAuth2Client(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, process.env.GMAIL_REDIRECT_URI);
            this.oauth2Client.setCredentials({
                refresh_token: process.env.GMAIL_REFRESH_TOKEN
            });
            const profile = await this.gmail.users.getProfile({
                auth: this.oauth2Client,
                userId: 'me'
            });
            console.log('✅ Connected as:', profile.data.emailAddress);
        }
        catch (error) {
            console.error('❌ Gmail initialization failed:', error);
            throw error;
        }
    }
    /**
     * Process Philo sign-in email
     */
    static async processSignInEmail() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        try {
            console.log('\n=== Processing Philo Sign-in Email ===');
            await this.initializeGmailClient();
            // Get the most recent email
            const response = await this.gmail.users.messages.list({
                auth: this.oauth2Client,
                userId: 'me',
                maxResults: 1
            });
            if (!((_a = response.data.messages) === null || _a === void 0 ? void 0 : _a.length)) {
                console.log('❌ No emails found');
                return false;
            }
            const messageId = response.data.messages[0].id;
            if (!messageId) {
                console.log('❌ Invalid message ID');
                return false;
            }
            console.log('Found most recent email:', messageId);
            // Get email content
            const message = await this.gmail.users.messages.get({
                auth: this.oauth2Client,
                userId: 'me',
                id: messageId,
                format: 'full'
            });
            // Log email details
            const subject = ((_d = (_c = (_b = message.data.payload) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c.find(h => h.name === 'Subject')) === null || _d === void 0 ? void 0 : _d.value) || 'No Subject';
            const from = ((_g = (_f = (_e = message.data.payload) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f.find(h => h.name === 'From')) === null || _g === void 0 ? void 0 : _g.value) || 'No Sender';
            console.log('Email details:', { subject, from });
            // Extract email body
            const emailBody = ((_l = (_k = (_j = (_h = message.data.payload) === null || _h === void 0 ? void 0 : _h.parts) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.body) === null || _l === void 0 ? void 0 : _l.data) ||
                ((_o = (_m = message.data.payload) === null || _m === void 0 ? void 0 : _m.body) === null || _o === void 0 ? void 0 : _o.data);
            if (!emailBody) {
                console.log('❌ No email content found');
                console.log('Message payload structure:', JSON.stringify(message.data.payload, null, 2));
                return false;
            }
            const decodedBody = Buffer.from(emailBody, 'base64').toString();
            console.log('Email body preview:', decodedBody.substring(0, 200) + '...');
            // Find sign-in link using various patterns
            let signInLink = null;
            // Try to find link in href attribute
            const hrefMatch = decodedBody.match(/href="(https?:\/\/[^"]+)"/);
            if (hrefMatch) {
                signInLink = hrefMatch[1];
            }
            // If no href found, try to find raw URL
            if (!signInLink) {
                const urlMatch = decodedBody.match(/(https?:\/\/[^\s<>"]+)/);
                if (urlMatch) {
                    signInLink = urlMatch[1];
                }
            }
            if (!signInLink) {
                console.log('❌ No sign-in link found in email');
                return false;
            }
            console.log('✅ Found sign-in link:', signInLink);
            // Follow the sign-in link with axios configured to follow redirects
            console.log('Following sign-in link...');
            const axiosInstance = axios_1.default.create({
                maxRedirects: 5,
                validateStatus: (status) => status < 400
            });
            const response1 = await axiosInstance.get(signInLink);
            console.log('Response status:', response1.status);
            console.log('Final URL:', response1.request.res.responseUrl);
            // Look for the confirm button
            const confirmButtonMatch = response1.data.match(/<input[^>]*type="submit"[^>]*value="Confirm sign-in"[^>]*>/i);
            if (confirmButtonMatch) {
                console.log('Found confirm button:', confirmButtonMatch[0]);
                // Get the form action URL
                const formMatch = response1.data.match(/<form[^>]+action="([^"]+)"[^>]*>/i);
                if (formMatch) {
                    const formAction = formMatch[1];
                    console.log('Found form action:', formAction);
                    // Construct the full URL for the form action
                    const baseUrl = new URL(response1.request.res.responseUrl);
                    const confirmUrl = new URL(formAction, baseUrl).toString();
                    // Submit the form with the required fields
                    const formData = new URLSearchParams();
                    formData.append('commit', 'Confirm sign-in');
                    console.log('Submitting confirm form to:', confirmUrl);
                    const response2 = await axiosInstance.post(confirmUrl, formData);
                    console.log('Confirm response status:', response2.status);
                    console.log('Final URL after confirm:', response2.request.res.responseUrl);
                }
            }
            else {
                console.log('No confirm button found on page');
            }
            try {
                // Try to mark email as read
                await this.gmail.users.messages.modify({
                    auth: this.oauth2Client,
                    userId: 'me',
                    id: messageId,
                    requestBody: {
                        removeLabelIds: ['UNREAD']
                    }
                });
            }
            catch (error) {
                // Don't fail if we can't mark the email as read
                console.warn('⚠️ Could not mark email as read:', error.message);
            }
            console.log('✅ Successfully followed all links');
            return true;
        }
        catch (error) {
            console.error('❌ Error processing email:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response:', (_p = error.response) === null || _p === void 0 ? void 0 : _p.data);
            }
            return false;
        }
    }
    /**
     * Get Gmail client for testing
     */
    static getGmailClient() {
        return this.gmail;
    }
}
exports.GmailHelper = GmailHelper;
GmailHelper.gmail = googleapis_1.google.gmail('v1');
