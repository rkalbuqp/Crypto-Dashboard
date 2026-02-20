<script setup lang="ts">
import { computed } from 'vue'
import { useCryptoMarkets } from '../composables/useCryptoMarkets'

const { data, status, error, refresh } = useCryptoMarkets()

const isLoading = computed(() => status.value === 'pending')
const hasError = computed(() => Boolean(error.value))
const markets = computed(() => data.value ?? [])
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          Crypto Dashboard
        </h1>
        <p class="text-sm text-slate-400">
          Acompanhe as principais criptomoedas em tempo real.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-700"
        @click="refresh"
      >
        Atualizar dados
      </button>
    </header>

    <main class="flex-1">
      <div
        v-if="isLoading"
        class="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-16"
      >
        <span class="text-sm text-slate-400">Carregando dados de mercado...</span>
      </div>

      <div
        v-else-if="hasError"
        class="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-4 text-sm text-red-200"
      >
        Ocorreu um erro ao carregar os dados. Tente novamente.
      </div>

      <div
        v-else
        class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60"
      >
        <table class="min-w-full divide-y divide-slate-800 text-sm">
          <thead class="bg-slate-900/80">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-slate-400">#</th>
              <th class="px-4 py-3 text-left font-medium text-slate-400">Ativo</th>
              <th class="px-4 py-3 text-right font-medium text-slate-400">Preço</th>
              <th class="px-4 py-3 text-right font-medium text-slate-400">24h</th>
              <th class="px-4 py-3 text-right font-medium text-slate-400">Market Cap</th>
              <th class="px-4 py-3 text-right font-medium text-slate-400">Volume 24h</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="(coin, index) in markets"
              :key="coin.id"
              class="hover:bg-slate-800/60"
            >
              <td class="whitespace-nowrap px-4 py-3 text-slate-400">
                {{ index + 1 }}
              </td>
              <td class="whitespace-nowrap px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="coin.image"
                    :alt="coin.name"
                    class="h-6 w-6 rounded-full bg-slate-800 object-contain"
                    loading="lazy"
                  />
                  <div class="flex flex-col">
                    <span class="font-medium text-slate-50">
                      {{ coin.name }}
                    </span>
                    <span class="text-xs uppercase text-slate-400">
                      {{ coin.symbol }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                {{ coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
              </td>
              <td
                class="whitespace-nowrap px-4 py-3 text-right tabular-nums"
                :class="coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ coin.price_change_percentage_24h.toFixed(2) }}%
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-200">
                {{ coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }}
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-200">
                {{ coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>
