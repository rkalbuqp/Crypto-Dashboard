<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from 'nuxt/app'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js'
import type { MarketChart } from '../types/crypto'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
)

const props = defineProps<{
  id: string
  days?: number
}>()

const { data, pending, error } = await useFetch<MarketChart>(() =>
  `/api/crypto/market-chart?id=${props.id}&days=${props.days ?? 1}`
)

const chartData = computed(() => {
  if (!data.value) {
    return {
      labels: [],
      datasets: []
    }
  }

  const labels = data.value.prices.map(([timestamp]) =>
    new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )

  const prices = data.value.prices.map(([, price]) => price)

  return {
    labels,
    datasets: [
      {
        label: 'Preço (USD)',
        data: prices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.2,
        pointRadius: 0
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 6
      }
    },
    y: {
      ticks: {
        callback(value: unknown) {
          return `$${value as number}`
        }
      }
    }
  }
}
</script>

<template>
  <div class="mt-4 h-72">
    <div v-if="pending" class="h-full rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div class="skeleton h-full w-full" />
    </div>
    <div
      v-else-if="error"
      class="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-red-400"
    >
      Erro ao carregar gráfico.
    </div>
    <div v-else class="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>
