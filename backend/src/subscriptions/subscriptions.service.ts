// src/subscriptions/subscriptions.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription, SubscriptionStatus } from '@prisma/client';
import {
  getNextFuturePaymentDate,
  calculateNextPaymentDate,
} from '../common/utils/date.util';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    dto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const startDate = new Date(dto.startDate);
    const nextPayment = getNextFuturePaymentDate(startDate, dto.billingCycle);

    return this.prisma.subscription.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        currency: dto.currency ?? 'USD',
        billingCycle: dto.billingCycle,
        startDate,
        nextPayment,
        category: dto.category,
        remindDaysBefore: dto.remindDaysBefore ?? 2,
        notifyEnabled: dto.notifyEnabled ?? true,
        logoUrl: dto.logoUrl,
        websiteUrl: dto.websiteUrl,
        userId,
      },
    });
  }

  async findAll(userId: number): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { nextPayment: 'asc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');
    if (subscription.userId !== userId) throw new ForbiddenException();

    return subscription;
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    await this.findOne(id, userId); // ownership check

    const data: Partial<Subscription> = { ...dto } as any;

    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }

    // Recalculate nextPayment if startDate or billingCycle changed
    if (dto.startDate || dto.billingCycle) {
      const current = await this.prisma.subscription.findUniqueOrThrow({
        where: { id },
      });
      const base = dto.startDate ? new Date(dto.startDate) : current.startDate;
      const cycle = dto.billingCycle ?? current.billingCycle;
      data.nextPayment = getNextFuturePaymentDate(base, cycle);
    }

    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.prisma.subscription.delete({ where: { id } });
  }

  async markPaymentDone(id: number, userId: number): Promise<Subscription> {
    const subscription = await this.findOne(id, userId);

    const nextPayment = calculateNextPaymentDate(
      subscription.nextPayment,
      subscription.billingCycle,
    );

    return this.prisma.subscription.update({
      where: { id },
      data: { nextPayment },
    });
  }

  async toggleStatus(id: number, userId: number): Promise<Subscription> {
    const subscription = await this.findOne(id, userId);

    const newStatus =
      subscription.status === SubscriptionStatus.ACTIVE
        ? SubscriptionStatus.PAUSED
        : SubscriptionStatus.ACTIVE;

    return this.prisma.subscription.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  // Used by Cron job — no ownership check needed
  async findUpcomingPayments(withinDays: number): Promise<Subscription[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + withinDays);

    return this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        notifyEnabled: true,
        nextPayment: { gte: now, lte: future },
      },
      include: { user: { select: { email: true, name: true } } },
    });
  }

  async getDashboardStats(userId: number) {
    const subscriptions = await this.findAll(userId);
    const active = subscriptions.filter(
      (s) => s.status === SubscriptionStatus.ACTIVE,
    );

    const monthlyTotal = active.reduce((sum, s) => {
      if (s.billingCycle === 'MONTHLY') return sum + s.price;
      if (s.billingCycle === 'YEARLY') return sum + s.price / 12;
      if (s.billingCycle === 'QUARTERLY') return sum + s.price / 3;
      if (s.billingCycle === 'WEEKLY') return sum + s.price * 4.33;
      return sum;
    }, 0);

    const yearlyTotal = monthlyTotal * 12;

    const upcoming = subscriptions.filter((s) => {
      const daysLeft =
        (s.nextPayment.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysLeft <= 7 && daysLeft >= 0;
    });

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: active.length,
      monthlySpend: Math.round(monthlyTotal * 100) / 100,
      yearlySpend: Math.round(yearlyTotal * 100) / 100,
      upcomingPayments: upcoming.length,
    };
  }
}
