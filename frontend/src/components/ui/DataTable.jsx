import { useState, useMemo, useEffect } from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search,
  Columns,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import Card from './Card'
import { useToast } from './Toast'
import ColumnViews from './ColumnViews' // Add this import

// Sortable Table Header Component
const SortableHeader = ({ column, onSort, sortConfig, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column.accessor })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  }

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`p-4 relative group ${column.sortable !== false ? 'cursor-pointer hover:text-white' : ''} ${column.className || ''}`}
      onClick={() => column.sortable !== false && onSort(column.accessor)}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span>{column.header}</span>
        {column.sortable !== false && (
          <span className="ml-1">
            {sortConfig.key === column.accessor ? (
              sortConfig.direction === 'asc' ? 
                <ChevronUp className="w-4 h-4 text-blue-400" /> : 
                <ChevronDown className="w-4 h-4 text-blue-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100" />
            )}
          </span>
        )}
      </div>
    </th>
  )
}

const DataTable = ({
  data = [],
  columns = [],
  title,
  searchable = true,
  searchPlaceholder = 'Search...',
  sortable = true,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onRowClick,
  actions,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  storageKey = 'datatable',
  viewsStorageKey = 'table_views', // Add this
  defaultVisibleColumns = [],
  defaultColumnOrder = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(pageSize)
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const toast = useToast()

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize visible columns from localStorage or defaults
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_${title}_visible`)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved column preferences', e)
      }
    }
    
    if (defaultVisibleColumns.length > 0) {
      return columns
        .filter(col => defaultVisibleColumns.includes(col.accessor))
        .map(col => col.accessor)
    }
    
    return columns.map(col => col.accessor)
  })

  // Initialize column order from localStorage or defaults
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_${title}_order`)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved column order', e)
      }
    }
    
    if (defaultColumnOrder.length > 0) {
      return defaultColumnOrder
    }
    
    return columns.map(col => col.accessor)
  })

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem(`${storageKey}_${title}_visible`, JSON.stringify(visibleColumns))
  }, [visibleColumns, storageKey, title])

  useEffect(() => {
    localStorage.setItem(`${storageKey}_${title}_order`, JSON.stringify(columnOrder))
  }, [columnOrder, storageKey, title])

  // Get ordered and visible columns
  const orderedVisibleColumns = useMemo(() => {
    const visible = columns.filter(col => visibleColumns.includes(col.accessor))
    return visible.sort((a, b) => {
      const indexA = columnOrder.indexOf(a.accessor)
      const indexB = columnOrder.indexOf(b.accessor)
      return indexA - indexB
    })
  }, [columns, visibleColumns, columnOrder])

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    
    return data.filter(row => {
      return orderedVisibleColumns.some(column => {
        if (!column.searchable) return false
        const value = row[column.accessor]
        if (value == null) return false
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, orderedVisibleColumns, searchTerm])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = aVal.toString().toLowerCase()
      const bStr = bVal.toString().toLowerCase()

      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, itemsPerPage, pagination])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // View management functions
  const loadView = (view) => {
    if (view.visibleColumns) {
      setVisibleColumns(view.visibleColumns)
    }
    if (view.columnOrder) {
      setColumnOrder(view.columnOrder)
    }
    toast.success(`Loaded view: ${view.name}`)
  }

  const saveCurrentView = (viewName) => {
    const newView = {
      id: Date.now().toString(),
      name: viewName,
      visibleColumns,
      columnOrder,
      createdAt: new Date().toISOString()
    }
    return newView
  }

  const handleSort = (key) => {
    if (!sortable) return
    
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const toggleColumn = (accessor) => {
    setVisibleColumns(prev => {
      if (prev.length === 1 && prev.includes(accessor)) {
        toast.error('Cannot hide the last column')
        return prev
      }
      
      if (prev.includes(accessor)) {
        return prev.filter(col => col !== accessor)
      } else {
        return [...prev, accessor]
      }
    })
  }

  const showAllColumns = () => {
    setVisibleColumns(columns.map(col => col.accessor))
    toast.success('All columns visible')
  }

  const hideAllColumns = () => {
    if (columns.length > 0) {
      setVisibleColumns([columns[0].accessor])
      toast.info('Showing only first column')
    }
  }

  const resetToDefault = () => {
    if (defaultVisibleColumns.length > 0) {
      setVisibleColumns(defaultVisibleColumns)
    } else {
      setVisibleColumns(columns.map(col => col.accessor))
    }
    
    if (defaultColumnOrder.length > 0) {
      setColumnOrder(defaultColumnOrder)
    } else {
      setColumnOrder(columns.map(col => col.accessor))
    }
    
    toast.success('Reset to default layout')
  }

  // Handle drag end for column reordering
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      toast.success('Column order updated')
    }
  }

  return (
    <Card className={className}>
      {/* Header with Title, Search, and Column Controls */}
      {(title || searchable) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            {searchable && (
              <div className="flex-1 sm:w-72">
                <Input
                  icon={Search}
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            {/* Column Views - New */}
            <ColumnViews
              currentView={{
                name: 'Current',
                visibleColumns,
                columnOrder
              }}
              onLoadView={loadView}
              onSaveView={saveCurrentView}
              storageKey={`${viewsStorageKey}_${title}`}
            />
            
            {/* Column Visibility Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                icon={Columns}
                className="whitespace-nowrap"
              >
                Columns
              </Button>
              
              {showColumnSelector && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowColumnSelector(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                    <div className="p-3 border-b border-slate-700">
                      <h3 className="font-medium text-white text-sm">Show/Hide Columns</h3>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto p-2">
                      {columns.map((column) => (
                        <label
                          key={column.accessor}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-lg cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(column.accessor)}
                            onChange={() => toggleColumn(column.accessor)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex-1 text-sm text-gray-300">
                            {column.header}
                          </span>
                          {!visibleColumns.includes(column.accessor) && (
                            <EyeOff size={14} className="text-gray-500" />
                          )}
                        </label>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-slate-700 flex justify-between">
                      <Button variant="ghost" size="sm" onClick={showAllColumns}>All</Button>
                      <Button variant="ghost" size="sm" onClick={hideAllColumns}>None</Button>
                      <Button variant="ghost" size="sm" onClick={resetToDefault}>Reset</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-gray-400">
              <SortableContext
                items={orderedVisibleColumns.map(col => col.accessor)}
                strategy={horizontalListSortingStrategy}
              >
                <tr>
                  {orderedVisibleColumns.map((column) => (
                    <SortableHeader
                      key={column.accessor}
                      column={column}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />
                  ))}
                  {actions && <th className="p-4">Actions</th>}
                </tr>
              </SortableContext>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={orderedVisibleColumns.length + (actions ? 1 : 0)} className="p-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={orderedVisibleColumns.length + (actions ? 1 : 0)} className="p-8 text-center text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`border-t border-slate-800 hover:bg-slate-800 transition ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {orderedVisibleColumns.map((column) => (
                      <td key={column.accessor} className={`p-4 ${column.cellClassName || ''}`}>
                        {column.cell ? column.cell(row) : row[column.accessor]}
                      </td>
                    ))}
                    {actions && (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DndContext>

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
              {sortedData.length} entries
            </span>
            
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={pageSizeOptions.map(size => ({ value: size, label: `${size} per page` }))}
              className="w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1} icon={ChevronsLeft} />
            <Button variant="ghost" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} icon={ChevronLeft} />
            <span className="text-sm text-white mx-2">Page {currentPage} of {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} icon={ChevronRight} />
            <Button variant="ghost" size="sm" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} icon={ChevronsRight} />
          </div>
        </div>
      )}
    </Card>
  )
}

export default DataTable
