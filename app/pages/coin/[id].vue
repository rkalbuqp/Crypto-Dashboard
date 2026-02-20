<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFetch } from 'nuxt/app'

type CryptoDetail = {
  id: string
  name: string
  symbol: string
  image: {
    large: string
  }
  description: {
    en: string
  }
  market_cap_rank: number | null
  genesis_date: string | null
  categories: string[]
  market_data: {
    current_price: {
      usd: number
    }
    price_change_percentage_24h: number
  }
}

const route = useRoute()

const { data, pending, error } = await useFetch<CryptoDetail>(() =>
  `/api/crypto?id=${route.params.id}`
)
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-8">
    <div v-if="pending">
      Carregando...
    </div>
    <div
      v-else-if="error"
    >
      Erro ao carregar dados.
    </div>
    <div
      v-else-if="data"
      class="flex flex-col gap-8"
    >
      <section class="overflow-hidden rounded-2xl border border-slate-800 bg-linear-to-r from-slate-900 to-slate-950">
        <div class="flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <div class="flex items-center gap-4">
            <img
              :src="data.image.large"
              :alt="data.name"
              class="h-20 w-20 rounded-full bg-slate-900 object-contain"
            />
            <div>
              <h1 class="text-2xl font-semibold tracking-tight text-slate-50">
                {{ data.name }}
              </h1>
              <p class="text-sm uppercase text-slate-400">
                {{ data.symbol }}
              </p>
            </div>
          </div>
          <div class="flex flex-1 flex-wrap justify-end gap-4 text-sm">
            <div class="rounded-lg bg-slate-900/70 px-4 py-3">
              <p class="text-xs text-slate-400">
                Preço atual
              </p>
              <p class="mt-1 text-lg font-semibold tabular-nums text-slate-50">
                {{
                  data.market_data.current_price.usd.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })
                }}
              </p>
            </div>
            <div class="rounded-lg bg-slate-900/70 px-4 py-3">
              <p class="text-xs text-slate-400">
                Variação 24h
              </p>
              <p
                class="mt-1 text-lg font-semibold tabular-nums"
                :class="data.market_data.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ data.market_data.price_change_percentage_24h.toFixed(2) }}%
              </p>
            </div>
            <div
              v-if="data.market_cap_rank"
              class="rounded-lg bg-slate-900/70 px-4 py-3"
            >
              <p class="text-xs text-slate-400">
                Ranking de mercado
              </p>
              <p class="mt-1 text-lg font-semibold tabular-nums text-slate-50">
                #{{ data.market_cap_rank }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        <div class="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <h2 class="mb-3 text-sm font-medium text-slate-200">
            Sobre
          </h2>
          <p class="text-sm leading-relaxed text-slate-300">
            {{
              data.description.en
                ? data.description.en.replace(/<[^>]*>/g, '')
                : 'Descrição não disponível.'
            }}
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            <h2 class="mb-3 text-sm font-medium text-slate-200">
              Informações
            </h2>
            <p v-if="data.genesis_date">
              <span class="text-slate-400">Data de criação:</span>
              <span class="ml-1">{{ data.genesis_date }}</span>
            </p>
            <p v-else>
              <span class="text-slate-400">Data de criação:</span>
              <span class="ml-1">Não informada</span>
            </p>
          </div>

          <div
            v-if="data.categories?.length"
            class="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <h2 class="mb-3 text-sm font-medium text-slate-200">
              Categorias
            </h2>
            <div class="flex flex-wrap gap-2 text-xs">
              <span
                v-for="category in data.categories.slice(0, 8)"
                :key="category"
                class="rounded-full bg-slate-900 px-3 py-1 text-slate-200"
              >
                {{ category }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <PriceChart
          :id="data.id"
          :days="1"
        />
      </section>
    </div>
  </div>
</template>

