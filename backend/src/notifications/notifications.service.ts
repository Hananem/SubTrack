// src/notifications/notifications.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        subscription: { userId },
      },
      include: {
        subscription: { select: { id: true, name: true, logoUrl: true } },
      },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
  }

  async markAllRead(userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        isRead: false,
        subscription: { userId },
      },
      data: { isRead: true },
    });
  }

  async markOneRead(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: {
        isRead: false,
        subscription: { userId },
      },
    });
  }
}
