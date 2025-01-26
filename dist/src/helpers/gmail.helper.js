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
    /**
     * Get Gmail credentials based on email
     */
    static getGmailCredentials(email) {
        // Use the appropriate credentials based on the email
        const isSecondDevice = email === process.env.PHILO_EMAIL_2;
        return {
            clientId: isSecondDevice ? process.env.GMAIL_2_CLIENT_ID : process.env.GMAIL_CLIENT_ID,
            clientSecret: isSecondDevice ? process.env.GMAIL_2_CLIENT_SECRET : process.env.GMAIL_CLIENT_SECRET,
            refreshToken: isSecondDevice ? process.env.GMAIL_2_REFRESH_TOKEN : process.env.GMAIL_REFRESH_TOKEN,
            redirectUri: isSecondDevice ? process.env.GMAIL_2_REDIRECT_URI : process.env.GMAIL_REDIRECT_URI
        };
    }
    /**
     * Initialize Gmail API client and configure axios instance
     */
    static async initializeGmailClient(email = process.env.PHILO_EMAIL) {
        try {
            console.log('=== Starting Gmail Client Initialization ===');
            console.log('Initializing for email:', email);
            const credentials = this.getGmailCredentials(email);
            this.currentEmail = email;
            this.oauth2Client = new google_auth_library_1.OAuth2Client(credentials.clientId, credentials.clientSecret, credentials.redirectUri);
            this.oauth2Client.setCredentials({
                refresh_token: credentials.refreshToken
            });
            // Configure axios instance with proper headers and settings
            this.axiosInstance = axios_1.default.create({
                maxRedirects: 5,
                validateStatus: (status) => status < 400,
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                withCredentials: true
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
     * Extract all form fields from HTML
     */
    static extractFormFields(html) {
        const formData = new URLSearchParams();
        const formFields = html.match(/<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"[^>]*>/g);
        formFields === null || formFields === void 0 ? void 0 : formFields.forEach(field => {
            const nameMatch = field.match(/name="([^"]+)"/);
            const valueMatch = field.match(/value="([^"]*)"/);
            if (nameMatch && valueMatch) {
                formData.append(nameMatch[1], valueMatch[1]);
            }
        });
        return formData;
    }
    /**
     * Extract CSRF token from HTML
     */
    static extractCSRFToken(html) {
        const csrfMatch = html.match(/<meta[^>]+name="csrf-token"[^>]+content="([^"]+)"[^>]*>/);
        return csrfMatch ? csrfMatch[1] : null;
    }
    /**
     * Process Philo sign-in email and follow through the complete sign-in flow
     */
    static async processSignInEmail(email) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        try {
            console.log('\n=== Processing Philo Sign-in Email ===');
            await this.initializeGmailClient(email);
            // Try different search queries
            const queries = [
                'from:(help OR noreply OR no-reply)@philo.com subject:sign newer_than:24h',
                'from:(help OR noreply OR no-reply)@philo.com subject:"Sign in"',
                'from:(help OR noreply OR no-reply)@philo.com'
            ];
            // Try up to 3 times with increasing wait times
            for (let attempt = 1; attempt <= 3; attempt++) {
                console.log(`\nAttempt ${attempt} to find sign-in email...`);
                // Try each query
                let foundEmail = false;
                for (const query of queries) {
                    console.log(`\nTrying search query: ${query}`);
                    const response = await this.gmail.users.messages.list({
                        auth: this.oauth2Client,
                        userId: 'me',
                        maxResults: 10,
                        q: query
                    });
                    if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.length)) {
                        console.log('No emails found with this query');
                        continue;
                    }
                    // Found emails - get the most recent one
                    const messageId = response.data.messages[0].id;
                    if (!messageId) {
                        console.log('❌ Invalid message ID');
                        continue;
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
                    const subject = ((_e = (_d = (_c = message.data.payload) === null || _c === void 0 ? void 0 : _c.headers) === null || _d === void 0 ? void 0 : _d.find(h => h.name === 'Subject')) === null || _e === void 0 ? void 0 : _e.value) || 'No Subject';
                    const from = ((_h = (_g = (_f = message.data.payload) === null || _f === void 0 ? void 0 : _f.headers) === null || _g === void 0 ? void 0 : _g.find(h => h.name === 'From')) === null || _h === void 0 ? void 0 : _h.value) || 'No Sender';
                    const date = ((_l = (_k = (_j = message.data.payload) === null || _j === void 0 ? void 0 : _j.headers) === null || _k === void 0 ? void 0 : _k.find(h => h.name === 'Date')) === null || _l === void 0 ? void 0 : _l.value) || 'No Date';
                    console.log('Email details:', { subject, from, date });
                    // Extract email body
                    const emailBody = ((_q = (_p = (_o = (_m = message.data.payload) === null || _m === void 0 ? void 0 : _m.parts) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.body) === null || _q === void 0 ? void 0 : _q.data) ||
                        ((_s = (_r = message.data.payload) === null || _r === void 0 ? void 0 : _r.body) === null || _s === void 0 ? void 0 : _s.data);
                    if (!emailBody) {
                        console.log('❌ No email content found');
                        console.log('Message payload structure:', JSON.stringify(message.data.payload, null, 2));
                        continue;
                    }
                    const decodedBody = Buffer.from(emailBody, 'base64').toString();
                    console.log('Email body preview:', decodedBody.substring(0, 200) + '...');
                    // Find sign-in link using various patterns
                    let signInLink = this.extractSignInLink(decodedBody);
                    if (!signInLink) {
                        console.log('❌ No sign-in link found in email');
                        continue;
                    }
                    console.log('✅ Found sign-in link:', signInLink);
                    foundEmail = true;
                    // Process the sign-in link
                    if (await this.processSignInLink(signInLink, messageId)) {
                        return true;
                    }
                }
                if (!foundEmail && attempt < 3) {
                    const waitTime = attempt * 15000; // 15s, 30s, 45s
                    console.log(`\nWaiting ${waitTime / 1000} seconds before next attempt...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
            console.log('❌ No valid sign-in emails found after all attempts');
            return false;
        }
        catch (error) {
            console.error('❌ Error processing email:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response:', (_t = error.response) === null || _t === void 0 ? void 0 : _t.data);
            }
            return false;
        }
    }
    /**
     * Process the sign-in link and complete the sign-in flow
     */
    static async processSignInLink(signInLink, messageId) {
        try {
            // Step 1: Follow the initial sign-in link
            console.log('Following sign-in link...');
            const response1 = await this.axiosInstance.get(signInLink);
            console.log('Initial response status:', response1.status);
            console.log('Initial URL:', response1.request.res.responseUrl);
            // Extract CSRF token if present
            const csrfToken = this.extractCSRFToken(response1.data);
            if (csrfToken) {
                this.axiosInstance.defaults.headers['X-CSRF-Token'] = csrfToken;
            }
            // Look for the confirm button and form, avoiding the "No" button
            console.log('Page HTML:', response1.data);
            const forms = response1.data.match(/<form[^>]+action="([^"]+)"[^>]*>[\s\S]*?<\/form>/g);
            if (!forms || forms.length < 2) {
                console.log('❌ Could not find both forms on the page');
                return false;
            }
            // Get the first form (should be the confirm form)
            const confirmForm = forms[0];
            const formActionMatch = confirmForm.match(/<form[^>]+action="([^"]+)"[^>]*>/);
            const submitButtonMatch = confirmForm.match(/<input[^>]*type="submit"[^>]*>/i);
            if (submitButtonMatch && formActionMatch) {
                console.log('Found submit button:', submitButtonMatch[0]);
                const formAction = formActionMatch[1];
                console.log('Found form action:', formAction);
                // Construct the full URL for the form action
                const baseUrl = new URL(response1.request.res.responseUrl);
                const confirmUrl = new URL(formAction, baseUrl).toString();
                // Extract and prepare all form fields from the confirm form
                const formData = this.extractFormFields(confirmForm);
                // Get the value from the confirm button
                const buttonValueMatch = submitButtonMatch[0].match(/value="([^"]+)"/i);
                const buttonValue = buttonValueMatch ? buttonValueMatch[1] : 'Submit';
                formData.append('commit', buttonValue);
                // Step 2: Submit the confirmation form
                console.log('Submitting confirm form to:', confirmUrl);
                const response2 = await this.axiosInstance.post(confirmUrl, formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin': baseUrl.origin,
                        'Referer': response1.request.res.responseUrl
                    }
                });
                console.log('Confirm response status:', response2.status);
                console.log('Final URL after confirm:', response2.request.res.responseUrl);
                // Step 3: Verify the sign-in was successful
                if (response2.status < 400) {
                    console.log('✅ Successfully submitted confirmation form');
                }
                else {
                    console.log('❌ Failed to submit confirmation form');
                    return false;
                }
            }
            else {
                console.log('❌ No submit button or form found on page');
                return false;
            }
            try {
                // Mark email as read
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
                console.warn('⚠️ Could not mark email as read:', error.message);
            }
            console.log('✅ Successfully completed sign-in flow');
            return true;
        }
        catch (error) {
            console.error('❌ Error processing sign-in link:', error);
            return false;
        }
    }
    /**
     * Extract sign-in link from email body
     */
    static extractSignInLink(decodedBody) {
        // Try to find link in href attribute
        const hrefMatch = decodedBody.match(/href="(https?:\/\/[^"]+philo[^"]+)"/i);
        if (hrefMatch) {
            return hrefMatch[1];
        }
        // Try to find raw URL
        const urlMatch = decodedBody.match(/(https?:\/\/[^\s<>"]+philo[^\s<>"]+)/i);
        if (urlMatch) {
            return urlMatch[1];
        }
        return null;
    }
    /**
     * Search for Philo sign-in emails
     */
    static async searchPhiloEmails() {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            console.log('\n=== Searching for Philo Sign-in Emails ===');
            await this.initializeGmailClient();
            // Try different search queries
            const queries = [
                'from:(help OR noreply OR no-reply)@philo.com subject:sign newer_than:24h',
                'from:(help OR noreply OR no-reply)@philo.com subject:"Sign in"',
                'from:(help OR noreply OR no-reply)@philo.com'
            ];
            for (const query of queries) {
                console.log(`\nTrying search query: ${query}`);
                const response = await this.gmail.users.messages.list({
                    auth: this.oauth2Client,
                    userId: 'me',
                    maxResults: 10,
                    q: query
                });
                if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.length)) {
                    console.log('No emails found with this query');
                    continue;
                }
                const messages = response.data.messages;
                console.log(`Found ${messages.length} emails:`);
                // Get details for each email
                for (const msg of messages) {
                    if (!msg.id)
                        continue;
                    const message = await this.gmail.users.messages.get({
                        auth: this.oauth2Client,
                        userId: 'me',
                        id: msg.id
                    });
                    const headers = ((_d = (_c = message.data) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.headers) || [];
                    const subject = ((_e = headers.find(h => h.name === 'Subject')) === null || _e === void 0 ? void 0 : _e.value) || 'No Subject';
                    const from = ((_f = headers.find(h => h.name === 'From')) === null || _f === void 0 ? void 0 : _f.value) || 'No Sender';
                    const date = ((_g = headers.find(h => h.name === 'Date')) === null || _g === void 0 ? void 0 : _g.value) || 'No Date';
                    console.log(`\nEmail ID: ${msg.id}`);
                    console.log(`From: ${from}`);
                    console.log(`Subject: ${subject}`);
                    console.log(`Date: ${date}`);
                }
                // Found emails with this query, no need to try others
                return;
            }
            console.log('\n❌ No Philo emails found with any query');
        }
        catch (error) {
            console.error('❌ Error searching for emails:', error);
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
