'use client'

// src/components/SubscriptionForm.tsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'

// ⚠️ عدّل هذه القوائم لتطابق القيم المقبولة في الباك إند عندك
const CURRENCIES = ['USD', 'EUR', 'GBP', 'DZD']
const BILLING_CYCLES = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']
const CATEGORIES = [
  'ENTERTAINMENT',
  'MUSIC',
  'PRODUCTIVITY',
  'SOFTWARE',
  'EDUCATION',
  'HEALTH',
  'OTHER',
]

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  price: z.number({ invalid_type_error: 'Price is required' }).min(0, 'Must be 0 or more'),
  currency: z.string().min(1),
  billingCycle: z.string().min(1),
  startDate: z.string().min(1, 'Start date is required'),
  category: z.string().min(1),
  remindDaysBefore: z
    .number({ invalid_type_error: 'Required' })
    .int()
    .min(0, 'Min 0')
    .max(30, 'Max 30'),
  notifyEnabled: z.boolean(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export type SubscriptionFormValues = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<SubscriptionFormValues>
  onSubmit: (values: SubscriptionFormValues) => Promise<void> | void
  submitLabel?: string
}

// Pure Tailwind utility strings — no custom CSS classes needed
const field =
  'w-full rounded-none bg-transparent border-2 border-[#1db35a] px-4 py-3 text-[#1db35a] outline-none placeholder:text-[#1db35a]/50 focus:bg-[#1db35a]/5 transition-colors'
const label = 'block mb-2 text-xs uppercase tracking-[0.2em] text-[#1db35a]'
const errorText = 'mt-1 text-xs text-[#d6322e]'

export function SubscriptionForm({ defaultValues, onSubmit, submitLabel = 'Save' }: Props) {
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: 'USD',
      billingCycle: 'MONTHLY',
      category: 'OTHER',
      remindDaysBefore: 3,
      notifyEnabled: true,
      ...defaultValues,
    },
  })

  const submit = async (values: SubscriptionFormValues) => {
    setServerError('')
    try {
      await onSubmit(values)
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? err.response?.data?.message ?? 'Request failed'
          : 'Something went wrong'
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5 text-[#1db35a]" noValidate>
      {/* Name */}
      <div>
        <label className={label}>Name</label>
        <input {...register('name')} type="text" placeholder="Netflix" className={field} />
        {errors.name && <p className={errorText}>{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={label}>Description</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Optional notes"
          className={`${field} resize-none`}
        />
        {errors.description && <p className={errorText}>{errors.description.message}</p>}
      </div>

      {/* Price + Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price</label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="9.99"
            className={field}
          />
          {errors.price && <p className={errorText}>{errors.price.message}</p>}
        </div>
        <div>
          <label className={label}>Currency</label>
          <select {...register('currency')} className={`${field} appearance-none bg-[#f6f4ee]`}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Billing cycle + Start date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Billing cycle</label>
          <select
            {...register('billingCycle')}
            className={`${field} appearance-none bg-[#f6f4ee]`}
          >
            {BILLING_CYCLES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Start date</label>
          <input {...register('startDate')} type="date" className={field} />
          {errors.startDate && <p className={errorText}>{errors.startDate.message}</p>}
        </div>
      </div>

      {/* Category + Remind */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Category</label>
          <select {...register('category')} className={`${field} appearance-none bg-[#f6f4ee]`}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Remind days before</label>
          <input
            {...register('remindDaysBefore', { valueAsNumber: true })}
            type="number"
            min={0}
            max={30}
            className={field}
          />
          {errors.remindDaysBefore && (
            <p className={errorText}>{errors.remindDaysBefore.message}</p>
          )}
        </div>
      </div>

      {/* Notify toggle */}
      <label className="flex items-center gap-3 cursor-pointer text-sm uppercase tracking-[0.15em]">
        <input
          {...register('notifyEnabled')}
          type="checkbox"
          className="appearance-none w-6 h-6 shrink-0 rounded-none border-2 border-[#1db35a] bg-transparent checked:bg-[#1db35a] transition-colors cursor-pointer"
        />
        Enable renewal reminders
      </label>

      {/* Logo + Website */}
      <div>
        <label className={label}>Logo URL</label>
        <input
          {...register('logoUrl')}
          type="text"
          placeholder="https://…/logo.png"
          className={field}
        />
        {errors.logoUrl && <p className={errorText}>{errors.logoUrl.message}</p>}
      </div>

      <div>
        <label className={label}>Website URL</label>
        <input
          {...register('websiteUrl')}
          type="text"
          placeholder="https://netflix.com"
          className={field}
        />
        {errors.websiteUrl && <p className={errorText}>{errors.websiteUrl.message}</p>}
      </div>

      {serverError && (
        <div className="border-2 border-[#d6322e] px-4 py-3 text-sm text-[#d6322e]">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-none border-2 border-[#1db35a] bg-[#1db35a] py-3 text-sm uppercase tracking-[0.15em] text-[#f6f4ee] transition-opacity disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Saving…
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}