'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile-first header */}
      <header className="safe-area-inset bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                TradeEqualizer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            MTG Trading Made Fair and Fast
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with other players, match your want lists with their inventory, 
            and make fair trades based on real market prices.
          </p>
        </div>

        {/* Quick Navigation - shown when signed in */}
        {user && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <Link href="/dashboard" className="card p-4 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</div>
              </Link>
              <Link href="/trades/search" className="card p-4 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Search</div>
              </Link>
              <Link href="/trades/builder" className="card p-4 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-2xl mb-2">⚖️</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Trade Builder</div>
              </Link>
              <Link href="/inventory" className="card p-4 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Inventory</div>
              </Link>
              <Link href="/wants" className="card p-4 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-2xl mb-2">❤️</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Want List</div>
              </Link>
            </div>
            <div className="mt-4 text-center">
              <Link href="/pricing/market" className="inline-block card p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-xl">💰</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Market Pricing</div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Feature cards - mobile-first grid */}
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${user ? 'mt-12' : 'mt-12'}`}>
          {user ? (
            <Link href="/trades/builder" className="card p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                QR Code Trading
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Scan a QR code to instantly connect and start trading with other players.
              </p>
            </Link>
          ) : (
            <div className="card p-6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                QR Code Trading
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Scan a QR code to instantly connect and start trading with other players.
              </p>
            </div>
          )}

          {user ? (
            <Link href="/wants" className="card p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered algorithm finds the best trades based on your want lists and inventory.
              </p>
            </Link>
          ) : (
            <div className="card p-6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered algorithm finds the best trades based on your want lists and inventory.
              </p>
            </div>
          )}

          {user ? (
            <Link href="/pricing/market" className="card p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Fair Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time market prices from TCGplayer ensure every trade is fair and balanced.
              </p>
            </Link>
          ) : (
            <div className="card p-6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Fair Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time market prices from TCGplayer ensure every trade is fair and balanced.
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            {user ? (
              <Link href="/dashboard" className="btn-primary touch-target">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary touch-target">
                Get Started
              </Link>
            )}
            <button className="touch-target px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Mobile navigation - shown when signed in */}
      {user && (
        <nav className="mobile-nav p-4 sm:hidden bg-white dark:bg-gray-900 border-t">
          <div className="flex justify-around">
            <Link href="/inventory" className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" />
              </svg>
              <span className="text-xs">Inventory</span>
            </Link>
            <Link href="/wants" className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">Wants</span>
            </Link>
            <Link href="/trades/search" className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs">Search</span>
            </Link>
            <Link href="/trades/builder" className="flex flex-col items-center space-y-1 text-blue-600 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-xs">Trade</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-xs">Home</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}