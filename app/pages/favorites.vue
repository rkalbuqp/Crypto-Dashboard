<script setup lang="ts">
import { useFavorites } from '../../composables/useFavorites'

const { favorites, removeFavorite } = useFavorites()
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          Favoritas
        </h1>
        <p class="mt-1 text-sm text-slate-400">
          Criptomoedas que você marcou com ❤️.
        </p>
      </div>
    </header>

    <div
      v-if="!favorites.length"
      class="section-card px-4 py-10"
    >
      <p class="text-sm text-slate-400">
        Você ainda não marcou nenhuma cripto como favorita.
        Volte para a página inicial e clique no botão ❤️ de uma moeda.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div
        v-for="coin in favorites"
        :key="coin.id"
        class="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-3">
          <img
            :src="coin.image"
            :alt="coin.name"
            class="h-8 w-8 rounded-full bg-slate-800 object-contain"
            loading="lazy"
          />
          <div class="flex flex-col">
            <NuxtLink
              :to="`/coin/${coin.id}`"
              class="font-medium text-slate-50 hover:underline"
            >
              {{ coin.name }}
            </NuxtLink>
            <span class="text-xs uppercase text-slate-400">
              {{ coin.symbol }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-3 sm:justify-end">
          <span class="text-sm font-medium tabular-nums text-slate-50">
            {{ coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
          </span>
          <button
            type="button"
            class="text-xs text-slate-400 hover:text-red-400"
            @click="removeFavorite(coin.id)"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
