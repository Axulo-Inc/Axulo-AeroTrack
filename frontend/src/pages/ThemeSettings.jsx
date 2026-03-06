import React from 'react'
import { Card, Button } from '../components/ui'
import ThemeSwitcher, { ThemePreview } from '../components/ui/ThemeSwitcher'
import { useTheme, THEMES } from '../contexts/ThemeContext'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'

function ThemeSettings() {
  const { theme, setTheme, isDark } = useTheme()

  const themeOptions = [
    { value: THEMES.LIGHT, icon: Sun, label: 'Light', description: 'Bright and clean interface' },
    { value: THEMES.DARK, icon: Moon, label: 'Dark', description: 'Easy on the eyes at night' },
    { value: THEMES.SYSTEM, icon: Monitor, label: 'System', description: 'Follow your system preference' },
  ]

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Theme Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selection */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Palette size={20} />
              Color Theme
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`w-full flex items-start gap-4 p-4 rounded-lg transition ${
                    theme === option.value
                      ? isDark
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'bg-blue-50 border border-blue-300'
                      : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 border border-transparent'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    theme === option.value
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-slate-700 text-gray-300'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    <option.icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{option.label}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{option.description}</p>
                  </div>
                  {theme === option.value && (
                    <div className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-blue-500' : 'bg-blue-600'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h2 className="text-xl font-semibold">Preview</h2>
          </Card.Header>
          <Card.Body>
            <ThemePreview />
            
            <div className="mt-6">
              <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Theme Switcher
              </h3>
              <div className="flex gap-2">
                <ThemeSwitcher variant="dropdown" />
                <ThemeSwitcher variant="toggle" />
                <ThemeSwitcher variant="icon" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ThemeSettings
