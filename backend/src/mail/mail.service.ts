// src/mail/mail.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Subscription } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST', 'smtp.gmail.com'),
      port: config.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  async sendPaymentReminder(
    to: string,
    userName: string,
    subscription: Subscription,
  ): Promise<void> {
    const paymentDate = format(subscription.nextPayment, 'MMMM dd, yyyy');
    const daysLeft = Math.ceil(
      (subscription.nextPayment.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    const subject = `⏰ Reminder: ${subscription.name} renews in ${daysLeft} day(s)`;

    const html = this.buildReminderHtml({
      userName,
      subscriptionName: subscription.name,
      price: subscription.price,
      currency: subscription.currency,
      paymentDate,
      daysLeft,
    });

    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to,
        subject,
        html,
      });

      this.logger.log(
        `Reminder sent to ${to} for subscription: ${subscription.name}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send reminder to ${to}: ${(error as Error).message}`,
      );
    }
  }

  private buildReminderHtml(data: {
    userName: string;
    subscriptionName: string;
    price: number;
    currency: string;
    paymentDate: string;
    daysLeft: number;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Payment Reminder 🔔</h2>
          <p style="color: #666;">Hi <strong>${data.userName}</strong>,</p>
          <p style="color: #666;">Your <strong>${data.subscriptionName}</strong> subscription will renew in <strong style="color: #e74c3c;">${data.daysLeft} day(s)</strong>.</p>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 4px 0; color: #333;"><strong>Service:</strong> ${data.subscriptionName}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Amount:</strong> ${data.price} ${data.currency}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Date:</strong> ${data.paymentDate}</p>
          </div>
          
          <p style="color: #999; font-size: 12px;">Sent by Subscription Tracker — stay in control of your spending.</p>
        </div>
      </body>
      </html>
    `;
  }
}
