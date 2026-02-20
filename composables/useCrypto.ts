import { useAsyncData } from 'nuxt/app'
import type { CryptoDetail, CryptoMarket } from '../types/crypto'

export const useCryptoMarkets = () =>
  useAsyncData<CryptoMarket[]>('crypto-markets', () =>
    $fetch('/api/crypto')
  )

export const useCryptoCoin = (id: string) =>
  useAsyncData<CryptoDetail>('crypto-coin', () =>
    $fetch('/api/crypto', { params: { id } })
  )
