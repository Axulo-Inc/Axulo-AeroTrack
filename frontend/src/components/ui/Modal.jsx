import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  if (!isVisible && !isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-all duration-300 ${
          isOpen ? 'bg-opacity-70 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-0'
        }`}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-slate-800 rounded-xl shadow-2xl w-full ${sizes[size]} transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-1 hover:bg-slate-700 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Preset modal for confirmation
Modal.Confirm = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Action'}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-300">{message}</p>
    </Modal>
  )
}

export default Modal
