'use client'

// src/app/(dashboard)/dashboard/page.tsx

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Plus, CreditCard, TrendingUp, Calendar, AlertCircle } from 'lucide-react'
import { useDashboardStats, useSubscriptions } from '@/hooks/useSubscriptions'
import { useAuth } from '@/context/auth.context'
import { SubscriptionCard } from '@/components/SubscriptionCard'
import { formatCurrency, daysUntil } from '@/lib/utils'
import { Subscription } from '@/types'

const GREEN = '#1db35a'
const CREAM = '#f6f4ee'

const hatch: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(45deg, ${GREEN} 0 1.5px, transparent 1.5px 6px)`,
}

const grid: CSSProperties = {
  backgroundImage: `linear-gradient(${GREEN} 2px, transparent 2px), linear-gradient(90deg, ${GREEN} 2px, transparent 2px)`,
  backgroundSize: '72px 72px',
  backgroundPosition: '-1px -1px',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: subscriptions = [], isLoading: subsLoading } = useSubscriptions()

  // Subscriptions due within 7 days, sorted soonest first
  const upcoming: Subscription[] = subscriptions
    .filter((s) => {
      const d = daysUntil(s.nextPayment)
      return s.status === 'ACTIVE' && d >= 0 && d <= 7
    })
    .sort((a, b) => daysUntil(a.nextPayment) - daysUntil(b.nextPayment))

  const statItems = [
    {
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions ?? 0,
      icon: CreditCard,
    },
    {
      label: 'Monthly Spend',
      value: formatCurrency(stats?.monthlySpend ?? 0),
      icon: TrendingUp,
    },
    {
      label: 'Yearly Spend',
      value: formatCurrency(stats?.yearlySpend ?? 0),
      icon: Calendar,
      sub: 'Projected',
    },
    {
      label: 'Due This Week',
      value: stats?.upcomingPayments ?? 0,
      icon: AlertCircle,
    },
  ]

  return (
    <div
      className="w-full min-h-screen flex flex-col border-2 font-light"
      style={{ backgroundColor: CREAM, color: GREEN, borderColor: GREEN }}
    >
      {/* ROW 1 — header */}
      <section className="grid grid-cols-12 border-b-2" style={{ borderColor: GREEN }}>
        <div
          className="col-span-12 md:col-span-8 p-6 md:p-8 md:border-r-2"
          style={{ borderColor: GREEN }}
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4">
            Here&apos;s your subscription overview
          </p>
          <h1 className="text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight">
            Good morning,
            <br />
            {user?.name.split(' ')[0]}
          </h1>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col">
          <Link
            href="/dashboard/subscriptions/new"
            className="flex items-center justify-center gap-2 py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase hover:bg-[#1db35a] hover:text-[#f6f4ee] transition-colors"
            style={{ borderColor: GREEN }}
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </Link>
          <div className="flex-1 min-h-[80px]" style={hatch} />
        </div>
      </section>

      {/* ROW 2 — stats cells */}
      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-[2px] border-b-2"
        style={{ backgroundColor: GREEN, borderColor: GREEN }}
      >
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse"
                style={{ ...hatch, backgroundColor: CREAM }}
              />
            ))
          : statItems.map((s) => (
              <div
                key={s.label}
                className="p-5 md:p-6 h-36 flex flex-col justify-between"
                style={{ backgroundColor: CREAM }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs uppercase tracking-[0.15em]">{s.label}</span>
                  <s.icon className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <div className="text-3xl md:text-5xl tracking-tight">{s.value}</div>
                  {s.sub && (
                    <div className="text-xs uppercase tracking-[0.15em] mt-1">{s.sub}</div>
                  )}
                </div>
              </div>
            ))}
      </section>

      {/* ROW 3 — grid strip */}
      <div className="h-[72px] border-b-2" style={{ ...grid, borderColor: GREEN }} />

      {/* Due this week */}
      {upcoming.length > 0 && (
        <section className="border-b-2" style={{ borderColor: GREEN }}>
          <div
            className="px-6 md:px-8 py-4 border-b-2 text-sm uppercase tracking-[0.2em]"
            style={{ borderColor: GREEN }}
          >
            Due This Week
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((s) => (
              <SubscriptionCard key={s.id} subscription={s} />
            ))}
          </div>
        </section>
      )}

      {/* All subscriptions */}
      <section className="flex-1 flex flex-col">
        <div
          className="px-6 md:px-8 py-4 border-b-2 flex items-center justify-between"
          style={{ borderColor: GREEN }}
        >
          <h2 className="text-sm uppercase tracking-[0.2em]">All Subscriptions</h2>
          <Link
            href="/dashboard/subscriptions"
            className="text-xs uppercase tracking-[0.15em] underline underline-offset-4"
          >
            View all →
          </Link>
        </div>

        {subsLoading ? (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 border-2 animate-pulse"
                style={{ ...hatch, borderColor: GREEN }}
              />
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-6 md:p-8">
            <div
              className="border-2 p-12 md:p-16 text-center"
              style={{ borderColor: GREEN }}
            >
              <CreditCard className="w-10 h-10 mx-auto mb-4" />
              <p className="uppercase tracking-[0.15em] text-sm mb-6">No subscriptions yet.</p>
              <Link
                href="/dashboard/subscriptions/new"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 uppercase tracking-[0.15em] text-sm"
                style={{ borderColor: GREEN, backgroundColor: GREEN, color: CREAM }}
              >
                <Plus className="w-4 h-4" />
                Add your first subscription
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.slice(0, 6).map((s) => (
              <SubscriptionCard key={s.id} subscription={s} />
            ))}
          </div>
        )}

        {/* filler grid to reach the bottom of the screen */}
        <div className="flex-1 min-h-[72px] border-t-2" style={{ ...grid, borderColor: GREEN }} />
      </section>
    </div>
  )
}