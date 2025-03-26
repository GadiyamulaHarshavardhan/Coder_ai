'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

// Enhanced Theme Switcher with better mobile support
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <div className="w-10 h-10" /> // Placeholder to prevent layout shift
  )

  return (
    <div className="flex items-center space-x-1 p-1 rounded-full bg-background border border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full ${theme === 'light' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        aria-label="Light theme"
      >
        <SunIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full ${theme === 'system' ? 'bg-gray-200 dark:bg-gray-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        aria-label="System theme"
      >
        <ComputerDesktopIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        aria-label="Dark theme"
      >
        <MoonIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

// Universal Theme Provider
export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
        {children}
      </div>
    </NextThemesProvider>
  )
}