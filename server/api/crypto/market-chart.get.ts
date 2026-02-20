import { getQuery, createError } from 'h3'
import type { MarketChart } from '../../../types/crypto'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = typeof query.id === 'string' ? query.id : null
  const days = typeof query.days === 'string' ? query.days : '1'

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id parameter'
    })
  }

  const data = await $fetch<MarketChart>(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
    {
      params: {
        vs_currency: 'usd',
        days
      }
    }
  )

  return data
})

