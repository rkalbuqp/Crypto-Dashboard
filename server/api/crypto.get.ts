import { createError, getQuery } from 'h3'
import type { CryptoCoin } from '../../types/crypto'

type CryptoDetail = {
  id: string
  symbol: string
  name: string
  image: {
    large: string
  }
  description: {
    en: string
  }
  market_data: {
    current_price: {
      usd: number
    }
    price_change_percentage_24h: number
    market_cap: {
      usd: number
    }
    total_volume: {
      usd: number
    }
  }
}

type ListCacheEntry = {
  data: CryptoCoin[]
  timestamp: number
}

const LIST_CACHE_TTL_MS = 60_000
const listCache = new Map<string, ListCacheEntry>()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = typeof query.id === 'string' ? query.id : null
  const page = Number(query.page ?? 1) || 1
  const category = typeof query.category === 'string' ? query.category : null

  if (id) {
    const data = await $fetch<CryptoDetail>(`https://api.coingecko.com/api/v3/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    })

    return data
  }

  const cacheKey = `${page}-${category ?? 'all'}`
  const cached = listCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < LIST_CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const data = await $fetch<CryptoCoin[]>('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page,
        sparkline: false,
        price_change_percentage: '24h',
        ...(category ? { category } : {})
      }
    })

    listCache.set(cacheKey, { data, timestamp: Date.now() })

    return data
  } catch (error: any) {
    if (error?.statusCode === 429) {
      if (cached) {
        return cached.data
      }

      throw createError({
        statusCode: 503,
        statusMessage: 'Rate limit da CoinGecko atingido. Tente novamente em alguns minutos.'
      })
    }

    throw error
  }
})
