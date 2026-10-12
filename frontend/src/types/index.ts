// src/types/index.ts

export type BillingCycle = 'MONTHLY' | 'YEARLY' | 'WEEKLY' | 'QUARTERLY'
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED'
export type SubscriptionCategory =
  | 'STREAMING'
  | 'PRODUCTIVITY'
  | 'DEVELOPMENT'
  | 'GAMING'
  | 'CLOUD'
  | 'FITNESS'
  | 'NEWS'
  | 'EDUCATION'
  | 'OTHER'
export type NotificationType = 'REMINDER' | 'PAYMENT_DUE' | 'EXPIRED'

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface Subscription {
  id: number
  name: string
  description?: string
  price: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  nextPayment: string
  category: SubscriptionCategory
  status: SubscriptionStatus
  remindDaysBefore: number
  notifyEnabled: boolean
  logoUrl?: string
  websiteUrl?: string
  createdAt: string
  updatedAt: string
  userId: number
}

export interface Notification {
  id: number
  message: string
  type: NotificationType
  isRead: boolean
  sentAt: string
  subscriptionId: number
  subscription?: {
    id: number
    name: string
    logoUrl?: string
  }
}

export interface DashboardStats {
  totalSubscriptions: number
  activeSubscriptions: number
  monthlySpend: number
  yearlySpend: number
  upcomingPayments: number
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: number
    name: string
    email: string
  }
}
