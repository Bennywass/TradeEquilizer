'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function TradeBuilderPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Trade Builder</h1>
          <p className="mt-2 text-sm text-gray-500">Assemble and evaluate trades in real-time.</p>
        </header>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-gray-600">Coming soon: left/right trade panes, totals, and equalizer suggestions.</p>
        </section>
      </main>
    </ProtectedRoute>
  )
}


