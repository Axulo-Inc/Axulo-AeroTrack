import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

// Theme options
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
}

// Color schemes
export const colors = {
  dark: {
    bg: {
      primary: 'bg-slate-900',
      secondary: 'bg-slate-800',
      tertiary: 'bg-slate-700',
      hover: 'hover:bg-slate-700',
      card: 'bg-slate-800',
      input: 'bg-slate-900',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      tertiary: 'text-gray-400',
      muted: 'text-gray-500',
    },
    border: {
      primary: 'border-slate-700',
      secondary: 'border-slate-600',
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
      ghost: 'hover:bg-slate-800 text-gray-300',
    },
    chart: {
      grid: '#334155',
      text: '#94a3b8',
    }
  },
  light: {
    bg: {
      primary: 'bg-gray-50',
      secondary: 'bg-white',
      tertiary: 'bg-gray-100',
      hover: 'hover:bg-gray-200',
      card: 'bg-white',
      input: 'bg-white',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      ghost: 'hover:bg-gray-100 text-gray-700',
    },
    chart: {
      grid: '#e2e8f0',
      text: '#64748b',
    }
  }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme
    }
    return THEMES.DARK // Default to dark
  })

  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
  )

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT)
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    const activeTheme = theme === THEMES.SYSTEM ? systemTheme : theme
    
    if (activeTheme === THEMES.DARK) {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
    
    localStorage.setItem('theme', theme)
  }, [theme, systemTheme])

  const toggleTheme = () => {
    setTheme(prev => prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK)
  }

  const value = {
    theme,
    systemTheme,
    setTheme,
    toggleTheme,
    isDark: theme === THEMES.DARK || (theme === THEMES.SYSTEM && systemTheme === THEMES.DARK),
    colors: theme === THEMES.SYSTEM ? colors[systemTheme] : colors[theme],
    THEMES,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
