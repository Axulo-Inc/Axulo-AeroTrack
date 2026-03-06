import React from 'react'
import { Card } from '../ui'

const TableSkeleton = ({ rows = 5, columns = 4, hasActions = false }) => {
  return (
    <Card className="animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-7 w-48 bg-slate-700 rounded"></div>
        <div className="h-10 w-64 bg-slate-700 rounded"></div>
      </div>

      {/* Table Header */}
      <div className="flex gap-4 mb-4 pb-2 border-b border-slate-700">
        {Array(columns).fill(0).map((_, i) => (
          <div key={i} className="h-4 w-24 bg-slate-700 rounded"></div>
        ))}
        {hasActions && <div className="h-4 w-20 bg-slate-700 rounded ml-auto"></div>}
      </div>

      {/* Table Rows */}
      {Array(rows).fill(0).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-4 border-b border-slate-700 last:border-0">
          {Array(columns).fill(0).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
          {hasActions && (
            <div className="flex gap-2 ml-auto">
              <div className="h-8 w-16 bg-slate-700 rounded"></div>
              <div className="h-8 w-16 bg-slate-700 rounded"></div>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
        <div className="h-8 w-48 bg-slate-700 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-700 rounded"></div>
          <div className="h-8 w-8 bg-slate-700 rounded"></div>
          <div className="h-8 w-8 bg-slate-700 rounded"></div>
          <div className="h-8 w-8 bg-slate-700 rounded"></div>
        </div>
      </div>
    </Card>
  )
}

export default TableSkeleton
