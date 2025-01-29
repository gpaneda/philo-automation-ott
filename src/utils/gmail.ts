import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GmailService {
  private oauth2Client: OAuth2Client;
  private currentEmail: string;

  constructor(email: string = process.env.PHILO_EMAIL!) {
    this.currentEmail = email;
    const credentials = this.getGmailCredentials(email);

    this.oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      credentials.redirectUri
    );

    this.oauth2Client.setCredentials({
      refresh_token: credentials.refreshToken,
      access_token: credentials.accessToken,
    });
  }

  private getGmailCredentials(email: string) {
    const isFirstDevice = email === process.env.PHILO_EMAIL;
    const isSecondDevice = email === process.env.PHILO_EMAIL_2;
    const isThirdDevice = email === process.env.PHILO_EMAIL_3;

    if (isFirstDevice) {
        return {
            clientId: process.env.GMAIL_CLIENT_ID!,
            clientSecret: process.env.GMAIL_CLIENT_SECRET!,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
            accessToken: process.env.GMAIL_ACCESS_TOKEN!,
            redirectUri: process.env.GMAIL_REDIRECT_URI!
        };
    } else if (isSecondDevice) {
        return {
            clientId: process.env.GMAIL_2_CLIENT_ID!,
            clientSecret: process.env.GMAIL_2_CLIENT_SECRET!,
            refreshToken: process.env.GMAIL_2_REFRESH_TOKEN!,
            accessToken: process.env.GMAIL_2_ACCESS_TOKEN!,
            redirectUri: process.env.GMAIL_2_REDIRECT_URI!
        };
    } else if (isThirdDevice) {
        return {
            clientId: process.env.GMAIL_3_CLIENT_ID!,
            clientSecret: process.env.GMAIL_3_CLIENT_SECRET!,
            refreshToken: process.env.GMAIL_3_REFRESH_TOKEN!,
            accessToken: process.env.GMAIL_3_ACCESS_TOKEN!,
            redirectUri: process.env.GMAIL_3_REDIRECT_URI!
        };
    } else {
        throw new Error('Email does not match any configured devices');
    }
  }

  async getPhiloVerificationCode(): Promise<string> {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
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
      id: response.data.messages[0].id!
    });

    // Extract the verification link from email body
    const emailBody = Buffer.from(message.data.payload!.body!.data!, 'base64').toString();
    const verificationLink = this.extractVerificationLink(emailBody);

    return verificationLink;
  }

  private extractVerificationLink(emailBody: string): string {
    const linkMatch = emailBody.match(/https:\/\/[^\s<>"]+/);
    if (!linkMatch) {
      throw new Error('Verification link not found in email');
    }
    return linkMatch[0];
  }
} 