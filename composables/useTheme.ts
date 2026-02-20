import { onMounted, watch } from 'vue'
import { useState } from 'nuxt/app'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark'

export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'dark')

  const applyTheme = (value: Theme) => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement

    root.classList.remove('theme-light', 'theme-dark')
    root.classList.add(value === 'light' ? 'theme-light' : 'theme-dark')
  }

  onMounted(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)

      if (isTheme(stored)) {
        theme.value = stored
      } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches
      ) {
        theme.value = 'light'
      }
    } catch {
      theme.value = 'dark'
    }

    applyTheme(theme.value)
  })

  watch(
    theme,
    (value) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.setItem(STORAGE_KEY, value)
      applyTheme(value)
    },
    { immediate: false }
  )

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggleTheme
  }
}

