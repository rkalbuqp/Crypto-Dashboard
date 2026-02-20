import type { CryptoCategory } from '../../../types/crypto'

export default defineEventHandler(async () => {
  const data = await $fetch<CryptoCategory[]>(
    'https://api.coingecko.com/api/v3/coins/categories/list'
  )

  return data
})

