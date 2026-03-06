import React from 'react'
import { Card } from '../ui'

const CardSkeleton = ({ count = 4, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <Card.Body>
            <div className="h-4 w-24 bg-slate-700 rounded mb-3"></div>
            <div className="h-8 w-32 bg-slate-700 rounded"></div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full bg-slate-700 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-700 rounded"></div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default CardSkeleton
