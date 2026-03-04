const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  bordered = false,
  hoverable = false,
  ...props 
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const baseClasses = 'bg-slate-900 rounded-xl'
  const paddingClass = paddings[padding] || paddings.md
  const borderClass = bordered ? 'border border-slate-700' : ''
  const hoverClass = hoverable ? 'transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:bg-slate-800 cursor-pointer' : ''

  return (
    <div 
      className={`${baseClasses} ${paddingClass} ${borderClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Sub-components for consistent structure
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-slate-700 pb-4 mb-4 ${className}`}>
    {children}
  </div>
)

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-slate-700 pt-4 mt-4 ${className}`}>
    {children}
  </div>
)

export default Card
