'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  inventoryCount: number
  wantsCount: number
  recentTrades: number
  totalTradeValue: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    inventoryCount: 0,
    wantsCount: 0,
    recentTrades: 0,
    totalTradeValue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch inventory count
        try {
          const invResponse = await fetch('/api/inventory')
          if (invResponse.ok) {
            const invData = await invResponse.json()
            setStats(prev => ({ ...prev, inventoryCount: invData.data?.length || 0 }))
          }
        } catch (err) {
          // API not available yet
        }

        // Fetch wants count
        try {
          const wantsResponse = await fetch('/api/wants')
          if (wantsResponse.ok) {
            const wantsData = await wantsResponse.json()
            setStats(prev => ({ ...prev, wantsCount: wantsData.data?.length || 0 }))
          }
        } catch (err) {
          // API not available yet
        }

        // Other stats would come from trade endpoints
        // For now, we'll use placeholders
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  const quickActions = [
    {
      title: 'Search Cards',
      description: 'Find cards to add to your collection',
      href: '/trades/search',
      icon: '🔍',
      color: 'bg-blue-500',
    },
    {
      title: 'My Inventory',
      description: 'Manage your card collection',
      href: '/inventory',
      icon: '📦',
      color: 'bg-green-500',
    },
    {
      title: 'Want List',
      description: 'Cards you\'re looking for',
      href: '/wants',
      icon: '⭐',
      color: 'bg-yellow-500',
    },
    {
      title: 'Trade Builder',
      description: 'Build and evaluate trades',
      href: '/trades/builder',
      icon: '🤝',
      color: 'bg-purple-500',
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              Manage your collection, build trades, and discover new cards.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Inventory Items</p>
                    {isLoading ? (
                      <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className="mt-1 text-2xl font-bold">{stats.inventoryCount}</p>
                    )}
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Want List Items</p>
                    {isLoading ? (
                      <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className="mt-1 text-2xl font-bold">{stats.wantsCount}</p>
                    )}
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Recent Trades</p>
                    {isLoading ? (
                      <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className="mt-1 text-2xl font-bold">{stats.recentTrades}</p>
                    )}
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <span className="text-2xl">🤝</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Trade Value</p>
                    {isLoading ? (
                      <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className="mt-1 text-2xl font-bold">
                        ${stats.totalTradeValue.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Card
                  key={action.href}
                  className="cursor-pointer transition hover:shadow-lg"
                  onClick={() => router.push(action.href)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                      <div className={`${action.color} rounded-full p-4 text-3xl`}>
                        {action.icon}
                      </div>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          {(stats.inventoryCount === 0 || stats.wantsCount === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.inventoryCount === 0 && (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-semibold">Add items to your inventory</h4>
                        <p className="text-sm text-gray-600">
                          Start by adding cards you own and want to trade.
                        </p>
                      </div>
                      <Button onClick={() => router.push('/inventory')}>
                        Go to Inventory
                      </Button>
                    </div>
                  )}
                  {stats.wantsCount === 0 && (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-semibold">Create your want list</h4>
                        <p className="text-sm text-gray-600">
                          Add cards you're looking for to help find trade matches.
                        </p>
                      </div>
                      <Button onClick={() => router.push('/wants')}>
                        Go to Want List
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Authentication Status */}
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Account Status</p>
                      <p className="text-sm text-gray-600">
                        Signed in as {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    Free Tier
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
