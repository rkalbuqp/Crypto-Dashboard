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
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight md:text-3xl">
          Crypto Dashboard
        </h1>
        <p class="mt-1 text-sm text-slate-400">
          Acompanhe o mercado em tempo real com filtro por categoria.
        </p>
      </div>
      <div class="mt-2 flex items-center gap-3 md:mt-0">
        <label
          for="category"
          class="text-sm text-slate-400"
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

    <section class="section-card">
      <div class="divide-y divide-slate-800">
        <div v-if="pending && !coins?.length" class="space-y-3 p-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="skeleton-avatar h-8 w-8" />
              <div class="space-y-2">
                <div class="skeleton-text w-32" />
                <div class="skeleton-text w-20" />
              </div>
            </div>
            <div class="w-32">
              <div class="skeleton-line-lg" />
            </div>
          </div>
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="skeleton-avatar h-8 w-8" />
              <div class="space-y-2">
                <div class="skeleton-text w-28" />
                <div class="skeleton-text w-16" />
              </div>
            </div>
            <div class="w-28">
              <div class="skeleton-line-lg" />
            </div>
          </div>
        </div>
        <div v-else>
          <div
            v-if="error && !coins?.length"
            class="p-4 text-sm text-red-400"
          >
            Erro ao carregar dados.
          </div>
          <div
            v-else
            class="flex flex-col gap-2 p-2 sm:p-3"
          >
            <div
              v-for="coin in coins"
              :key="coin.id"
              class="rounded-lg px-2 py-1 hover:bg-slate-900/60 sm:px-3 sm:py-2"
            >
              <NuxtLink
                :to="`/coin/${coin.id}`"
                class="flex items-center justify-between gap-3"
              >
                <div class="flex flex-1 items-center gap-3 overflow-hidden">
                  <img
                    :src="coin.image"
                    :alt="coin.name"
                    class="h-8 w-8 shrink-0 rounded-full bg-slate-800 object-contain"
                    loading="lazy"
                  />
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-slate-50">
                      {{ coin.name }}
                    </p>
                    <p class="text-xs uppercase text-slate-400">
                      {{ coin.symbol }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1 text-xs sm:text-sm">
                  <span class="font-medium tabular-nums text-slate-50">
                    {{ coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
                  </span>
                </div>
              </NuxtLink>
            </div>

            <div
              ref="sentinel"
              class="h-px"
            />

            <div
              v-if="pending && coins?.length"
              class="p-3 text-center text-sm text-slate-400"
            >
              Carregando mais...
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-2 flex justify-center">
      <button
        type="button"
        class="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800"
        @click="nextPage"
      >
        Carregar mais
      </button>
    </div>
  </div>
</template>
