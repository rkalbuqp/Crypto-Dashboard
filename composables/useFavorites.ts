import { onMounted, watch } from 'vue'
import { useState } from 'nuxt/app'
import type { CryptoCoin } from '../types/crypto'

const STORAGE_KEY = 'favorites'

export const useFavorites = () => {
  const favorites = useState<CryptoCoin[]>(STORAGE_KEY, () => [])

  onMounted(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)

      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored) as CryptoCoin[]

      if (Array.isArray(parsed)) {
        favorites.value = parsed
      }
    } catch {
      favorites.value = []
    }
  })

  watch(
    favorites,
    (value) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  const isFavorite = (id: string) => favorites.value.some((coin) => coin.id === id)

  const toggleFavorite = (coin: CryptoCoin) => {
    if (isFavorite(coin.id)) {
      favorites.value = favorites.value.filter((item: CryptoCoin) => item.id !== coin.id)
      return
    }

    favorites.value = [...favorites.value, coin]
  }

  const removeFavorite = (id: string) => {
    favorites.value = favorites.value.filter((coin: CryptoCoin) => coin.id !== id)
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite
  }
}
