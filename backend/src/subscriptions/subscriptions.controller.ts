// src/subscriptions/subscriptions.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions for current user' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.subscriptionsService.findAll(user.id);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard stats (totals, upcoming)' })
  getDashboardStats(@CurrentUser() user: AuthenticatedUser) {
    return this.subscriptionsService.getDashboardStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single subscription' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, user.id, dto);
  }

  @Patch(':id/payment-done')
  @ApiOperation({ summary: 'Mark payment as done — advances nextPayment date' })
  markPaymentDone(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.markPaymentDone(id, user.id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle subscription between ACTIVE and PAUSED' })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.toggleStatus(id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.remove(id, user.id);
  }
}
