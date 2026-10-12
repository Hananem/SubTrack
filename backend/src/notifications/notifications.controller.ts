// src/notifications/notifications.controller.ts

import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.findAllForUser(user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  async unreadCount(@CurrentUser() user: AuthenticatedUser) {
    const count = await this.notificationsService.countUnread(user.id);
    return { count };
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  markOneRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markOneRead(id);
  }
}
