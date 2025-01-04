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

            // Try different search queries
            const searchQueries = [
                'from:help@philo.com subject:"Your Philo sign-in link" newer_than:10m',
                'from:help@philo.com subject:"Sign in to Philo" newer_than:10m',
                'from:help@philo.com "sign in" newer_than:10m',
                'from:help@philo.com newer_than:10m'
            ];

            // Content patterns to look for in email body
            const contentPatterns = [
                'Sign in to Philo',
                'Your Philo sign-in link',
                'Click here to sign in',
                'Confirm your sign-in'
            ];

            let messageId = null;
            
            // Try each search query until we find a matching email
            for (const query of searchQueries) {
                console.log('Trying search query:', query);
                const response = await this.gmail.users.messages.list({
                    auth: this.oauth2Client,
                    userId: 'me',
                    q: query,
                    maxResults: 5
                });

                if (response.data.messages?.length) {
                    // Check each message for Philo-related content
                    for (const msg of response.data.messages) {
                        const message = await this.gmail.users.messages.get({
                            auth: this.oauth2Client,
                            userId: 'me',
                            id: msg.id as string,
                            format: 'full'
                        });

                        const subject = message.data.payload?.headers?.find(h => h.name === 'Subject')?.value || '';
                        const from = message.data.payload?.headers?.find(h => h.name === 'From')?.value || '';
                        
                        console.log('Found email:', { subject, from });

                        // Extract and check email content
                        const emailBody = message.data.payload?.parts?.[0]?.body?.data ||
                                        message.data.payload?.body?.data;

                        if (emailBody) {
                            const decodedBody = Buffer.from(emailBody, 'base64').toString();
                            const hasMatchingContent = contentPatterns.some(pattern => 
                                decodedBody.includes(pattern)
                            );
                            if (hasMatchingContent) {
                                messageId = msg.id;
                                console.log('✅ Found Philo sign-in email');
                                break;
                            }
                        }
                    }
                    if (messageId) break;
                }
            }

            if (!messageId) {
                console.log('❌ No relevant Philo email found');
                return false;
            }

            // Get email content
            console.log('Found email:', messageId);
            
            const message = await this.gmail.users.messages.get({
                auth: this.oauth2Client,
                userId: 'me',
                id: messageId as string,
                format: 'full'
            });

            // Extract email body
            const emailBody = message.data.payload?.parts?.[0]?.body?.data ||
                            message.data.payload?.body?.data;

            if (!emailBody) {
                console.log('❌ No email content found');
                return false;
            }

            const decodedBody = Buffer.from(emailBody, 'base64').toString();
            console.log('Processing email content...');

            // Option 2: Process the email content directly
            // Find the sign-in link in the email body
            const linkMatch = decodedBody.match(/<a href="([^"]+)"/);
            if (!linkMatch) {
                console.log('❌ No Sign in to Philo button found in email');
                return false;
            }

            const signInLink = linkMatch[1];
            console.log('✅ Found Sign in to Philo button:', signInLink);

            // Follow the sign-in link
            console.log('Following Sign in to Philo button...');
            const response1 = await axios.get(signInLink);
            if (response1.status !== 200) {
                console.log('❌ Failed to follow Sign in to Philo button');
                return false;
            }

            // Look for "Sign in to Philo" button
            if (response1.data.includes('Sign in to Philo')) {
                console.log('✅ Found "Sign in to Philo" button');
                
                // Click the button (simulate by making another request)
                const signInUrl = response1.data.match(/href="([^"]+sign-in[^"]+)"/)?.[1];
                if (!signInUrl) {
                    console.log('❌ No Sign in to Philo button URL found');
                    return false;
                }

                console.log('Clicking "Sign in to Philo" button...');
                const response2 = await axios.get(signInUrl);
                if (response2.status !== 200) {
                    console.log('❌ Failed to click Sign in to Philo button');
                    return false;
                }

                // Mark email as read
                await this.gmail.users.messages.modify({
                    auth: this.oauth2Client,
                    userId: 'me',
                    id: messageId as string,
                    requestBody: {
                        removeLabelIds: ['UNREAD']
                    }
                });

                console.log('✅ Successfully processed Sign in to Philo email');
                return true;
            }

            console.log('❌ Could not complete Sign in to Philo process');
            return false;

        } catch (error) {
            console.error('❌ Error processing Sign in to Philo email:', error);
            return false;
        }
    }
} 