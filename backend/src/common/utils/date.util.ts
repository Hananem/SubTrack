// src/common/utils/date.util.ts

import {
  addMonths,
  addYears,
  addWeeks,
  addQuarters,
  differenceInDays,
  isBefore,
  isAfter,
} from 'date-fns';
import { BillingCycle } from '@prisma/client';

/**
 * Calculates the next payment date based on billing cycle.
 * Handles edge cases like months with fewer days (e.g., Jan 31 + 1 month).
 */
export function calculateNextPaymentDate(
  fromDate: Date,
  billingCycle: BillingCycle,
): Date {
  switch (billingCycle) {
    case BillingCycle.WEEKLY:
      return addWeeks(fromDate, 1);
    case BillingCycle.MONTHLY:
      return addMonths(fromDate, 1);
    case BillingCycle.QUARTERLY:
      return addQuarters(fromDate, 1);
    case BillingCycle.YEARLY:
      return addYears(fromDate, 1);
    default:
      throw new Error(`Unknown billing cycle: ${billingCycle}`);
  }
}

/**
 * Advances nextPayment until it is in the future.
 * Useful when a subscription was added retroactively.
 */
export function getNextFuturePaymentDate(
  startDate: Date,
  billingCycle: BillingCycle,
): Date {
  let date = startDate;
  const now = new Date();

  while (isBefore(date, now)) {
    date = calculateNextPaymentDate(date, billingCycle);
  }

  return date;
}

/**
 * Returns the number of days until the next payment.
 * Returns a negative number if the date has passed.
 */
export function daysUntilPayment(nextPayment: Date): number {
  return differenceInDays(nextPayment, new Date());
}

/**
 * Checks whether a reminder should be sent today for this subscription.
 */
export function shouldSendReminder(
  nextPayment: Date,
  remindDaysBefore: number,
): boolean {
  const daysLeft = daysUntilPayment(nextPayment);
  return daysLeft >= 0 && daysLeft <= remindDaysBefore;
}

/**
 * Checks if a payment date has passed.
 */
export function isPaymentOverdue(nextPayment: Date): boolean {
  return isAfter(new Date(), nextPayment);
}
