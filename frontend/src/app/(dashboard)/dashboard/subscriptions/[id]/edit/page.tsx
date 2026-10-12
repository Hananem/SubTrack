'use client'

// src/app/(dashboard)/dashboard/subscriptions/[id]/edit/page.tsx

import type { CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { SubscriptionForm, SubscriptionFormValues } from '@/components/SubscriptionForm'
import { useSubscription, useUpdateSubscription } from '@/hooks/useSubscriptions'

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

export default function EditSubscriptionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: sub, isLoading } = useSubscription(Number(id))
  const { mutateAsync: update } = useUpdateSubscription()

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center border-2"
        style={{ backgroundColor: CREAM, color: GREEN, borderColor: GREEN }}
      >
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (!sub) return null

  const handleSubmit = async (values: SubscriptionFormValues) => {
    await update({
      id: sub.id,
      payload: {
        name: values.name,
        description: values.description,
        price: values.price,
        currency: values.currency,
        billingCycle: values.billingCycle,
        startDate: values.startDate,
        category: values.category,
        remindDaysBefore: values.remindDaysBefore,
        notifyEnabled: values.notifyEnabled,
        logoUrl: values.logoUrl || undefined,
        websiteUrl: values.websiteUrl || undefined,
      } as any,
    })
    router.push('/dashboard/subscriptions')
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col border-2 font-light"
      style={{ backgroundColor: CREAM, color: GREEN, borderColor: GREEN }}
    >
      {/* ROW 1 — title + back */}
      <section className="grid grid-cols-12 border-b-2" style={{ borderColor: GREEN }}>
        <div
          className="col-span-12 md:col-span-8 p-6 md:p-8 md:border-r-2"
          style={{ borderColor: GREEN }}
        >
          <p className="text-sm tracking-[0.2em] uppercase mb-4">
            Update the details for {sub.name}
          </p>
          <h1 className="text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight">
            Edit
            <br />
            subscription
          </h1>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col">
          <Link
            href="/dashboard/subscriptions"
            className="flex items-center justify-center gap-2 py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase hover:bg-[#1db35a] hover:text-[#f6f4ee] transition-colors"
            style={{ borderColor: GREEN }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex-1 min-h-[80px]" style={hatch} />
        </div>
      </section>

      {/* ROW 2 — grid strip */}
      <div className="h-[72px] border-b-2" style={{ ...grid, borderColor: GREEN }} />

      {/* ROW 3 — hatched block + form */}
      <section className="grid grid-cols-12 flex-1">
        <div
          className="hidden md:block md:col-span-4 min-h-[280px] border-r-2"
          style={{ ...hatch, borderColor: GREEN }}
        />

        <div className="col-span-12 md:col-span-8 flex flex-col">
          <div
            className="p-6 md:p-8 border-b-2"
            style={{ borderColor: GREEN, backgroundColor: CREAM }}
          >
            <div className="max-w-xl">
              <SubscriptionForm
                defaultValues={{
                  name: sub.name,
                  description: sub.description,
                  price: sub.price,
                  currency: sub.currency,
                  billingCycle: sub.billingCycle,
                  startDate: format(new Date(sub.startDate), 'yyyy-MM-dd'),
                  category: sub.category,
                  remindDaysBefore: sub.remindDaysBefore,
                  notifyEnabled: sub.notifyEnabled,
                  logoUrl: sub.logoUrl ?? '',
                  websiteUrl: sub.websiteUrl ?? '',
                }}
                onSubmit={handleSubmit}
                submitLabel="Save Changes"
              />
            </div>
          </div>

          <div className="flex-1 min-h-[72px]" style={grid} />
        </div>
      </section>
    </div>
  )
}