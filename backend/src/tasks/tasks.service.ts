// src/tasks/tasks.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { MailService } from '../mail/mail.service';
import { NotificationType, Subscription, SubscriptionStatus } from '@prisma/client';
import { isPaymentOverdue } from '../common/utils/date.util';

const MAX_REMINDER_DAYS = 7;

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Runs every day at 08:00 AM
   * Checks all active subscriptions and sends reminders
   */
  @Cron('0 8 * * *', { name: 'payment-reminders' })
  async handlePaymentReminders(): Promise<void> {
    this.logger.log('🕗 Running daily payment reminder check...');

    const upcoming = await this.subscriptionsService.findUpcomingPayments(
      MAX_REMINDER_DAYS,
    );

    if (upcoming.length === 0) {
      this.logger.log('No upcoming payments today.');
      return;
    }

    this.logger.log(`Found ${upcoming.length} subscription(s) to remind.`);

    await Promise.allSettled(
      upcoming.map((sub) => this.processReminder(sub)),
    );
  }

  /**
   * Runs every day at midnight
   * Marks overdue subscriptions as EXPIRED
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'expire-subscriptions' })
  async handleExpiredSubscriptions(): Promise<void> {
    this.logger.log('🕛 Checking for expired subscriptions...');

    const activeSubscriptions = await this.prisma.subscription.findMany({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    const overdue = activeSubscriptions.filter((s) =>
      isPaymentOverdue(s.nextPayment),
    );

    if (overdue.length === 0) return;

    this.logger.warn(`Marking ${overdue.length} subscriptions as EXPIRED.`);

    await Promise.allSettled(
      overdue.map(async (sub) => {
        await this.prisma.subscription.update({
          where: { id: sub.id },
          data: { status: SubscriptionStatus.EXPIRED },
        });

        await this.prisma.notification.create({
          data: {
            subscriptionId: sub.id,
            type: NotificationType.EXPIRED,
            message: `${sub.name} subscription has expired (payment was due on ${sub.nextPayment.toDateString()}).`,
          },
        });
      }),
    );
  }

  private async processReminder(
    subscription: Subscription & { user?: { email: string; name: string } },
  ): Promise<void> {
    try {
      // Save notification record
      await this.prisma.notification.create({
        data: {
          subscriptionId: subscription.id,
          type: NotificationType.REMINDER,
          message: `Your ${subscription.name} subscription renews on ${subscription.nextPayment.toDateString()} for ${subscription.price} ${subscription.currency}.`,
        },
      });

      // Send email if user data is available
      if (subscription.user) {
        await this.mailService.sendPaymentReminder(
          subscription.user.email,
          subscription.user.name,
          subscription,
        );
      }

      this.logger.log(`✅ Reminder processed for: ${subscription.name}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to process reminder for ${subscription.name}: ${(error as Error).message}`,
      );
    }
  }
}
