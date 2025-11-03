import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Configuration
const PRICE_CACHE_TTL_MS = parseInt(process.env.PRICE_CACHE_TTL_MINUTES || '5') * 60 * 1000
const PRICE_SOURCE = process.env.PRICE_SOURCE || 'mock'

// Simple in-memory cache for price data
const priceCache = new Map<string, { data: any; timestamp: number }>()

// Types
type ItemRow = {
  id: string
  name: string
  set_code: string
  collector_number: string
  tcgplayer_id: number | null
  scryfall_id: string | null
}

type PriceData = {
  itemId: string
  name: string
  set: string
  collectorNumber: string
  source: string
  currency: string
  market: number
  low: number
  high: number
  conditionMultipliers: {
    NM: number
    LP: number
    MP: number
    HP: number
  }
  finishMultipliers: {
    normal: number
    foil: number
    etched: number
    showcase: number
  }
  asOf: string
  version: string
}

// Mock price generator (for development)
function generateMockPrice(item: ItemRow): PriceData {
  // Generate more realistic prices based on card name patterns
  let basePrice = 1.0
  
  if (item.name.includes('Black Lotus')) basePrice = 25000
  else if (item.name.includes('Mox')) basePrice = 5000
  else if (item.name.includes('Dual Land') || item.name.includes('Underground Sea') || item.name.includes('Tropical Island')) basePrice = 400
  else if (item.name.includes('Jace') || item.name.includes('Liliana') || item.name.includes('Tarmogoyf')) basePrice = 50
  else if (item.name.includes('Snapcaster') || item.name.includes('Force of Will')) basePrice = 25
  else if (item.name.includes('Lightning Bolt')) basePrice = 0.5
  else if (item.name.includes('Counterspell') || item.name.includes('Shock')) basePrice = 0.25
  else basePrice = Math.random() * 10 + 0.1

  const market = Math.round(basePrice * 100) / 100
  const low = Math.round(market * 0.8 * 100) / 100
  const high = Math.round(market * 1.2 * 100) / 100

  return {
    itemId: item.id,
    name: item.name,
    set: item.set_code,
    collectorNumber: item.collector_number,
    source: 'mock_tcgplayer_market',
    currency: 'USD',
    market,
    low,
    high,
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
    version: 'mock-v2',
  }
}

// Future: TCGplayer API integration (when API access is available)
async function fetchTCGplayerPrice(item: ItemRow): Promise<PriceData> {
  // TODO: Implement actual TCGplayer API call
  // This would require API keys and proper authentication
  throw new Error('TCGplayer API not available - using mock data')
}

// Future: Scryfall pricing integration
async function fetchScryfallPrice(item: ItemRow): Promise<PriceData> {
  if (!item.scryfall_id) {
    throw new Error('No Scryfall ID available for this item')
  }

  try {
    const response = await fetch(`https://api.scryfall.com/cards/${item.scryfall_id}`)
    if (!response.ok) {
      throw new Error(`Scryfall API error: ${response.status}`)
    }

    const card = await response.json()
    const usdPrice = parseFloat(card.prices?.usd || '0')
    const usdFoilPrice = parseFloat(card.prices?.usd_foil || '0')

    if (usdPrice === 0 && usdFoilPrice === 0) {
      throw new Error('No pricing data available from Scryfall')
    }

    // Use foil price if available and higher, otherwise use regular price
    const market = usdFoilPrice > usdPrice ? usdFoilPrice : usdPrice
    const low = Math.round(market * 0.8 * 100) / 100
    const high = Math.round(market * 1.2 * 100) / 100

    return {
      itemId: item.id,
      name: item.name,
      set: item.set_code,
      collectorNumber: item.collector_number,
      source: 'scryfall_market',
      currency: 'USD',
      market,
      low,
      high,
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
      version: 'scryfall-v1',
    }
  } catch (error) {
    throw new Error(`Scryfall pricing failed: ${error}`)
  }
}

// Future: TCGAPIs integration
async function fetchTCGAPIsPrice(item: ItemRow): Promise<PriceData> {
  // TODO: Implement TCGAPIs.com integration
  // This is a third-party service that provides TCGplayer data
  throw new Error('TCGAPIs integration not implemented yet')
}

// Main price fetching function with fallback strategy
async function fetchPriceData(item: ItemRow, sourceOverride?: string): Promise<PriceData> {
  // Use override source if provided, otherwise use configured source
  const effectiveSource = sourceOverride || PRICE_SOURCE
  
  // Try sources in order of preference
  const sources = effectiveSource === 'mock' ? ['mock'] : [effectiveSource, 'scryfall', 'mock']
  
  for (const source of sources) {
    try {
      switch (source) {
        case 'tcgplayer':
          return await fetchTCGplayerPrice(item)
        case 'scryfall':
          return await fetchScryfallPrice(item)
        case 'tcgapis':
          return await fetchTCGAPIsPrice(item)
        case 'mock':
        default:
          return generateMockPrice(item)
      }
    } catch (error) {
      console.warn(`Price source ${source} failed for item ${item.id}:`, error)
      // Continue to next source
    }
  }
  
  // If all sources fail, return mock data as final fallback
  return generateMockPrice(item)
}

// GET /api/prices/market?itemId=uuid&source=scryfall
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')?.trim()
    const sourceOverride = searchParams.get('source')?.trim()

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

    if (cached && now - cached.timestamp < PRICE_CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { 
          'Cache-Control': 'public, max-age=60',
          'X-Price-Source': cached.data.source,
          'X-Price-Version': cached.data.version,
          'X-Cache-Hit': 'true'
        },
      })
    }

    // Get item details from our catalog
    const supabase = await createClient()
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

    // Fetch price data from configured source
    const priceData = await fetchPriceData(item, sourceOverride)

    // Cache the result
    priceCache.set(cacheKey, { data: priceData, timestamp: now })

    return NextResponse.json(priceData, {
      headers: { 
        'Cache-Control': 'public, max-age=60',
        'X-Price-Source': priceData.source,
        'X-Price-Version': priceData.version,
        'X-Cache-Hit': 'false'
      },
    })
  } catch (e) {
    console.error('Price lookup failed:', e)
    return NextResponse.json(
      { error: 'Price lookup failed', details: String(e) },
      { status: 500 }
    )
  }
}