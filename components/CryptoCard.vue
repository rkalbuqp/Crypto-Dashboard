<script setup lang="ts">
import { computed } from 'vue'
import type { CryptoCoin } from '../types/crypto'
import { useFavorites } from '../composables/useFavorites'

const props = defineProps<{
  coin: CryptoCoin
}>()

const { isFavorite, toggleFavorite } = useFavorites()

const favorited = computed(() => isFavorite(props.coin.id))

const handleToggle = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  toggleFavorite(props.coin)
}
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
    <div class="flex items-center gap-3">
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
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm hover:border-pink-500 hover:text-pink-400"
        :aria-pressed="favorited"
        :aria-label="favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
        @click="handleToggle"
      >
        <span v-if="favorited">
          ♥
        </span>
        <span v-else>
          ♡
        </span>
      </button>
    </div>
  </NuxtLink>
</template>
