'use client'

// src/app/(dashboard)/dashboard/notifications/page.tsx

import type { CSSProperties } from 'react'
import { Bell, CheckCheck, Loader2, AlertCircle, Clock, XCircle } from 'lucide-react'
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications'
import { Notification, NotificationType } from '@/types'
import { cn, formatDate } from '@/lib/utils'

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

const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; label: string }> = {
  REMINDER: { icon: Clock, label: 'Reminder' },
  PAYMENT_DUE: { icon: AlertCircle, label: 'Payment due' },
  EXPIRED: { icon: XCircle, label: 'Expired' },
}

function NotificationItem({ n }: { n: Notification }) {
  const { icon: Icon, label } = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.REMINDER

  return (
    <div
      className={cn(
        'flex gap-4 px-6 md:px-8 py-5 border-b-2',
        n.isRead ? 'opacity-60' : 'bg-[#1db35a]/10',
      )}
      style={{ borderColor: GREEN }}
    >
      <div
        className="w-10 h-10 border-2 flex items-center justify-center shrink-0"
        style={{ borderColor: GREEN }}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base leading-relaxed">{n.message}</p>
          {!n.isRead && (
            <span
              className="w-3 h-3 shrink-0 mt-1.5"
              style={{ backgroundColor: GREEN }}
              aria-label="Unread"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs uppercase tracking-[0.15em]">
          <span>{label}</span>
          {n.subscription && (
            <>
              <span>·</span>
              <span>{n.subscription.name}</span>
            </>
          )}
          <span>·</span>
          <span>{formatDate(n.sentAt)}</span>
        </div>
      </div>
    </div>
  )
}

function SectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-6 md:px-8 py-3 border-b-2 text-sm uppercase tracking-[0.2em]"
      style={{ borderColor: GREEN }}
    >
      {children}
    </div>
  )
}

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { mutate: markAllRead, isPending } = useMarkAllRead()

  const unread = notifications.filter((n) => !n.isRead)
  const read = notifications.filter((n) => n.isRead)

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
            {unread.length > 0 ? `${unread.length} unread` : 'All caught up'}
          </p>
          <h1 className="text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight">
            Notifications
          </h1>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col">
          {unread.length > 0 ? (
            <button
              onClick={() => markAllRead()}
              disabled={isPending}
              className="flex items-center justify-center gap-2 py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase hover:bg-[#1db35a] hover:text-[#f6f4ee] transition-colors disabled:opacity-60"
              style={{ borderColor: GREEN }}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              Mark all read
            </button>
          ) : (
            <div
              className="py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase text-center"
              style={{ borderColor: GREEN }}
            >
              Inbox
            </div>
          )}
          <div className="flex-1 min-h-[80px]" style={hatch} />
        </div>
      </section>

      {/* ROW 2 — grid strip */}
      <div className="h-[72px] border-b-2" style={{ ...grid, borderColor: GREEN }} />

      {/* LIST */}
      <section className="flex-1 flex flex-col">
        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 border-b-2 animate-pulse"
                style={{ ...hatch, borderColor: GREEN }}
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 md:p-8">
            <div
              className="border-2 p-12 md:p-16 text-center"
              style={{ borderColor: GREEN }}
            >
              <Bell className="w-10 h-10 mx-auto mb-4" />
              <p className="uppercase tracking-[0.15em] text-sm">No notifications yet.</p>
              <p className="text-sm mt-2">We&apos;ll remind you before each renewal.</p>
            </div>
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <>
                <SectionBar>Unread</SectionBar>
                {unread.map((n) => (
                  <NotificationItem key={n.id} n={n} />
                ))}
              </>
            )}

            {read.length > 0 && (
              <>
                {unread.length > 0 && <SectionBar>Earlier</SectionBar>}
                {read.map((n) => (
                  <NotificationItem key={n.id} n={n} />
                ))}
              </>
            )}
          </>
        )}

        {/* filler grid to reach the bottom of the screen */}
        <div className="flex-1 min-h-[72px]" style={grid} />
      </section>
    </div>
  )
}