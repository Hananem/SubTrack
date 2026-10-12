'use client'

// src/app/(dashboard)/dashboard/subscriptions/page.tsx

import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { SubscriptionCard } from '@/components/SubscriptionCard'
import { SubscriptionStatus } from '@/types'
import { cn } from '@/lib/utils'

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

const STATUS_TABS: { label: string; value: SubscriptionStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Expired', value: 'EXPIRED' },
]

export default function SubscriptionsPage() {
  const { data: subscriptions = [], isLoading } = useSubscriptions()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'ALL'>('ALL')

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [subscriptions, search, statusFilter])

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
            {subscriptions.length} total
          </p>
          <h1 className="text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight">
            Subscriptions
          </h1>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col">
          <Link
            href="/dashboard/subscriptions/new"
            className="flex items-center justify-center gap-2 py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase hover:bg-[#1db35a] hover:text-[#f6f4ee] transition-colors"
            style={{ borderColor: GREEN }}
          >
            <Plus className="w-4 h-4" />
            Add New
          </Link>
          <div className="flex-1 min-h-[80px]" style={hatch} />
        </div>
      </section>

      {/* ROW 2 — search + tabs */}
      <section
        className="flex flex-col md:flex-row border-b-2"
        style={{ borderColor: GREEN }}
      >
        <div
          className="relative flex-1 border-b-2 md:border-b-0 md:border-r-2"
          style={{ borderColor: GREEN }}
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search subscriptions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full min-h-[56px] bg-transparent pl-12 pr-4 py-4 uppercase tracking-[0.1em] text-sm outline-none placeholder:text-[#1db35a]/50 focus:bg-[#1db35a]/5 transition-colors"
          />
        </div>

        <div className="flex">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                'flex-1 md:flex-none px-5 md:px-6 py-4 text-xs md:text-sm uppercase tracking-[0.15em] transition-colors',
                i < STATUS_TABS.length - 1 && 'border-r-2',
                statusFilter === tab.value
                  ? 'bg-[#1db35a] text-[#f6f4ee]'
                  : 'hover:bg-[#1db35a]/10',
              )}
              style={{ borderColor: GREEN }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ROW 3 — grid strip */}
      <div className="h-[72px] border-b-2" style={{ ...grid, borderColor: GREEN }} />

      {/* LIST */}
      <section className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 border-2 animate-pulse"
                style={{ ...hatch, borderColor: GREEN }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 md:p-8">
            <div
              className="border-2 p-12 md:p-16 text-center"
              style={{ borderColor: GREEN }}
            >
              <p className="uppercase tracking-[0.15em] text-sm">No subscriptions found.</p>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
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