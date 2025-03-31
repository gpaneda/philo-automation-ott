import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios, { AxiosInstance } from 'axios';
import open from 'open';
import { AppHelper } from './app.helper';

interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

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
            console.log('\n=== Starting Gmail Client Initialization ===');
            console.log('Device IP received:', deviceIp);
            
            // If email is not provided, determine it based on the device type
            let selectedEmail = email || process.env.PHILO_EMAIL;
            if (!selectedEmail) {
                const androidTvIp = process.env.ANDROID_TV_IP || '';
                const fireTvIp = process.env.FIRE_TV_IP || '';
                
                console.log('Comparing device IPs:');
                console.log('Current device IP:', deviceIp);
                console.log('Fire TV IP:', fireTvIp);
                console.log('Android TV IP:', androidTvIp);
                console.log('Current device type:', AppHelper.currentDeviceType);
                
                // First try to match by device type
                if (AppHelper.currentDeviceType === 'androidTV') {
                    console.log('Using Android TV email based on device type');
                    selectedEmail = process.env.PHILO_EMAIL_3 || '';
                } else if (AppHelper.currentDeviceType === 'fireTV') {
                    console.log('Using Fire TV email based on device type');
                    selectedEmail = process.env.PHILO_EMAIL || '';
                } 
                // If device type is not set, try to match by IP
                else if (deviceIp === androidTvIp) {
                    console.log('Matched Android TV IP');
                    selectedEmail = process.env.PHILO_EMAIL_3 || '';
                } else if (deviceIp === fireTvIp) {
                    console.log('Matched Fire TV IP');
                    selectedEmail = process.env.PHILO_EMAIL || '';
                } else {
                    console.log('No IP match, using default email');
                    selectedEmail = process.env.PHILO_EMAIL || '';
                }
            }

            if (!selectedEmail) {
                console.error('No email address configured for device');
                throw new Error('No email address configured for device');
            }

            console.log('Selected email:', selectedEmail);
            
            const credentials = await this.getGmailCredentials(selectedEmail);
            console.log('Retrieved Gmail credentials for email:', selectedEmail);
            
            this.currentEmail = selectedEmail;
            
            console.log('Creating OAuth2 client...');
            this.oauth2Client = new OAuth2Client(
                credentials.clientId,
                credentials.clientSecret,
                credentials.redirectUri
            );
            
            console.log('Setting OAuth2 credentials...');
            this.oauth2Client.setCredentials({
                refresh_token: credentials.refreshToken
            });

            // Configure axios instance with proper headers and settings
            console.log('Configuring axios instance...');
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

            console.log('Verifying Gmail connection...');
            const profile = await this.gmail.users.getProfile({
                auth: this.oauth2Client,
                userId: 'me'
            });
            console.log('✅ Successfully connected to Gmail as:', profile.data.emailAddress);
        } catch (error) {
            console.error('❌ Gmail initialization failed:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
                console.error('Error stack:', error.stack);
            }
            throw error;
        }
    }
    /**
    * Get Gmail credentials based on email
    */
    private static async getGmailCredentials(email: string): Promise<GmailCredentials> {
        console.log('\n=== Gmail Credential Selection ===');
        console.log('Email:', email);
        console.log('PHILO_EMAIL:', process.env.PHILO_EMAIL);
        console.log('PHILO_EMAIL_2:', process.env.PHILO_EMAIL_2);
        console.log('PHILO_EMAIL_3:', process.env.PHILO_EMAIL_3);

        // Default credentials
        const defaultCredentials: GmailCredentials = {
            clientId: process.env.GMAIL_CLIENT_ID!,
            clientSecret: process.env.GMAIL_CLIENT_SECRET!,
            redirectUri: process.env.GMAIL_REDIRECT_URI!,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN!
        };

        // Check if any credentials are missing
        const missingCredentials = Object.entries(defaultCredentials)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingCredentials.length > 0) {
            console.error('Missing default Gmail credentials:', missingCredentials);
            throw new Error(`Missing required Gmail credentials: ${missingCredentials.join(', ')}`);
        }

        // If email matches any configured email, use those credentials
        if (email === process.env.PHILO_EMAIL) {
            console.log('Using Fire TV credentials');
            return defaultCredentials;
        } else if (email === process.env.PHILO_EMAIL_2) {
            console.log('Using Android TV credentials');
            return {
                clientId: process.env.GMAIL_CLIENT_ID_2!,
                clientSecret: process.env.GMAIL_CLIENT_SECRET_2!,
                redirectUri: process.env.GMAIL_REDIRECT_URI_2!,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN_2!
            };
        } else if (email === process.env.PHILO_EMAIL_3) {
            console.log('Using Roku credentials');
            return {
                clientId: process.env.GMAIL_CLIENT_ID_3!,
                clientSecret: process.env.GMAIL_CLIENT_SECRET_3!,
                redirectUri: process.env.GMAIL_REDIRECT_URI_3!,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN_3!
            };
        } else {
            console.log('Using default credentials for email:', email);
            return defaultCredentials;
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
            if (!deviceIp) {
                throw new Error('Device IP is required for email processing');
            }

            console.log(`Processing sign-in email for device IP: ${deviceIp}, device type: ${AppHelper.currentDeviceType}`);
            console.log('Initializing Gmail client...');
            await this.initializeGmailClient(deviceIp);
            console.log('Gmail client initialized successfully');

            // Try different search queries
            const queries = [
                'from:(help OR noreply OR no-reply)@philo.com subject:sign newer_than:24h',
                'from:(help OR noreply OR no-reply)@philo.com subject:"Sign in"',
                'from:(help OR noreply OR no-reply)@philo.com'
            ];

            console.log('Starting email search with queries:', queries);

            // Try up to 3 times with increasing wait times
            for (let attempt = 1; attempt <= 3; attempt++) {
                console.log(`\nAttempt ${attempt} to find sign-in email...`);
                
                // Try each query
                for (const query of queries) {
                    console.log(`\nTrying search query: ${query}`);
                    try {
                        const response = await this.gmail.users.messages.list({
                            auth: this.oauth2Client,
                            userId: 'me',
                            maxResults: 10,
                            q: query
                        });

                        console.log('Gmail API response:', JSON.stringify(response.data, null, 2));

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
                        console.log('Fetching email content...');
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
                        console.log('Extracting sign-in link...');
                        const signInLink = this.extractSignInLink(decodedBody);
                        if (!signInLink) {
                            console.log('❌ No sign-in link found in email');
                            continue;
                        }

                        console.log('✅ Found sign-in link:', signInLink);

                        // Process the sign-in link
                        console.log('Processing sign-in link...');
                        if (await this.processSignInLink(signInLink, messageId)) {
                            console.log('✅ Successfully processed sign-in link');
                            return true;
                        } else {
                            throw new Error('Failed to process sign-in link');
                        }
                    } catch (error) {
                        console.error(`Error processing query "${query}":`, error);
                        throw error;
                    }
                }

                // Wait before next attempt
                const waitTime = attempt * 5000; // 5s, 10s, 15s
                console.log(`Waiting ${waitTime}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }

            throw new Error('Failed to find or process sign-in email after all attempts');
        } catch (error) {
            console.error('❌ Error during email processing:', error);
            throw error;
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

    /**
     * Get the Philo sign-in link from the most recent email
     * @returns Promise<string> The sign-in link or null if not found
     */
    public static async getPhiloSignInLink(): Promise<string | null> {
        try {
            // Try different search queries
            const queries = [
                'from:(help OR noreply OR no-reply)@philo.com subject:sign newer_than:24h',
                'from:(help OR noreply OR no-reply)@philo.com subject:"Sign in"',
                'from:(help OR noreply OR no-reply)@philo.com'
            ];

            // Try each query
            for (const query of queries) {
                console.log(`\nTrying search query: ${query}`);
                const response = await this.gmail.users.messages.list({
                    auth: this.oauth2Client,
                    userId: 'me',
                    maxResults: 1,
                    q: query
                });

                if (!response.data?.messages?.length) {
                    console.log('No emails found with this query');
                    continue;
                }

                // Get the most recent email
                const messageId = response.data.messages[0].id;
                if (!messageId) {
                    console.log('❌ Invalid message ID');
                    continue;
                }

                // Get email content
                const message = await this.gmail.users.messages.get({
                    auth: this.oauth2Client,
                    userId: 'me',
                    id: messageId,
                    format: 'full'
                });

                // Extract email body
                const emailBody = message.data.payload?.parts?.[0]?.body?.data ||
                                message.data.payload?.body?.data;

                if (!emailBody) {
                    console.log('❌ No email content found');
                    continue;
                }

                const decodedBody = Buffer.from(emailBody, 'base64').toString();
                const signInLink = this.extractSignInLink(decodedBody);

                if (signInLink) {
                    console.log('✅ Found sign-in link:', signInLink);
                    return signInLink;
                }
            }

            console.log('❌ No sign-in link found in any email');
            return null;

        } catch (error) {
            console.error('❌ Error getting sign-in link:', error);
            return null;
        }
    }

    /**
     * Click on the Philo sign-in link from the most recent email
     * @returns Promise<boolean> True if successful, false otherwise
     */
    public static async clickSignInLink(): Promise<boolean> {
        try {
            const signInLink = await this.getPhiloSignInLink();
            if (!signInLink) {
                console.log('❌ No sign-in link found');
                return false;
            }

            // Get the most recent email ID for marking as read later
            const response = await this.gmail.users.messages.list({
                auth: this.oauth2Client,
                userId: 'me',
                maxResults: 1,
                q: 'from:(help OR noreply OR no-reply)@philo.com subject:sign newer_than:24h'
            });

            const messageId = response.data?.messages?.[0]?.id;

            // Process the sign-in link
            const success = await this.processSignInLink(signInLink, messageId || '');
            return success;

        } catch (error) {
            console.error('❌ Error clicking sign-in link:', error);
            return false;
        }
    }
} 