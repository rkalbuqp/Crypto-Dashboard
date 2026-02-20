import { getQuery } from 'h3'
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = typeof query.id === 'string' ? query.id : null
  const page = Number(query.page ?? 1) || 1

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

  const data = await $fetch<CryptoCoin[]>('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 20,
      page,
      sparkline: false,
      price_change_percentage: '24h'
    }
  })

  return data
})
