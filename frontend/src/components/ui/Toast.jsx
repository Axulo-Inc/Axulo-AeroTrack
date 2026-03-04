import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Toast Context
const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Component
const Toast = ({ id, type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  }

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/50',
    error: 'bg-red-500/10 border-red-500/50',
    warning: 'bg-yellow-500/10 border-yellow-500/50',
    info: 'bg-blue-500/10 border-blue-500/50',
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${bgColors[type]} backdrop-blur-sm transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {icons[type]}
      <p className="text-white text-sm flex-1">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(id), 300)
        }}
        className="text-gray-400 hover:text-white transition"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message, duration) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    info: (message, duration) => addToast('info', message, duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
