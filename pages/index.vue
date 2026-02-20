<script setup lang="ts">
import { useCrypto } from '../composables/useCrypto'

const { data, pending, error, nextPage } = useCrypto()
</script>

<template>
  <div>
    <h1>Crypto Dashboard</h1>

    <div v-if="pending">
      Carregando...
    </div>
    <div v-else>
      <div
        v-if="error"
      >
        Erro ao carregar dados.
      </div>
      <div
        v-else
      >
        <div
          v-for="coin in data"
          :key="coin.id"
        >
          <NuxtLink :to="`/coin/${coin.id}`">
            {{ coin.name }} - ${{ coin.current_price }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <button @click="nextPage">
      Carregar mais
    </button>
  </div>
</template>
