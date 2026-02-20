<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useCrypto } from '../composables/useCrypto'

const { coins, pending, error, nextPage } = useCrypto()

const sentinel = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      if (entry.isIntersecting && !pending.value && !error.value) {
        nextPage()
      }
    },
    {
      root: null,
      rootMargin: '200px 0px',
      threshold: 0.1
    }
  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div>
    <h1>Crypto Dashboard</h1>

    <div v-if="pending && !coins?.length">
      Carregando...
    </div>
    <div v-else>
      <div
        v-if="error && !coins?.length"
      >
        Erro ao carregar dados.
      </div>
      <div
        v-else
      >
        <div
          v-for="coin in coins"
          :key="coin.id"
        >
          <NuxtLink :to="`/coin/${coin.id}`">
            {{ coin.name }} - ${{ coin.current_price }}
          </NuxtLink>
        </div>

        <div
          ref="sentinel"
          style="height: 1px;"
        />

        <div v-if="pending && coins?.length">
          Carregando mais...
        </div>
      </div>
    </div>

    <button @click="nextPage">
      Carregar mais
    </button>
  </div>
</template>
