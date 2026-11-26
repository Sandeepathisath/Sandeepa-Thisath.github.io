import { useEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light'
export type ThemeWorld = 'liquid-glass' | 'galaxy' | 'jungle' | 'ocean'

const THEME_STORAGE_KEY = 'portfolio-theme'
const WORLD_STORAGE_KEY = 'portfolio-world'

const THEME_META_COLORS: Record<ThemeWorld, Record<ThemeMode, string>> = {
  'liquid-glass': { dark: '#0c111a', light: '#edf2f8' },
  galaxy: { dark: '#070514', light: '#f2f0fc' },
  jungle: { dark: '#05130f', light: '#eaf5ef' },
  ocean: { dark: '#03111c', light: '#e8f6fb' },
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return 'dark'
}

function getInitialWorld(): ThemeWorld {
  if (typeof window === 'undefined') return 'galaxy'
  try {
    const saved = window.localStorage.getItem(WORLD_STORAGE_KEY)
    if (
      saved === 'liquid-glass' ||
      saved === 'galaxy' ||
      saved === 'jungle' ||
      saved === 'ocean'
    ) {
      return saved
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return 'galaxy'
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [world, setWorld] = useState<ThemeWorld>(getInitialWorld)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-world', world)
    root.style.colorScheme = theme

    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', THEME_META_COLORS[world][theme])
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
      window.localStorage.setItem(WORLD_STORAGE_KEY, world)
    } catch {
      // Ignore storage write errors
    }
  }, [theme, world])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    world,
    isLight: theme === 'light',
    toggleTheme,
    setWorld,
  }
}
