import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const useDarkMode = () => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event) => {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY)
      if (!storedTheme) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }

    // Only adjust when user hasn't explicitly selected a theme
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    if (!storedTheme) {
      handleChange(mediaQuery)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
