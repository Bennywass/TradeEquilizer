'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function WantListPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Want List</h1>
          <p className="mt-2 text-sm text-gray-500">Track the cards you are looking for.</p>
        </header>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-gray-600">Coming soon: add/remove wants and sync with trade builder.</p>
        </section>
      </main>
    </ProtectedRoute>
  )
}


