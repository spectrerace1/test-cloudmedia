import { createTransport } from 'nodemailer';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import * as admin from 'firebase-admin';
import { config } from '../config';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redis';

export class NotificationService {
  private readonly emailTransport;
  private readonly twilioClient;

  constructor() {
    // Initialize email transport
    this.emailTransport = createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });

    // Initialize SendGrid
    sgMail.setApiKey(config.sendgrid.apiKey);

    // Initialize Twilio
    this.twilioClient = twilio(
      config.twilio.accountSid,
      config.twilio.authToken
    );

    // Initialize Firebase Admin for push notifications
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(config.firebase.serviceAccount),
        projectId: config.firebase.projectId
      });
    }
  }

  // Email notifications
  async sendEmail(to: string, subject: string, content: string, template?: string) {
    try {
      if (template) {
        // Use SendGrid for template-based emails
        await sgMail.send({
          to,
          from: config.email.from,
          templateId: template,
          dynamicTemplateData: { content }
        });
      } else {
        // Use Nodemailer for simple emails
        await this.emailTransport.sendMail({
          from: config.email.from,
          to,
          subject,
          html: content
        });
      }

      logger.info(`Email sent to ${to}`);
      await this.trackNotification('email', to);
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  // SMS notifications
  async sendSMS(to: string, message: string) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: config.twilio.phoneNumber,
        to
      });

      logger.info(`SMS sent to ${to}`);
      await this.trackNotification('sms', to);
    } catch (error) {
      logger.error('SMS sending failed:', error);
      throw error;
    }
  }

  // Push notifications
  async sendPushNotification(token: string, title: string, body: string, data?: any) {
    try {
      await admin.messaging().send({
        token,
        notification: {
          title,
          body
        },
        data
      });

      logger.info(`Push notification sent to ${token}`);
      await this.trackNotification('push', token);
    } catch (error) {
      logger.error('Push notification failed:', error);
      throw error;
    }
  }

  // Bulk notifications
  async sendBulkEmails(recipients: string[], subject: string, content: string) {
    const promises = recipients.map(to => 
      this.sendEmail(to, subject, content)
    );
    await Promise.allSettled(promises);
  }

  async sendBulkSMS(recipients: string[], message: string) {
    const promises = recipients.map(to => 
      this.sendSMS(to, message)
    );
    await Promise.allSettled(promises);
  }

  async sendBulkPushNotifications(tokens: string[], title: string, body: string, data?: any) {
    const messages = tokens.map(token => ({
      token,
      notification: { title, body },
      data
    }));

    await admin.messaging().sendAll(messages);
  }

  // Notification tracking
  private async trackNotification(type: string, recipient: string) {
    const notification = {
      type,
      recipient,
      timestamp: new Date().toISOString()
    };

    await redisClient.lPush('notifications:history', JSON.stringify(notification));
    await redisClient.lTrim('notifications:history', 0, 999); // Keep last 1000 notifications
  }

  // Get notification history
  async getNotificationHistory(limit: number = 100) {
    const notifications = await redisClient.lRange('notifications:history', 0, limit - 1);
    return notifications.map(n => JSON.parse(n));
  }

  // Device specific notifications
  async notifyDeviceOffline(deviceId: string, branchId: string) {
    const message = `Device ${deviceId} in branch ${branchId} is offline`;
    
    // Get notification preferences for this branch
    const preferences = await this.getNotificationPreferences(branchId);
    
    if (preferences.email.deviceOffline) {
      await this.sendEmail(
        preferences.email.address,
        'Device Offline Alert',
        message
      );
    }

    if (preferences.sms.criticalDeviceStatus) {
      await this.sendSMS(
        preferences.sms.phone,
        message
      );
    }

    if (preferences.push.deviceStatus) {
      await this.sendPushNotification(
        preferences.push.token,
        'Device Offline',
        message
      );
    }
  }

  async notifyPlaylistChange(branchId: string, playlistName: string) {
    const message = `Playlist changed to ${playlistName} in branch ${branchId}`;
    const preferences = await this.getNotificationPreferences(branchId);

    if (preferences.email.playlistChanges) {
      await this.sendEmail(
        preferences.email.address,
        'Playlist Change Notification',
        message
      );
    }

    if (preferences.push.playlistChanges) {
      await this.sendPushNotification(
        preferences.push.token,
        'Playlist Changed',
        message
      );
    }
  }

  private async getNotificationPreferences(branchId: string) {
    const preferences = await redisClient.hGet(`branch:${branchId}:preferences`, 'notifications');
    return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
  }

  private getDefaultPreferences() {
    return {
      email: {
        address: config.notifications.defaultEmail,
        deviceOffline: true,
        playlistChanges: true
      },
      sms: {
        phone: config.notifications.defaultPhone,
        criticalDeviceStatus: true
      },
      push: {
        token: '',
        deviceStatus: true,
        playlistChanges: true
      }
    };
  }
}