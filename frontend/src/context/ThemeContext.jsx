import { createContext, useContext } from 'react'
import { useDarkMode } from '../hooks/useDarkMode.js'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const { theme, toggleTheme } = useDarkMode()

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
