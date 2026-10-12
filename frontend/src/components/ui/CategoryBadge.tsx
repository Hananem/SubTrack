// src/components/ui/CategoryBadge.tsx

import { SubscriptionCategory } from '@/types'
import { cn } from '@/lib/utils'

const CONFIG: Record<SubscriptionCategory, { label: string; color: string }> = {
  STREAMING:    { label: 'Streaming',    color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  PRODUCTIVITY: { label: 'Productivity', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  DEVELOPMENT:  { label: 'Development',  color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  GAMING:       { label: 'Gaming',       color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  CLOUD:        { label: 'Cloud',        color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  FITNESS:      { label: 'Fitness',      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  NEWS:         { label: 'News',         color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  EDUCATION:    { label: 'Education',    color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  OTHER:        { label: 'Other',        color: 'bg-white/[0.05] text-white/40 border-white/10' },
}

interface Props {
  category: SubscriptionCategory
  className?: string
}

export function CategoryBadge({ category, className }: Props) {
  const { label, color } = CONFIG[category] ?? CONFIG.OTHER
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
        color,
        className,
      )}
    >
      {label}
    </span>
  )
}
