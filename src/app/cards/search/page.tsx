'use client'

import Link from 'next/link'

export default function CardsSearchAliasPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Cards Search</h1>
        <p className="mt-2 text-sm text-gray-500">
          This route aliases to the main search experience.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-gray-600 mb-4">Proceed to the primary card search page.</p>
        <Link href="/trades/search" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go to Search
        </Link>
      </section>
    </main>
  )
}


