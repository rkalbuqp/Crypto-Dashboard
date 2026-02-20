import type { H3Event } from 'h3'

type ExchangeResponse = {
  rates: {
    BRL: number
  }
}

type FiatRates = {
  usdToBrl: number
}

export default defineEventHandler(async (_event: H3Event): Promise<FiatRates> => {
  const data = await $fetch<ExchangeResponse>('https://api.exchangerate.host/latest', {
    params: {
      base: 'USD',
      symbols: 'BRL'
    }
  })

  return {
    usdToBrl: data.rates.BRL
  }
})

