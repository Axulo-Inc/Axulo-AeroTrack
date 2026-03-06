import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import Card from './Card'

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
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(pageSize)

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    
    return data.filter(row => {
      return columns.some(column => {
        if (!column.searchable) return false
        const value = row[column.accessor]
        if (value == null) return false
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, columns, searchTerm])

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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUp className="w-4 h-4 text-gray-500" />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-400" />
      : <ChevronDown className="w-4 h-4 text-blue-400" />
  }

  return (
    <Card className={className}>
      {/* Header with Title and Search */}
      {(title || searchable) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {searchable && (
            <div className="w-72">
              <Input
                icon={Search}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className={`p-4 ${column.sortable !== false && sortable ? 'cursor-pointer hover:text-white' : ''} ${column.className || ''}`}
                  onClick={() => column.sortable !== false && sortable && handleSort(column.accessor)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortable && getSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
              {actions && <th className="p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center text-gray-400">
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
                  {columns.map((column) => (
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

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              icon={ChevronsLeft}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              icon={ChevronLeft}
            />
            
            <span className="text-sm text-white mx-2">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              icon={ChevronRight}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              icon={ChevronsRight}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

export default DataTable
