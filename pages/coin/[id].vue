<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptoCoin } from '../../composables/useCrypto'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data, status, error, refresh } = useCryptoCoin(id.value)

const isLoading = computed(() => status.value === 'pending')
const hasError = computed(() => Boolean(error.value))
const coin = computed(() => data.value)
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-8">
    <header class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <img
          v-if="coin?.image?.large"
          :src="coin.image.large"
          :alt="coin.name"
          class="h-12 w-12 rounded-full bg-slate-800 object-contain"
          loading="lazy"
        />
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ coin?.name }}
          </h1>
          <p class="text-sm uppercase text-slate-400">
            {{ coin?.symbol }}
          </p>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-50 transition hover:bg-slate-700"
        @click="() => refresh()"
      >
        Atualizar
      </button>
    </header>

    <main class="flex flex-col gap-6">
      <div
        v-if="isLoading"
        class="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-16"
      >
        <span class="text-sm text-slate-400">Carregando dados da moeda...</span>
      </div>

      <div
        v-else-if="hasError || !coin"
        class="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-4 text-sm text-red-200"
      >
        Ocorreu um erro ao carregar os dados. Tente novamente.
      </div>

      <div
        v-else
        class="flex flex-col gap-6"
      >
        <section class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p class="text-xs text-slate-400">
              Preço atual
            </p>
            <p class="mt-2 text-lg font-semibold tabular-nums text-slate-50">
              {{ coin.market_data.current_price.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
            </p>
          </div>
          <div class="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p class="text-xs text-slate-400">
              Variação 24h
            </p>
            <p
              class="mt-2 text-lg font-semibold tabular-nums"
              :class="coin.market_data.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'"
            >
              {{ coin.market_data.price_change_percentage_24h.toFixed(2) }}%
            </p>
          </div>
          <div class="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p class="text-xs text-slate-400">
              Market cap
            </p>
            <p class="mt-2 text-lg font-semibold tabular-nums text-slate-50">
              {{ coin.market_data.market_cap.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }}
            </p>
          </div>
        </section>

        <PriceChart title="Preço nas últimas 24h" />

        <section v-if="coin.description?.en" class="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <h2 class="mb-2 text-sm font-medium text-slate-200">
            Sobre
          </h2>
          <p class="text-sm text-slate-300 line-clamp-6">
            {{ coin.description.en.replace(/<[^>]*>/g, '') }}
          </p>
        </section>
      </div>
    </main>
  </div>
</template>
