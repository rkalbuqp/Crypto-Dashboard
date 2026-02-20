import { useAsyncData } from 'nuxt/app'
import type { CryptoCoin } from '../types/crypto'

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

export const useCryptoMarkets = () =>
  useAsyncData<CryptoCoin[]>('crypto-markets', () =>
    $fetch('/api/crypto')
  )

export const useCryptoCoin = (id: string) =>
  useAsyncData<CryptoDetail>('crypto-coin', () =>
    $fetch('/api/crypto', { params: { id } })
  )
