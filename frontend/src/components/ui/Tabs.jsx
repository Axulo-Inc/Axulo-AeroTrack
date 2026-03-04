import { useState } from 'react'

const Tabs = ({ 
  tabs = [], 
  defaultTab,
  onChange,
  variant = 'underline',
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.id))

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (onChange) {
      onChange(tabId)
    }
  }

  const variants = {
    underline: {
      container: 'border-b border-slate-700',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'text-blue-400 border-b-2 border-blue-400 -mb-[2px]' 
          : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-slate-600'
        }
      `,
    },
    pills: {
      container: 'flex gap-2 p-1 bg-slate-900 rounded-lg',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-slate-800'
        }
      `,
    },
    buttons: {
      container: 'flex gap-2',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
        ${isActive 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'border-slate-700 text-gray-400 hover:text-white hover:border-slate-600'
        }
      `,
    },
  }

  const currentVariant = variants[variant] || variants.underline

  return (
    <div className={className}>
      <div className={currentVariant.container}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={currentVariant.tab(activeTab === tab.id)}
            disabled={tab.disabled}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <tab.icon size={16} />}
              {tab.label}
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-700 rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

// Tab panel component for organizing content
Tabs.Panel = ({ children, id, activeTab }) => {
  if (activeTab !== id) return null
  return <div>{children}</div>
}

export default Tabs
