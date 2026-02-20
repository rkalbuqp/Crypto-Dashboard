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
  const category = ref<string | null>(null)
  const hasMore = ref(true)

  const { data, pending, error, refresh } = useFetch<CryptoCoin[]>(
    () => {
      const params = new URLSearchParams()
      params.set('page', String(page.value))

      if (category.value) {
        params.set('category', category.value)
      }

      return `/api/crypto?${params.toString()}`
    }
  )

  watch(
    data,
    (newPage) => {
      if (!newPage) {
        return
      }

      if (page.value === 1) {
        coins.value = newPage
        hasMore.value = newPage.length > 0
        return
      }

      const existingIds = new Set(coins.value.map((coin) => coin.id))
      const merged = [...coins.value, ...newPage.filter((coin) => !existingIds.has(coin.id))]

      coins.value = merged
      if (newPage.length === 0) {
        hasMore.value = false
      }
    },
    { immediate: true }
  )

  const setCategory = (value: string | null) => {
    category.value = value
    page.value = 1
    coins.value = []
    hasMore.value = true
    refresh()
  }

  const nextPage = () => {
    page.value++
    refresh()
  }

  return {
    data,
    coins,
    page,
    category,
    pending,
    error,
    setCategory,
    nextPage,
    hasMore
  }
}

export const useCryptoCoin = (id: string) =>
  useAsyncData<CryptoDetail>('crypto-coin', () =>
    $fetch('/api/crypto', { params: { id } })
  )
