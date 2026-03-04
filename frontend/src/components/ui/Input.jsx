import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const Input = ({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        )}
        
        <input
          type={inputType}
          className={`
            w-full bg-slate-900 text-white rounded-lg border
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            py-3
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
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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

export default Input
