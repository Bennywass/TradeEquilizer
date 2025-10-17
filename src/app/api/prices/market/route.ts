import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple in-memory cache for price data (5-minute TTL)
const priceCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// GET /api/prices/market?itemId=uuid
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')?.trim()

    if (!itemId) {
      return NextResponse.json(
        { error: 'Missing required parameter: itemId' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `market:${itemId}`
    const cached = priceCache.get(cacheKey)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, max-age=60' },
      })
    }

    // Get item details from our catalog
    const supabase = await createClient()
    type ItemRow = {
      id: string
      name: string
      set_code: string
      collector_number: string
      tcgplayer_id: number | null
      scryfall_id: string | null
    }
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('id, name, set_code, collector_number, tcgplayer_id, scryfall_id')
      .eq('id', itemId)
      .single() as { data: ItemRow | null; error: { message: string } | null }

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found in catalog' },
        { status: 404 }
      )
    }

    // For now, return mock data until TCGplayer API keys are configured
    // TODO: Replace with actual TCGplayer Market API call
    const mockPrice = {
      itemId: item.id,
      name: item.name,
      set: item.set_code,
      collectorNumber: item.collector_number,
      source: 'tcgplayer_market',
      currency: 'USD',
      market: Math.round((Math.random() * 50 + 1) * 100) / 100, // $1-51
      low: Math.round((Math.random() * 40 + 0.5) * 100) / 100,
      high: Math.round((Math.random() * 60 + 2) * 100) / 100,
      conditionMultipliers: {
        NM: 1.0,
        LP: 0.9,
        MP: 0.75,
        HP: 0.5,
      },
      finishMultipliers: {
        normal: 1.0,
        foil: 1.5,
        etched: 1.3,
        showcase: 1.2,
      },
      asOf: new Date().toISOString(),
      version: 'mock-v1',
    }

    // Cache the result
    priceCache.set(cacheKey, { data: mockPrice, timestamp: now })

    return NextResponse.json(mockPrice, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Price lookup failed', details: String(e) },
      { status: 500 }
    )
  }
}
