import React from 'react'
import { Card } from '../ui'

const DetailsSkeleton = () => {
  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen animate-pulse">
      {/* Back button */}
      <div className="h-5 w-24 bg-slate-700 rounded mb-6"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-slate-700 rounded"></div>
        <div className="h-10 w-32 bg-slate-700 rounded"></div>
      </div>

      {/* Health Status Card */}
      <Card className="mb-8">
        <Card.Body>
          <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
          <div className="h-6 w-32 bg-slate-700 rounded"></div>
        </Card.Body>
      </Card>

      {/* Defects Table Section */}
      <div className="h-7 w-40 bg-slate-700 rounded mb-4"></div>
      
      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-800 p-4 flex gap-4">
          <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
        </div>

        {/* Table Rows */}
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 border-t border-slate-700">
            <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
            <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
            <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default DetailsSkeleton
