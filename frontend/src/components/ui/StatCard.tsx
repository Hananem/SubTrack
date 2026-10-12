// src/components/ui/StatCard.tsx

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  sub?: string
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10',
  sub,
  className,
}: StatCardProps) {
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
      {sub && <div className="text-xs text-white/25 mt-1">{sub}</div>}
    </div>
  )
}
