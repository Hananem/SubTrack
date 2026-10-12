'use client'

// src/components/SubscriptionCard.tsx

import { useState } from 'react'
import Link from 'next/link'
import {
  MoreHorizontal,
  CheckCircle,
  PauseCircle,
  Trash2,
  Pencil,
  PlayCircle,
} from 'lucide-react'
import { Subscription } from '@/types'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import {
  formatCurrency,
  formatDate,
  daysUntil,
  urgencyColor,
  urgencyBg,
  billingCycleLabel,
  cn,
} from '@/lib/utils'
import {
  useDeleteSubscription,
  useToggleStatus,
  useMarkPaymentDone,
} from '@/hooks/useSubscriptions'

interface Props {
  subscription: Subscription
}

export function SubscriptionCard({ subscription: s }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { mutate: deleteItem } = useDeleteSubscription()
  const { mutate: toggle } = useToggleStatus()
  const { mutate: markDone } = useMarkPaymentDone()

  const daysLeft = daysUntil(s.nextPayment)
  const isPaused = s.status === 'PAUSED'
  const isExpired = s.status === 'EXPIRED'

  const daysLabel =
    daysLeft < 0
      ? 'Overdue'
      : daysLeft === 0
      ? 'Due today'
      : `${daysLeft}d left`

  return (
    <div
      className={cn(
        'card p-5 flex flex-col gap-4 transition-all duration-200 hover:border-white/[0.12] group',
        (isPaused || isExpired) && 'opacity-60',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo / Fallback */}
          {s.logoUrl ? (
            <img
              src={s.logoUrl}
              alt={s.name}
              className="w-9 h-9 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
              {s.name[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{s.name}</div>
            <div className="text-xs text-white/40">{billingCycleLabel(s.billingCycle)}</div>
          </div>
        </div>

        {/* Action menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-44 card py-1 shadow-xl shadow-black/30">
                <Link
                  href={`/dashboard/subscriptions/${s.id}/edit`}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Link>
                <button
                  onClick={() => { markDone(s.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark paid
                </button>
                <button
                  onClick={() => { toggle(s.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  {isPaused ? (
                    <><PlayCircle className="w-3.5 h-3.5" /> Resume</>
                  ) : (
                    <><PauseCircle className="w-3.5 h-3.5" /> Pause</>
                  )}
                </button>
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    if (confirm(`Delete "${s.name}"?`)) deleteItem(s.id)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-bold text-white">
            {formatCurrency(s.price, s.currency)}
          </div>
          <div className="text-xs text-white/40 mt-0.5">
            Next: {formatDate(s.nextPayment)}
          </div>
        </div>
        <CategoryBadge category={s.category} />
      </div>

      {/* Days pill */}
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 border text-sm font-medium',
          urgencyBg(daysLeft),
        )}
      >
        <span className={cn('text-xs font-semibold', urgencyColor(daysLeft))}>
          {daysLabel}
        </span>
        {isPaused && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-white/30 font-semibold">
            Paused
          </span>
        )}
        {isExpired && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-red-400 font-semibold">
            Expired
          </span>
        )}
      </div>
    </div>
  )
}
