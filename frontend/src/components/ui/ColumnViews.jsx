import { useState, useEffect } from 'react'
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Star, 
  MoreVertical,
  Check,
  X,
  Edit2
} from 'lucide-react'
import Button from './Button'
import Input from './Input'
import { useToast } from './Toast'

const ColumnViews = ({
  currentView = {
    name: 'Default',
    visibleColumns: [],
    columnOrder: []
  },
  onLoadView,
  onSaveView,
  onDeleteView,
  storageKey = 'column_views'
}) => {
  const [views, setViews] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [viewName, setViewName] = useState('')
  const [editingViewId, setEditingViewId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const toast = useToast()

  // Load views from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setViews(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load views', e)
      }
    }
  }, [storageKey])

  // Save views to localStorage
  const saveViews = (updatedViews) => {
    setViews(updatedViews)
    localStorage.setItem(storageKey, JSON.stringify(updatedViews))
  }

  const handleSaveView = () => {
    if (!viewName.trim()) {
      toast.error('Please enter a view name')
      return
    }

    const newView = {
      id: Date.now().toString(),
      name: viewName,
      visibleColumns: currentView.visibleColumns,
      columnOrder: currentView.columnOrder,
      createdAt: new Date().toISOString(),
      isDefault: false
    }

    const updatedViews = [...views, newView]
    saveViews(updatedViews)
    setShowSaveDialog(false)
    setViewName('')
    toast.success(`View "${viewName}" saved`)
  }

  const handleLoadView = (view) => {
    onLoadView(view)
    setShowLoadDialog(false)
    toast.success(`Loaded view: ${view.name}`)
  }

  const handleDeleteView = (viewId, viewName) => {
    const updatedViews = views.filter(v => v.id !== viewId)
    saveViews(updatedViews)
    toast.success(`View "${viewName}" deleted`)
  }

  const handleSetDefault = (viewId) => {
    const updatedViews = views.map(v => ({
      ...v,
      isDefault: v.id === viewId
    }))
    saveViews(updatedViews)
    toast.success('Default view updated')
  }

  const handleRenameView = (viewId, newName) => {
    if (!newName.trim()) {
      toast.error('View name cannot be empty')
      return
    }

    const updatedViews = views.map(v => 
      v.id === viewId ? { ...v, name: newName } : v
    )
    saveViews(updatedViews)
    setEditingViewId(null)
    toast.success('View renamed')
  }

  return (
    <div className="flex items-center gap-2">
      {/* Save Current View Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSaveDialog(true)}
        icon={Save}
        title="Save current view"
      >
        Save View
      </Button>

      {/* Load View Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowLoadDialog(true)}
        icon={FolderOpen}
        title="Load saved view"
      >
        Load View
      </Button>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSaveDialog(false)} />
          
          <div className="relative bg-slate-800 rounded-lg shadow-xl w-96 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Save Current View</h3>
            
            <Input
              label="View Name"
              placeholder="e.g., Maintenance View, Active Fleet..."
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              autoFocus
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveView}>
                Save View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Load View Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowLoadDialog(false)} />
          
          <div className="relative bg-slate-800 rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Saved Views</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowLoadDialog(false)} icon={X} />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {views.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No saved views yet</p>
              ) : (
                views.map((view) => (
                  <div
                    key={view.id}
                    className="group relative p-3 hover:bg-slate-700 rounded-lg transition mb-2"
                  >
                    {editingViewId === view.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenameView(view.id, editingName)}
                          icon={Check}
                          className="text-green-400"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingViewId(null)}
                          icon={X}
                          className="text-red-400"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <button
                              onClick={() => handleLoadView(view)}
                              className="text-left w-full"
                            >
                              <p className="font-medium text-white flex items-center gap-2">
                                {view.name}
                                {view.isDefault && (
                                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                )}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(view.createdAt).toLocaleDateString()}
                              </p>
                            </button>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() => {
                                setEditingViewId(view.id)
                                setEditingName(view.name)
                              }}
                              className="p-1 hover:bg-slate-600 rounded"
                              title="Rename"
                            >
                              <Edit2 size={14} className="text-gray-400" />
                            </button>
                            
                            {!view.isDefault && (
                              <button
                                onClick={() => handleSetDefault(view.id)}
                                className="p-1 hover:bg-slate-600 rounded"
                                title="Set as default"
                              >
                                <Star size={14} className="text-gray-400" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteView(view.id, view.name)}
                              className="p-1 hover:bg-slate-600 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>

                        {/* Column preview */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {view.visibleColumns.slice(0, 5).map((col, i) => (
                            <span key={i} className="text-xs bg-slate-900 px-2 py-1 rounded">
                              {col}
                            </span>
                          ))}
                          {view.visibleColumns.length > 5 && (
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded">
                              +{view.visibleColumns.length - 5} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColumnViews
