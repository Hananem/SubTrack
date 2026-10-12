'use client'

// src/app/(auth)/register/page.tsx

import { useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/context/auth.context'
import { Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'

const GREEN = '#1db35a'
const CREAM = '#f6f4ee'
const ERROR = '#d6322e'

const hatch: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(45deg, ${GREEN} 0 1.5px, transparent 1.5px 6px)`,
}

const grid: CSSProperties = {
  backgroundImage: `linear-gradient(${GREEN} 2px, transparent 2px), linear-gradient(90deg, ${GREEN} 2px, transparent 2px)`,
  backgroundSize: '72px 72px',
  backgroundPosition: '-1px -1px',
}

const inputClass =
  'w-full bg-transparent border-2 px-4 py-3 outline-none placeholder:text-[#1db35a]/50 focus:bg-[#1db35a]/5 transition-colors'

const labelClass = 'block text-xs uppercase tracking-[0.2em] mb-2'

const schema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/[0-9]/, 'Needs a number'),
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    try {
      await registerUser(values.name, values.email, values.password)
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? err.response?.data?.message ?? 'Registration failed'
          : 'Something went wrong'
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg)
    }
  }

  return (
    <main
      className="min-h-screen w-full flex font-light"
      style={{ backgroundColor: CREAM, color: GREEN }}
    >
      <div
        className="w-full min-h-screen flex flex-col border-2"
        style={{ borderColor: GREEN }}
      >
        {/* ROW 1 — title + tag */}
        <section className="grid grid-cols-12 border-b-2" style={{ borderColor: GREEN }}>
          <div
            className="col-span-12 md:col-span-8 p-6 md:p-8 md:border-r-2"
            style={{ borderColor: GREEN }}
          >
            <p className="text-sm tracking-[0.2em] uppercase mb-4">
              SubTrack — Start tracking in seconds
            </p>
            <h1 className="text-5xl md:text-7xl uppercase leading-[0.95] tracking-tight">
              Create
              <br />
              account
            </h1>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col">
            <Link
              href="/"
              className="flex items-center justify-center py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase hover:bg-[#1db35a] hover:text-[#f6f4ee] transition-colors"
              style={{ borderColor: GREEN }}
            >
              ← SubTrack
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 max-w-xl"
                noValidate
              >
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Ahmed Benali"
                    className={inputClass}
                    style={{ borderColor: GREEN }}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-xs mt-1" style={{ color: ERROR }}>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    style={{ borderColor: GREEN }}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-xs mt-1" style={{ color: ERROR }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Min. 8 chars with uppercase & number"
                    className={inputClass}
                    style={{ borderColor: GREEN }}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="text-xs mt-1" style={{ color: ERROR }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <div
                    className="border-2 px-4 py-3 text-sm"
                    style={{ borderColor: ERROR, color: ERROR }}
                  >
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 border-2 uppercase tracking-[0.15em] text-sm transition-opacity disabled:opacity-60"
                  style={{ borderColor: GREEN, backgroundColor: GREEN, color: CREAM }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating account…
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="text-sm uppercase tracking-[0.15em] mt-6">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="flex-1 min-h-[72px]" style={grid} />
          </div>
        </section>
      </div>
    </main>
  )
}