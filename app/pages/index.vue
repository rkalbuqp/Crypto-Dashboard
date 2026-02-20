<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFetch } from 'nuxt/app'
import { useCrypto } from '../../composables/useCrypto'
import type { CryptoCategory } from '../../types/crypto'

const { coins, pending, error, nextPage, setCategory } = useCrypto()

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
  <div class="flex flex-col gap-10">
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="mb-6 text-[32px] font-bold tracking-tight">
          Crypto Dashboard
        </h1>
        <p class="mt-1 text-sm text-slate-400">
          Acompanhe o mercado em tempo real com filtro por categoria.
        </p>
      </div>
      <div class="mt-3 flex items-center gap-3 md:mt-0">
        <label
          for="category"
          class="text-xs text-slate-400"
        >
          Filtrar por categoria:
        </label>
        <select
          id="category"
          v-model="selectedCategory"
          class="w-full min-w-45 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 md:w-auto"
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
    </header>

    <section>
      <div
        v-if="pending && !coins?.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div
          v-for="index in 4"
          :key="index"
          class="coin-card space-y-4"
        >
          <div class="flex items-center gap-3">
            <div class="skeleton-avatar h-10 w-10" />
            <div class="space-y-2">
              <div class="skeleton-text w-32" />
              <div class="skeleton-text w-20" />
            </div>
          </div>
          <div class="space-y-2">
            <div class="skeleton-line-lg w-24" />
            <div class="skeleton-text w-20" />
          </div>
        </div>
      </div>

      <div v-else>
        <div
          v-if="error && !coins?.length"
          class="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200"
        >
          Erro ao carregar dados.
        </div>
        <div
          v-else
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          <NuxtLink
            v-for="coin in coins"
            :key="coin.id"
            :to="`/coin/${coin.id}`"
            class="coin-card flex flex-col gap-4"
          >
            <div class="flex items-center gap-3">
              <img
                :src="coin.image"
                :alt="coin.name"
                class="h-10 w-10 shrink-0 rounded-full bg-slate-800 object-contain"
                loading="lazy"
              />
              <div class="min-w-0">
                <p class="truncate text-[16px] font-semibold text-slate-200">
                  {{ coin.name }}
                </p>
                <p class="text-xs uppercase text-slate-400">
                  {{ coin.symbol }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-start gap-1">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                Preço
              </p>
              <p class="text-[20px] font-semibold tabular-nums text-slate-50">
                {{ coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <div
          ref="sentinel"
          class="h-px"
        />

        <div
          v-if="pending && coins?.length"
          class="mt-6 text-center text-sm text-slate-300"
        >
          Carregando mais...
        </div>
      </div>
    </section>
  </div>
</template>
