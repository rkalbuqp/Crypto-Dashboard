<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-medium text-slate-200">
        {{ props.title }}
      </h2>
      <span class="text-xs text-slate-500">
        Em breve
      </span>
    </div>
    <div class="flex h-40 items-center justify-center rounded-md bg-slate-950/60">
      <span class="text-xs text-slate-500">
        Gráfico de preço será exibido aqui
      </span>
    </div>
  </div>
</template>

