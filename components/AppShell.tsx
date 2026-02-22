'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
              <Image
                src="/logo.png"
                alt="Run Trainer Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className={`text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent`}>
                Run Trainer
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
  const [initialTheme, setInitialTheme] = useState('playful')
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
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    )
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  )
}
