import React from 'react'
import { Card } from '../ui'

const ProfileSkeleton = () => {
  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen animate-pulse">
      <div className="h-8 w-48 bg-slate-700 rounded mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <Card.Body>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-slate-700 rounded-full mb-4"></div>
              <div className="h-6 w-40 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-slate-700 rounded mb-4"></div>
              <div className="h-10 w-full bg-slate-700 rounded"></div>
            </div>
          </Card.Body>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <Card.Body>
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between items-center pb-2 border-b border-slate-700 last:border-0">
                  <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  <div className="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ProfileSkeleton
