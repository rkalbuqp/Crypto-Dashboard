<script setup lang="ts">
import type { CryptoMarket } from '../types/crypto'

const props = defineProps<{
  markets: CryptoMarket[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
    <table class="min-w-full divide-y divide-slate-800 text-sm">
      <thead class="bg-slate-900/80">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-slate-400">
            #
          </th>
          <th class="px-4 py-3 text-left font-medium text-slate-400">
            Ativo
          </th>
          <th class="px-4 py-3 text-right font-medium text-slate-400">
            Preço
          </th>
          <th class="px-4 py-3 text-right font-medium text-slate-400">
            24h
          </th>
          <th class="px-4 py-3 text-right font-medium text-slate-400">
            Market Cap
          </th>
          <th class="px-4 py-3 text-right font-medium text-slate-400">
            Volume 24h
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800">
        <tr
          v-for="(coin, index) in props.markets"
          :key="coin.id"
          class="hover:bg-slate-800/60"
        >
          <td class="whitespace-nowrap px-4 py-3 text-slate-400">
            {{ index + 1 }}
          </td>
          <td class="whitespace-nowrap px-4 py-3">
            <NuxtLink
              :to="`/coin/${coin.id}`"
              class="flex items-center gap-3"
            >
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
            </NuxtLink>
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
</template>

