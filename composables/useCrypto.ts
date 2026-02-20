import { ref } from 'vue'
import { useAsyncData, useFetch } from 'nuxt/app'
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

export const useCrypto = () => {
  const page = ref(1)

  const { data, pending, error, refresh } = useFetch<CryptoCoin[]>(
    () => `/api/crypto?page=${page.value}`
  )

  const nextPage = () => {
    page.value++
    refresh()
  }

  return {
    data,
    pending,
    error,
    nextPage
  }
}

export const useCryptoCoin = (id: string) =>
  useAsyncData<CryptoDetail>('crypto-coin', () =>
    $fetch('/api/crypto', { params: { id } })
  )
