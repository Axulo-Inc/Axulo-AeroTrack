import React from 'react'
import { Card } from '../ui'

const ChartSkeleton = ({ type = 'bar', height = 'h-80' }) => {
  return (
    <Card className={`animate-pulse ${height}`}>
      <Card.Body>
        <div className="h-5 w-48 bg-slate-700 rounded mb-6"></div>
        
        {/* Chart area */}
        <div className="h-48 bg-slate-700 rounded-lg mb-4 relative overflow-hidden">
          {/* Simulated chart lines/bars */}
          <div className="absolute bottom-0 left-0 w-full h-32 flex items-end justify-around px-4">
            {Array(8).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="w-8 bg-slate-600 rounded-t"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-around mt-2">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-3 w-10 bg-slate-700 rounded"></div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ChartSkeleton
