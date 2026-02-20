export interface CryptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
}

export interface MarketChart {
  prices: [number, number][]
}

export interface CryptoCategory {
  category_id: string
  name: string
}
