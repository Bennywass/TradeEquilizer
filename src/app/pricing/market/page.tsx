'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function MarketPricingPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Market Pricing</h1>
          <p className="mt-2 text-sm text-gray-500">View and sync current market prices.</p>
        </header>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-gray-600">Coming soon: price charts, last sync status, and manual refresh.</p>
        </section>
      </main>
    </ProtectedRoute>
  )
}


