'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeProvider, useTheme } from './ThemeProvider'
import { getTheme } from '@/lib/themes'

function NavBar() {
  const { theme } = useTheme()

  return (
    <nav className={`${theme.colors.bgSecondary} shadow-sm border-b ${theme.colors.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className={`w-8 h-8 ${theme.colors.accentText}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
              </svg>
              <span className={`text-xl font-bold ${theme.colors.accentText}`}>
                RunTrainer
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`${theme.colors.textSecondary} hover:${theme.colors.accentText} px-3 py-2 text-sm font-medium transition-colors`}
            >
              Dashboard
            </Link>
            <Link
              href="/history"
              className={`${theme.colors.textSecondary} hover:${theme.colors.accentText} px-3 py-2 text-sm font-medium transition-colors`}
            >
              History
            </Link>
            <Link
              href="/settings"
              className={`${theme.colors.textSecondary} hover:${theme.colors.accentText} px-3 py-2 text-sm font-medium transition-colors`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme.colors.bgPrimary}`}>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [initialTheme, setInitialTheme] = useState('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.settings?.theme) {
          setInitialTheme(data.settings.theme)
        }
      } catch (err) {
        console.error('Failed to load theme:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTheme()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  )
}
