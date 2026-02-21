'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme, themes, getTheme } from '@/lib/themes'

interface ThemeContextType {
  theme: Theme
  themeName: string
  setThemeName: (name: string) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, initialTheme = 'default' }: { children: ReactNode; initialTheme?: string }) {
  const [themeName, setThemeName] = useState(initialTheme)
  const [theme, setTheme] = useState<Theme>(getTheme(initialTheme))

  useEffect(() => {
    setTheme(getTheme(themeName))
  }, [themeName])

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
