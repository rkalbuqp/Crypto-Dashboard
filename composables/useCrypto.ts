import { ref, watch } from 'vue'
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
  const coins = ref<CryptoCoin[]>([])

  const { data, pending, error, refresh } = useFetch<CryptoCoin[]>(
    () => `/api/crypto?page=${page.value}`
  )

  watch(
    data,
    (newPage) => {
      if (!newPage) {
        return
      }

      if (page.value === 1) {
        coins.value = newPage
        return
      }

      const existingIds = new Set(coins.value.map((coin) => coin.id))
      const merged = [...coins.value, ...newPage.filter((coin) => !existingIds.has(coin.id))]

      coins.value = merged
    },
    { immediate: true }
  )

  const nextPage = () => {
    page.value++
    refresh()
  }

  return {
    data,
    coins,
    page,
    pending,
    error,
    nextPage
  }
}

export const useCryptoCoin = (id: string) =>
  useAsyncData<CryptoDetail>('crypto-coin', () =>
    $fetch('/api/crypto', { params: { id } })
  )
