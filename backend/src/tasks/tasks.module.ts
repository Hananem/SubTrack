// src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SubscriptionsModule, MailModule],
  providers: [TasksService],
})
export class TasksModule {}
