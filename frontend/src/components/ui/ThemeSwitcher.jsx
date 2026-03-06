import React, { useState } from 'react'
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react'
import { useTheme, THEMES } from '../../contexts/ThemeContext'
import Button from './Button'

const ThemeSwitcher = ({ variant = 'dropdown', size = 'md', className = '' }) => {
  const { theme, setTheme, isDark, THEMES } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const getThemeIcon = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return <Sun size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      case THEMES.DARK:
        return <Moon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      case THEMES.SYSTEM:
        return <Monitor size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      default:
        return <Sun size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return 'Light'
      case THEMES.DARK:
        return 'Dark'
      case THEMES.SYSTEM:
        return 'System'
      default:
        return 'Theme'
    }
  }

  // Simple toggle button variant
  if (variant === 'toggle') {
    return (
      <button
        onClick={() => setTheme(isDark ? THEMES.LIGHT : THEMES.DARK)}
        className={`relative inline-flex items-center justify-center rounded-lg transition ${
          isDark 
            ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } ${className}`}
        style={{ width: size === 'sm' ? '32px' : '40px', height: size === 'sm' ? '32px' : '40px' }}
        aria-label="Toggle theme"
      >
        {isDark ? <Moon size={size === 'sm' ? 16 : 20} /> : <Sun size={size === 'sm' ? 16 : 20} />}
      </button>
    )
  }

  // Icon button variant
  if (variant === 'icon') {
    return (
      <button
        onClick={() => setTheme(isDark ? THEMES.LIGHT : THEMES.DARK)}
        className={`p-2 rounded-lg transition ${
          isDark 
            ? 'text-gray-400 hover:text-white hover:bg-slate-800' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        } ${className}`}
        aria-label="Toggle theme"
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    )
  }

  // Dropdown variant (default)
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
          isDark 
            ? 'bg-slate-800 text-white hover:bg-slate-700' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${className}`}
      >
        {getThemeIcon()}
        <span className="text-sm font-medium">{getThemeLabel()}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            {[
              { value: THEMES.LIGHT, icon: Sun, label: 'Light' },
              { value: THEMES.DARK, icon: Moon, label: 'Dark' },
              { value: THEMES.SYSTEM, icon: Monitor, label: 'System' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                  theme === option.value
                    ? isDark
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600'
                    : isDark
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <option.icon size={18} />
                <span className="flex-1 text-left">{option.label}</span>
                {theme === option.value && <Check size={16} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Theme preview component
export const ThemePreview = () => {
  const { isDark } = useTheme()
  
  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Theme Preview
      </h3>
      
      <div className="space-y-4">
        {/* Buttons */}
        <div className="flex gap-2">
          <Button size="sm" variant="primary">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
        </div>
        
        {/* Card */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            This is how your app will look in {isDark ? 'dark' : 'light'} mode.
          </p>
        </div>
        
        {/* Colors */}
        <div className="grid grid-cols-4 gap-2">
          {['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'].map((color, i) => (
            <div key={i} className={`${color} h-8 rounded`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSwitcher
