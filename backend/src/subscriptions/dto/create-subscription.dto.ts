// src/subscriptions/dto/create-subscription.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import {
  BillingCycle,
  SubscriptionCategory,
} from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'Netflix' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Video streaming service' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 15.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ enum: SubscriptionCategory })
  @IsOptional()
  @IsEnum(SubscriptionCategory)
  category?: SubscriptionCategory;

  @ApiPropertyOptional({ example: 2, description: 'Days before payment to send reminder' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  remindDaysBefore?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  notifyEnabled?: boolean;

  @ApiPropertyOptional({ example: 'https://netflix.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://netflix.com' })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;
}
