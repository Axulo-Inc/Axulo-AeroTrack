import { useState } from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon: Icon,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    outline: 'bg-transparent border border-slate-600 hover:bg-slate-800 text-white focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-slate-800 text-white focus:ring-blue-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.md
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} transform hover:scale-[1.02] active:scale-[0.98]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className={`${children ? 'mr-2' : ''} w-4 h-4`} />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
