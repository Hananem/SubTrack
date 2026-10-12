// src/lib/utils.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays } from 'date-fns'
import { BillingCycle } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function daysUntil(date: string | Date): number {
  return differenceInDays(new Date(date), new Date())
}

export function billingCycleLabel(cycle: BillingCycle): string {
  const labels: Record<BillingCycle, string> = {
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly',
    WEEKLY: 'Weekly',
    QUARTERLY: 'Quarterly',
  }
  return labels[cycle]
}

export function urgencyColor(daysLeft: number): string {
  if (daysLeft < 0) return 'text-red-500'
  if (daysLeft <= 2) return 'text-red-400'
  if (daysLeft <= 7) return 'text-amber-400'
  return 'text-emerald-400'
}

export function urgencyBg(daysLeft: number): string {
  if (daysLeft < 0) return 'bg-red-500/10 border-red-500/20'
  if (daysLeft <= 2) return 'bg-red-400/10 border-red-400/20'
  if (daysLeft <= 7) return 'bg-amber-400/10 border-amber-400/20'
  return 'bg-emerald-400/10 border-emerald-400/20'
}
