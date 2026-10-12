// src/app/page.tsx

import Link from 'next/link'
import type { CSSProperties } from 'react'

const GREEN = '#1db35a'
const CREAM = '#f6f4ee'

// Diagonal hatch pattern (like the striped blocks in the poster)
const hatch: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(45deg, ${GREEN} 0 1.5px, transparent 1.5px 6px)`,
}

// Square grid pattern (like the cell grid in the poster)
const grid: CSSProperties = {
  backgroundImage: `linear-gradient(${GREEN} 2px, transparent 2px), linear-gradient(90deg, ${GREEN} 2px, transparent 2px)`,
  backgroundSize: '72px 72px',
  backgroundPosition: '-1px -1px',
}

export default function LandingPage() {
  return (
    <main
      className="min-h-screen w-full flex font-light"
      style={{ backgroundColor: CREAM, color: GREEN }}
    >
      <div
        className="w-full min-h-screen flex flex-col border-2"
        style={{ borderColor: GREEN, backgroundColor: CREAM }}
      >
        {/* ROW 1 — headline + tag */}
        <section className="grid grid-cols-12 border-b-2" style={{ borderColor: GREEN }}>
          <div
            className="col-span-12 md:col-span-8 p-6 md:p-8 md:border-r-2"
            style={{ borderColor: GREEN }}
          >
            <p className="text-sm tracking-[0.2em] uppercase mb-4">SubTrack — 01</p>
            <h1 className="text-5xl md:text-7xl uppercase leading-[0.95] tracking-tight">
              All your
              <br />
              subscriptions
              <br />
              in one place
            </h1>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col">
            <div
              className="flex items-center justify-center py-5 border-t-2 md:border-t-0 border-b-2 text-sm md:text-base tracking-[0.2em] uppercase text-center px-4"
              style={{ borderColor: GREEN }}
            >
              Stop forgetting renewals
            </div>
            <div className="flex-1 min-h-[80px]" style={hatch} />
          </div>
        </section>

        {/* ROW 2 — grid strip */}
        <div className="h-[72px] border-b-2" style={{ ...grid, borderColor: GREEN }} />

        {/* ROW 3 — hatched block + content box */}
        <section className="grid grid-cols-12 flex-1 border-b-2" style={{ borderColor: GREEN }}>
          <div
            className="hidden md:block md:col-span-4 min-h-[280px] border-r-2"
            style={{ ...hatch, borderColor: GREEN }}
          />

          <div className="col-span-12 md:col-span-8 flex flex-col">
            <div
              className="p-6 md:p-8 border-b-2"
              style={{ borderColor: GREEN, backgroundColor: CREAM }}
            >
              <p className="text-2xl md:text-4xl uppercase leading-tight tracking-tight mb-8">
                SubTrack reminds you before every renewal — so you only pay for what you
                actually use.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="px-8 py-3 border-2 uppercase tracking-[0.15em] text-sm transition-colors"
                  style={{ borderColor: GREEN, backgroundColor: GREEN, color: CREAM }}
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 border-2 uppercase tracking-[0.15em] text-sm transition-colors hover:bg-[#1db35a] hover:text-[#f6f4ee]"
                  style={{ borderColor: GREEN, color: GREEN }}
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="flex-1 min-h-[72px]" style={grid} />
          </div>
        </section>

        {/* ROW 4 — stats as grid cells */}
        <section className="grid grid-cols-3">
          {[
            { value: '$240', label: 'Avg. saved yearly' },
            { value: '48h', label: 'Reminder window' },
            { value: '∞', label: 'Subscriptions tracked' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`p-5 md:p-8 ${i < 2 ? 'border-r-2' : ''}`}
              style={{ borderColor: GREEN }}
            >
              <div className="text-4xl md:text-6xl tracking-tight mb-2">{s.value}</div>
              <div className="text-xs md:text-sm uppercase tracking-[0.15em]">{s.label}</div>
            </div>
          ))}
        </section>

        {/* FOOTER — small logo box like "DE SCHOOL" */}
        <div className="flex justify-end p-4 md:p-6 border-t-2" style={{ borderColor: GREEN }}>
          <div className="grid grid-cols-2 border-2 w-36" style={{ borderColor: GREEN }}>
            <div className="p-2 text-sm uppercase border-r-2" style={{ borderColor: GREEN }}>
              Sub
            </div>
            <div />
            <div
              className="col-span-2 p-2 text-sm uppercase border-t-2"
              style={{ borderColor: GREEN }}
            >
              Track
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}