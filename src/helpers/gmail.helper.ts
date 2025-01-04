import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import open from 'open';

export class GmailHelper {
    static clickSignInLink() {
        throw new Error('Method not implemented.');
    }
    static getPhiloSignInLink() {
        throw new Error('Method not implemented.');
    }
    private static oauth2Client: OAuth2Client;
    private static gmail = google.gmail('v1');

    /**
     * Initialize Gmail API client
     */
    private static async initializeGmailClient(): Promise<void> {
        try {
            console.log('=== Starting Gmail Client Initialization ===');
            
            this.oauth2Client = new OAuth2Client(
                process.env.GMAIL_CLIENT_ID,
                process.env.GMAIL_CLIENT_SECRET,
                process.env.GMAIL_REDIRECT_URI
            );
            
            this.oauth2Client.setCredentials({
                refresh_token: process.env.GMAIL_REFRESH_TOKEN
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
     * Process Philo sign-in email
     */
    static async processSignInEmail(): Promise<boolean> {
        try {
            console.log('\n=== Processing Philo Sign-in Email ===');
            await this.initializeGmailClient();

            // Get the most recent email
            const response = await this.gmail.users.messages.list({
                auth: this.oauth2Client,
                userId: 'me',
                maxResults: 1
            });

            if (!response.data.messages?.length) {
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
            const subject = message.data.payload?.headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
            const from = message.data.payload?.headers?.find(h => h.name === 'From')?.value || 'No Sender';
            console.log('Email details:', { subject, from });

            // Extract email body
            const emailBody = message.data.payload?.parts?.[0]?.body?.data ||
                            message.data.payload?.body?.data;

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
            const axiosInstance = axios.create({
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
            } else {
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
            } catch (error: any) {
                // Don't fail if we can't mark the email as read
                console.warn('⚠️ Could not mark email as read:', error.message);
            }

            console.log('✅ Successfully followed all links');
            return true;

        } catch (error) {
            console.error('❌ Error processing email:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response:', error.response?.data);
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