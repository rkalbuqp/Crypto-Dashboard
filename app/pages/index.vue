<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFetch } from 'nuxt/app'
import { useCrypto } from '../../composables/useCrypto'
import type { CryptoCategory } from '../../types/crypto'

const { coins, pending, error, nextPage, setCategory, category } = useCrypto()

const { data: categories } = await useFetch<CryptoCategory[]>(
  '/api/crypto/categories'
)

const selectedCategory = ref<string>('')

watch(
  selectedCategory,
  (value) => {
    if (!value) {
      setCategory(null)
      return
    }

    setCategory(value)
  }
)

const sentinel = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      if (entry.isIntersecting && !pending.value && !error.value) {
        nextPage()
      }
    },
    {
      root: null,
      rootMargin: '200px 0px',
      threshold: 0.1
    }
  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div>
    <h1>Crypto Dashboard</h1>

    <div class="mb-4">
      <label
        for="category"
        class="mr-2 text-sm text-slate-400"
      >
        Filtrar por categoria:
      </label>
      <select
        id="category"
        v-model="selectedCategory"
        class="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
      >
        <option value="">
          Todas
        </option>
        <option
          v-for="cat in categories || []"
          :key="cat.category_id"
          :value="cat.category_id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div v-if="pending && !coins?.length">
      Carregando...
    </div>
    <div v-else>
      <div
        v-if="error && !coins?.length"
      >
        Erro ao carregar dados.
      </div>
      <div
        v-else
      >
        <div
          v-for="coin in coins"
          :key="coin.id"
        >
          <NuxtLink :to="`/coin/${coin.id}`">
            {{ coin.name }} - ${{ coin.current_price }}
          </NuxtLink>
        </div>

        <div
          ref="sentinel"
          style="height: 1px;"
        />

        <div v-if="pending && coins?.length">
          Carregando mais...
        </div>
      </div>
    </div>

    <button @click="nextPage">
      Carregar mais
    </button>
  </div>
</template>
