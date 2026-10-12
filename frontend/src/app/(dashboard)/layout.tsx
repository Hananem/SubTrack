'use client'

// src/app/(dashboard)/layout.tsx

import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/auth.context'
import { useUnreadCount } from '@/hooks/useNotifications'
import {
  LayoutDashboard,
  CreditCard,
  Bell,
  LogOut,
  Loader2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const GREEN = '#1db35a'
const CREAM = '#f6f4ee'

const hatch: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(45deg, ${GREEN} 0 1.5px, transparent 1.5px 6px)`,
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { data: unreadCount = 0 } = useUnreadCount()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: CREAM, color: GREEN }}
      >
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div
      className="min-h-screen flex font-light"
      style={{ backgroundColor: CREAM, color: GREEN }}
    >
      {/* Sidebar — the page's own left border acts as the divider */}
      <aside
        className="w-16 md:w-64 shrink-0 sticky top-0 h-screen self-start flex flex-col border-y-2 border-l-2"
        style={{ borderColor: GREEN, backgroundColor: CREAM }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="h-[72px] flex items-center justify-center md:justify-start gap-3 md:px-5 border-b-2"
          style={{ borderColor: GREEN }}
        >
          <div
            className="w-8 h-8 border-2 flex items-center justify-center shrink-0"
            style={{ borderColor: GREEN }}
          >
            <Zap className="w-4 h-4" />
          </div>
          <span className="hidden md:inline text-lg uppercase tracking-[0.15em]">SubTrack</span>
        </Link>

        {/* Nav */}
        <nav>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            const isNotifications = href.includes('notifications')
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  'flex items-center justify-center md:justify-start gap-3 md:px-5 py-4 border-b-2 text-sm uppercase tracking-[0.15em] transition-colors',
                  active ? 'bg-[#1db35a] text-[#f6f4ee]' : 'hover:bg-[#1db35a]/10',
                )}
                style={{ borderColor: GREEN }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline flex-1">{label}</span>
                {isNotifications && unreadCount > 0 && (
                  <span className="border-2 border-current text-[10px] min-w-5 h-5 px-1 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Hatched filler */}
        <div className="flex-1" style={hatch} />

        {/* User footer */}
        <div className="border-t-2" style={{ borderColor: GREEN, backgroundColor: CREAM }}>
          <div className="hidden md:block px-5 py-4 border-b-2" style={{ borderColor: GREEN }}>
            <div className="text-sm uppercase tracking-[0.1em] truncate">{user.name}</div>
            <div className="text-xs truncate mt-1">{user.email}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="w-full flex items-center justify-center md:justify-start gap-3 md:px-5 py-4 text-sm uppercase tracking-[0.15em] hover:bg-[#1db35a] hover:text-[#f6f4ee] transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}