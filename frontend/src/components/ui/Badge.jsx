const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  rounded = 'full',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    default: 'bg-slate-700 text-white',
    primary: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-black',
    danger: 'bg-red-600 text-white',
    info: 'bg-purple-600 text-white',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  return (
    <span
      className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${roundedClasses[rounded]}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  )
}

// Preset badges for common use cases
Badge.Status = ({ status }) => {
  const statusConfig = {
    Active: { variant: 'success', label: 'Active' },
    Maintenance: { variant: 'warning', label: 'Maintenance' },
    Critical: { variant: 'danger', label: 'Critical' },
    Open: { variant: 'danger', label: 'Open' },
    Closed: { variant: 'success', label: 'Closed' },
    Low: { variant: 'info', label: 'Low' },
    Medium: { variant: 'warning', label: 'Medium' },
    High: { variant: 'danger', label: 'High' },
  }

  const config = statusConfig[status] || { variant: 'default', label: status }
  
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default Badge
