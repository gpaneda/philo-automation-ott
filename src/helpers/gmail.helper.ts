import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios, { AxiosInstance } from 'axios';
import open from 'open';

export class GmailHelper {
    private static oauth2Client: OAuth2Client;
    private static gmail = google.gmail('v1');
    private static axiosInstance: AxiosInstance;
    private static currentEmail: string;
    /**
     * Initialize Gmail client with the appropriate credentials.
     * @param deviceIp - The IP address of the device (optional).
     * @param email - The email address to use (optional).
     */
   

    public static async initializeGmailClient(deviceIp: string, email?: string): Promise<void> {
        try {
            console.log('Device IP received:', deviceIp);
            // If email is not provided, determine it based on the device IP
            let selectedEmail = email || process.env.PHILO_EMAIL;
            if (!selectedEmail) {
                const androidTvIp = process.env.ANDROID_TV_IP || '';
                const fireTvIp = process.env.FIRE_TV_IP || '';
                
                console.log('Comparing device IPs:');
                console.log('Current device IP:', deviceIp);
                console.log('Fire TV IP:', fireTvIp);
                console.log('Android TV IP:', androidTvIp);
                
                switch (deviceIp) {
                    case androidTvIp:
                        console.log('Matched Android TV IP');
                        selectedEmail = process.env.PHILO_EMAIL_3 || ''; // Use the third device's email
                        break;
                    case fireTvIp:
                        console.log('Matched Fire TV IP');
                        selectedEmail = process.env.PHILO_EMAIL || ''; // Use the first device's email
                        break;
                    default:
                        console.log('No IP match, using default email');
                        selectedEmail = process.env.PHILO_EMAIL || ''; // Default to the first device's email
                        break;
                }
            }

            if (!selectedEmail) {
                throw new Error('No email address configured for device');
            }

            console.log('=== Starting Gmail Client Initialization ===');
            console.log('Initializing for email:', selectedEmail);
            
            const credentials = this.getGmailCredentials(selectedEmail);
            this.currentEmail = selectedEmail;
            
            this.oauth2Client = new OAuth2Client(
                credentials.clientId,
                credentials.clientSecret,
                credentials.redirectUri
            );
            
            this.oauth2Client.setCredentials({
                refresh_token: credentials.refreshToken
            });

            // Configure axios instance with proper headers and settings
            this.axiosInstance = axios.create({
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
        } catch (error) {
            console.error('❌ Gmail initialization failed:', error);
            throw error;
        }
    }
    /**
    * Get Gmail credentials based on email
    */
    private static getGmailCredentials(email: string): {
        clientId: string;
        clientSecret: string;
        refreshToken: string;
        redirectUri: string;
    } {
        // Use the appropriate credentials based on the email
        const isFirstDevice = email === process.env.PHILO_EMAIL;
        const isSecondDevice = email === process.env.PHILO_EMAIL_2;
        const isThirdDevice = email === process.env.PHILO_EMAIL_3;

        if (isFirstDevice) {
            return {
                clientId: process.env.GMAIL_CLIENT_ID!,
                clientSecret: process.env.GMAIL_CLIENT_SECRET!,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
                redirectUri: process.env.GMAIL_REDIRECT_URI!
            };
        } else if (isSecondDevice) {
            return {
                clientId: process.env.GMAIL_2_CLIENT_ID!,
                clientSecret: process.env.GMAIL_2_CLIENT_SECRET!,
                refreshToken: process.env.GMAIL_2_REFRESH_TOKEN!,
                redirectUri: process.env.GMAIL_2_REDIRECT_URI!
            };
        } else if (isThirdDevice) {
            return {
                clientId: process.env.GMAIL_3_CLIENT_ID!,
                clientSecret: process.env.GMAIL_3_CLIENT_SECRET!,
                refreshToken: process.env.GMAIL_3_REFRESH_TOKEN!,
                redirectUri: process.env.GMAIL_3_REDIRECT_URI!
            };
        } else {
            throw new Error('Email does not match any configured devices');
        }
    }

    /**
     * Extract all form fields from HTML
     */
    private static extractFormFields(html: string): URLSearchParams {
        const formData = new URLSearchParams();
        const formFields = html.match(/<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"[^>]*>/g);
        
        formFields?.forEach(field => {
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
    private static extractCSRFToken(html: string): string | null {
        const csrfMatch = html.match(/<meta[^>]+name="csrf-token"[^>]+content="([^"]+)"[^>]*>/);
        return csrfMatch ? csrfMatch[1] : null;
    }

    /**
     * Process Philo sign-in email and follow through the complete sign-in flow
     */
    static async processSignInEmail(deviceIp?: string): Promise<boolean> {
        try {
            console.log('\n=== Processing Philo Sign-in Email ===');
            if (deviceIp) {
                await this.initializeGmailClient(deviceIp);
            } else {
                throw new Error('Device IP is required for email processing');
            }

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

                    if (!response.data?.messages?.length) {
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
                    const subject = message.data.payload?.headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
                    const from = message.data.payload?.headers?.find(h => h.name === 'From')?.value || 'No Sender';
                    const date = message.data.payload?.headers?.find(h => h.name === 'Date')?.value || 'No Date';
                    console.log('Email details:', { subject, from, date });

                    // Extract email body
                    const emailBody = message.data.payload?.parts?.[0]?.body?.data ||
                                    message.data.payload?.body?.data;

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
                    console.log(`\nWaiting ${waitTime/1000} seconds before next attempt...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }

            console.log('❌ No valid sign-in emails found after all attempts');
            return false;

        } catch (error) {
            console.error('❌ Error processing email:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response:', error.response?.data);
            }
            return false;
        }
    }

    /**
     * Process the sign-in link and complete the sign-in flow
     */
    private static async processSignInLink(signInLink: string, messageId: string): Promise<boolean> {
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
                } else {
                    console.log('❌ Failed to submit confirmation form');
                    return false;
                }
            } else {
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
            } catch (error: any) {
                console.warn('⚠️ Could not mark email as read:', error.message);
            }

            console.log('✅ Successfully completed sign-in flow');
            return true;
        } catch (error) {
            console.error('❌ Error processing sign-in link:', error);
            return false;
        }
    }

    /**
     * Extract sign-in link from email body
     */
    private static extractSignInLink(decodedBody: string): string | null {
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
    static async searchPhiloEmails(deviceIp: string): Promise<void> {
        try {
            await this.initializeGmailClient(deviceIp);

            console.log('\n=== Searching for Philo Sign-in Emails ===');

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

                if (!response.data?.messages?.length) {
                    console.log('No emails found with this query');
                    continue;
                }

                const messages = response.data.messages;
                console.log(`Found ${messages.length} emails:`);
                
                // Get details for each email
                for (const msg of messages) {
                    if (!msg.id) continue;
                    
                    const message = await this.gmail.users.messages.get({
                        auth: this.oauth2Client,
                        userId: 'me',
                        id: msg.id
                    });

                    const headers = message.data?.payload?.headers || [];
                    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
                    const from = headers.find(h => h.name === 'From')?.value || 'No Sender';
                    const date = headers.find(h => h.name === 'Date')?.value || 'No Date';
                    
                    console.log(`\nEmail ID: ${msg.id}`);
                    console.log(`From: ${from}`);
                    console.log(`Subject: ${subject}`);
                    console.log(`Date: ${date}`);
                }

                // Found emails with this query, no need to try others
                return;
            }

            console.log('\n❌ No Philo emails found with any query');
        } catch (error) {
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