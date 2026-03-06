import React, { useState, useRef } from 'react'
import { User, Camera, Upload, X } from 'lucide-react'
import { useToast } from './Toast'
import Button from './Button'
import Modal from './Modal'

const Avatar = ({
  src,
  name,
  size = 'md',
  shape = 'circle',
  bordered = false,
  editable = false,
  onUpload,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const toast = useToast()

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-3xl',
  }

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  }

  const getInitials = () => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Call the onUpload callback with the file
      if (onUpload) {
        await onUpload(selectedFile)
      }
      
      toast.success('Avatar uploaded successfully')
      setShowUploadModal(false)
      setPreviewUrl(null)
      setSelectedFile(null)
    } catch (error) {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    setShowUploadModal(false)
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div
        className={`relative inline-block ${sizes[size]} ${shapes[shape]} ${
          bordered ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-800' : ''
        } ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar Image or Fallback */}
        {src || previewUrl ? (
          <img
            src={previewUrl || src}
            alt={name || 'Avatar'}
            className={`w-full h-full object-cover ${shapes[shape]}`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium ${shapes[shape]}`}>
            {getInitials()}
          </div>
        )}

        {/* Edit Overlay */}
        {editable && isHovered && (
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-all ${shapes[shape]}`}
            onClick={() => setShowUploadModal(true)}
          >
            <Camera size={size === 'xs' || size === 'sm' ? 16 : 24} className="text-white" />
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={handleCancel}
        title="Upload Avatar"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              isLoading={uploading}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : src ? (
                  <img
                    src={src}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-medium">
                    {getInitials()}
                  </div>
                )}
              </div>
              {selectedFile && (
                <button
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {selectedFile ? selectedFile.name : 'Current avatar'}
            </p>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="text-white font-medium mb-1">Click to upload</p>
            <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Tips */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Tips for a good avatar:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use a square image for best results</li>
              <li>• Minimum size: 200x200 pixels</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Supported formats: PNG, JPG, GIF</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Avatar
