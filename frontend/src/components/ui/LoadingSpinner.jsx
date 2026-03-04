const LoadingSpinner = ({ size = 'md', color = 'blue', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-400',
  }

  const spinner = (
    <div className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

// Full page loader with message
LoadingSpinner.Page = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <LoadingSpinner size="xl" />
      <p className="text-gray-400 mt-4">{message}</p>
    </div>
  )
}

// Inline loader with text
LoadingSpinner.Inline = ({ message }) => {
  return (
    <div className="flex items-center gap-3">
      <LoadingSpinner size="sm" />
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  )
}

export default LoadingSpinner
