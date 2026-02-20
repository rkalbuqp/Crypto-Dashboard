<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <header class="flex justify-end px-4 pt-4 sm:px-6">
      <button
        type="button"
        class="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800"
        @click="toggleTheme"
      >
        {{ theme === 'dark' ? 'Modo claro' : 'Modo escuro' }}
      </button>
    </header>
    <main class="app-container">
      <NuxtPage />
    </main>
  </div>
</template>
