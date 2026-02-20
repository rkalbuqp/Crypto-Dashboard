import { getQuery } from 'h3'
import type { CryptoDetail, CryptoMarket } from '../../types/crypto'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = typeof query.id === 'string' ? query.id : null

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

  const data = await $fetch<CryptoMarket[]>('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 20,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    }
  })

  return data
})

