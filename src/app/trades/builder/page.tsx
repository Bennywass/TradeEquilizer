'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface TradeItem {
  id: string
  itemId: string
  itemName: string
  itemSet: string
  itemCollectorNumber: string
  itemImageUrl?: string
  quantity: number
  condition: 'NM' | 'LP' | 'MP' | 'HP'
  finish: 'normal' | 'foil' | 'etched' | 'showcase'
  price?: number
}

interface TradeTotals {
  leftTotal: number
  rightTotal: number
  difference: number
  isEqual: boolean
}

interface EqualizerSuggestion {
  itemId: string
  itemName: string
  itemSet: string
  itemImageUrl?: string
  suggestedPrice: number
  suggestedSide: 'left' | 'right'
}

export default function TradeBuilderPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [leftItems, setLeftItems] = useState<TradeItem[]>([])
  const [rightItems, setRightItems] = useState<TradeItem[]>([])
  const [totals, setTotals] = useState<TradeTotals>({
    leftTotal: 0,
    rightTotal: 0,
    difference: 0,
    isEqual: false,
  })
  const [suggestions, setSuggestions] = useState<EqualizerSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addToSide, setAddToSide] = useState<'left' | 'right'>('left')
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate totals when items change
  useEffect(() => {
    const calculateTotals = async () => {
      try {
        const leftTotal = await calculateSideTotal(leftItems)
        const rightTotal = await calculateSideTotal(rightItems)
        const difference = Math.abs(leftTotal - rightTotal)
        const isEqual = difference < 0.01 // Consider equal if within 1 cent

        setTotals({
          leftTotal,
          rightTotal,
          difference,
          isEqual,
        })

        // Fetch equalizer suggestions if there's a significant difference
        if (difference > 1) {
          await fetchSuggestions(leftTotal, rightTotal)
        } else {
          setSuggestions([])
        }
      } catch (err) {
        console.error('Error calculating totals:', err)
      }
    }

    calculateTotals()
  }, [leftItems, rightItems])

  const calculateSideTotal = async (items: TradeItem[]): Promise<number> => {
    let total = 0
    for (const item of items) {
      if (item.price) {
        total += item.price * item.quantity
      } else {
        // Fetch price if not available
        try {
          const price = await fetchItemPrice(item.itemId, item.condition, item.finish)
          total += price * item.quantity
          // Update item with price
          if (addToSide === 'left') {
            setLeftItems(items.map(i => i.id === item.id ? { ...i, price } : i))
          } else {
            setRightItems(items.map(i => i.id === item.id ? { ...i, price } : i))
          }
        } catch (err) {
          console.warn('Failed to fetch price for item:', item.itemId)
        }
      }
    }
    return total
  }

  const fetchItemPrice = async (
    itemId: string,
    condition: 'NM' | 'LP' | 'MP' | 'HP',
    finish: 'normal' | 'foil' | 'etched' | 'showcase'
  ): Promise<number> => {
    try {
      const response = await fetch(`/api/prices/market?itemId=${itemId}`)
      if (!response.ok) throw new Error('Failed to fetch price')

      const priceData = await response.json()
      const basePrice = priceData.market || 0
      
      // Apply condition multiplier
      const conditionMultiplier = priceData.conditionMultipliers?.[condition] || 1.0
      // Apply finish multiplier
      const finishMultiplier = priceData.finishMultipliers?.[finish] || 1.0

      return basePrice * conditionMultiplier * finishMultiplier
    } catch (err) {
      console.warn('Price fetch failed:', err)
      return 0
    }
  }

  const fetchSuggestions = async (leftTotal: number, rightTotal: number) => {
    try {
      const response = await fetch('/api/trades/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leftItems: leftItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            condition: item.condition,
            finish: item.finish,
          })),
          rightItems: rightItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            condition: item.condition,
            finish: item.finish,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (err) {
      // API not available yet - silently fail
      console.warn('Suggestions API not available:', err)
    }
  }

  const handleAddItem = async () => {
    if (!searchQuery.trim()) {
      setError('Please search for a card')
      return
    }

    // For now, create a placeholder item
    // In production, this would search and select from actual cards
    const newItem: TradeItem = {
      id: `temp-${Date.now()}`,
      itemId: searchQuery, // Placeholder
      itemName: searchQuery, // Placeholder - will be replaced with actual card name
      itemSet: '',
      itemCollectorNumber: '',
      quantity: 1,
      condition: 'NM',
      finish: 'normal',
    }

    if (addToSide === 'left') {
      setLeftItems([...leftItems, newItem])
    } else {
      setRightItems([...rightItems, newItem])
    }

    setIsAddModalOpen(false)
    setSearchQuery('')
  }

  const handleRemoveItem = (id: string, side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftItems(leftItems.filter(item => item.id !== id))
    } else {
      setRightItems(rightItems.filter(item => item.id !== id))
    }
  }

  const handleUpdateQuantity = (id: string, side: 'left' | 'right', quantity: number) => {
    if (side === 'left') {
      setLeftItems(leftItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ))
    } else {
      setRightItems(rightItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ))
    }
  }

  const handleAddSuggestion = (suggestion: EqualizerSuggestion) => {
    const newItem: TradeItem = {
      id: `temp-${Date.now()}`,
      itemId: suggestion.itemId,
      itemName: suggestion.itemName,
      itemSet: suggestion.itemSet,
      itemCollectorNumber: '',
      itemImageUrl: suggestion.itemImageUrl,
      quantity: 1,
      condition: 'NM',
      finish: 'normal',
      price: suggestion.suggestedPrice,
    }

    if (suggestion.suggestedSide === 'left') {
      setLeftItems([...leftItems, newItem])
    } else {
      setRightItems([...rightItems, newItem])
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Trade Builder</h1>
            <p className="mt-2 text-sm text-gray-500">
              Assemble and evaluate trades in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/trades/search')}>
              Search Cards
            </Button>
            <Button variant="outline" onClick={() => router.push('/inventory')}>
              My Inventory
            </Button>
          </div>
        </header>

        {/* Totals Display */}
        <section className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Your Side</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totals.leftTotal)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Their Side</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totals.rightTotal)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Difference</div>
                  <div
                    className={`text-2xl font-bold ${
                      totals.isEqual
                        ? 'text-green-600'
                        : totals.difference < 5
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(totals.difference)}
                  </div>
                  {totals.isEqual && (
                    <div className="mt-1 text-xs text-green-600">✓ Trade is equal!</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Equalizer Suggestions */}
        {suggestions.length > 0 && (
          <section className="mb-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-3 text-lg font-semibold">Equalizer Suggestions</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.slice(0, 6).map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {suggestion.itemImageUrl && (
                          <img
                            src={suggestion.itemImageUrl}
                            alt={suggestion.itemName}
                            className="h-12 w-12 rounded object-contain"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium">{suggestion.itemName}</div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(suggestion.suggestedPrice)}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddSuggestion(suggestion)}
                      >
                        Add to {suggestion.suggestedSide === 'left' ? 'Your Side' : 'Their Side'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Trade Panes */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Side</h2>
              <Button
                size="sm"
                onClick={() => {
                  setAddToSide('left')
                  setIsAddModalOpen(true)
                }}
              >
                Add Card
              </Button>
            </div>
            <div className="space-y-3">
              {leftItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 mb-4">No items added yet</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setAddToSide('left')
                        setIsAddModalOpen(true)
                      }}
                    >
                      Add Your First Card
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                leftItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {item.itemImageUrl && (
                          <img
                            src={item.itemImageUrl}
                            alt={item.itemName}
                            className="h-20 w-20 rounded object-contain bg-gray-50"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.itemName}</div>
                          <div className="text-sm text-gray-500">
                            {item.itemSet && `${item.itemSet} • `}#{item.itemCollectorNumber || 'N/A'}
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm">Qty:</label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(item.id, 'left', parseInt(e.target.value) || 1)
                                }
                                className="w-16"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.condition} • {item.finish}
                            </div>
                            {item.price && (
                              <div className="text-sm font-medium text-blue-600">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, 'left')}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Side */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Their Side</h2>
              <Button
                size="sm"
                onClick={() => {
                  setAddToSide('right')
                  setIsAddModalOpen(true)
                }}
              >
                Add Card
              </Button>
            </div>
            <div className="space-y-3">
              {rightItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 mb-4">No items added yet</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setAddToSide('right')
                        setIsAddModalOpen(true)
                      }}
                    >
                      Add Their First Card
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                rightItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {item.itemImageUrl && (
                          <img
                            src={item.itemImageUrl}
                            alt={item.itemName}
                            className="h-20 w-20 rounded object-contain bg-gray-50"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.itemName}</div>
                          <div className="text-sm text-gray-500">
                            {item.itemSet && `${item.itemSet} • `}#{item.itemCollectorNumber || 'N/A'}
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm">Qty:</label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(item.id, 'right', parseInt(e.target.value) || 1)
                                }
                                className="w-16"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.condition} • {item.finish}
                            </div>
                            {item.price && (
                              <div className="text-sm font-medium text-purple-600">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, 'right')}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Add Card Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setSearchQuery('')
          }}
          title={`Add Card to ${addToSide === 'left' ? 'Your Side' : 'Their Side'}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Note: Full card search integration will be available once the backend API is implemented.
                For now, you can test the form structure.
              </p>
              <Input
                label="Search for Card"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter card name..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setSearchQuery('')
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Card</Button>
            </div>
          </div>
        </Modal>
      </main>
    </ProtectedRoute>
  )
}
