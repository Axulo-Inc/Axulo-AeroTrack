import { useState } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full bg-slate-900 text-white rounded-lg border appearance-none
            pl-4 pr-10 py-3
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : isFocused 
                ? 'border-blue-500 ring-2 ring-blue-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            }
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          <option value="" disabled className="bg-slate-900">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        
        <ChevronDown 
          size={18} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1">
          <AlertCircle size={14} className="text-red-500" />
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}

export default Select
