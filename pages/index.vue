<script setup lang="ts">
import { computed } from 'vue'
import { useCrypto } from '../composables/useCrypto'

const { data, pending, error, nextPage } = useCrypto()

const isLoading = computed(() => pending.value)
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
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-700"
          @click="nextPage"
        >
          Próxima página
        </button>
      </div>
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

      <CryptoTable
        v-else
        :markets="markets"
      />
    </main>
  </div>
</template>
