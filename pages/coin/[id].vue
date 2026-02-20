<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFetch } from 'nuxt/app'

type CryptoDetail = {
  id: string
  name: string
  image: {
    large: string
  }
  description: {
    en: string
  }
}

const route = useRoute()

const { data, pending, error } = await useFetch<CryptoDetail>(() =>
  `/api/crypto?id=${route.params.id}`
)
</script>

<template>
  <div>
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
    >
      <h1>{{ data.name }}</h1>
      <img
        :src="data.image.large"
        :alt="data.name"
      />
      <p>{{ data.description.en }}</p>
      <PriceChart
        :id="data.id"
        :days="1"
      />
    </div>
  </div>
</template>
