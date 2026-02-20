type CryptoMarket = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

export const useCryptoMarkets = () =>
  useAsyncData<CryptoMarket[]>('crypto-markets', () =>
    $fetch('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    })
  )

