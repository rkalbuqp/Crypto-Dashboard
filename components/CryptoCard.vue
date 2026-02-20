<script setup lang="ts">
import type { CryptoMarket } from '../types/crypto'

const props = defineProps<{
  coin: CryptoMarket
}>()
</script>

<template>
  <NuxtLink
    :to="`/coin/${props.coin.id}`"
    class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-slate-600 hover:bg-slate-800/60"
  >
    <div class="flex items-center gap-3">
      <img
        :src="props.coin.image"
        :alt="props.coin.name"
        class="h-8 w-8 rounded-full bg-slate-800 object-contain"
        loading="lazy"
      />
      <div class="flex flex-col">
        <span class="font-medium text-slate-50">
          {{ props.coin.name }}
        </span>
        <span class="text-xs uppercase text-slate-400">
          {{ props.coin.symbol }}
        </span>
      </div>
    </div>
    <div class="flex flex-col items-end gap-1">
      <span class="text-sm font-medium tabular-nums text-slate-50">
        {{ props.coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
      </span>
      <span
        class="text-xs tabular-nums"
        :class="props.coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'"
      >
        {{ props.coin.price_change_percentage_24h.toFixed(2) }}%
      </span>
    </div>
  </NuxtLink>
</template>

