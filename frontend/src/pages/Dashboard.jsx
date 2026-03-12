import { useState, useEffect } from "react"
import StatCard from "../components/StatCard"
import { Button, useToast } from "../components/ui"
import DefectTrendChart from "../components/Charts/DefectTrendChart"
import MTBFChart from "../components/Charts/MTBFChart"
import FleetHealthGauge from "../components/Charts/FleetHealthGauge"
import AircraftMap from "../components/Map/AircraftMap"
import FleetRiskDashboard from "../components/PredictiveMaintenance/FleetRiskDashboard"
import { useTheme } from "../contexts/ThemeContext"
import aircraftService from "../services/aircraft.service"
import { Loader2, Map, List } from 'lucide-react'

function Dashboard() {
  const toast = useToast()
  const { colors } = useTheme()
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('both') // 'stats', 'map', 'both'
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    grounded: 0,
    totalHours: 0,
    byType: []
  })

  // Fetch real data from backend
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('Fetching dashboard data...')
      
      // Get aircraft stats
      const statsResponse = await aircraftService.getAircraftStats()
      console.log('Stats response:', statsResponse)
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data)
        console.log('Stats set:', statsResponse.data)
      } else {
        console.error('Invalid stats response:', statsResponse)
        toast.error('Failed to load dashboard data')
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setLoading(true)
    fetchDashboardData()
    toast.success('Dashboard data refreshed')
  }

  if (loading) {
    return (
      <div className={`${colors.bg.primary} p-6 min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${colors.bg.primary} p-6 min-h-screen`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Fleet Operations Center</h1>
        
        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('stats')}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === 'stats' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === 'map' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Map size={18} />
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === 'both' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Both
            </button>
          </div>
          
          <Button 
            size="sm" 
            onClick={refreshData}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Grid - Always visible except in map-only mode */}
      {viewMode !== 'map' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Aircraft" value={stats.total || 0} />
            <StatCard title="Active" value={stats.active || 0} color="text-green-400" />
            <StatCard title="In Maintenance" value={stats.maintenance || 0} color="text-yellow-400" />
            <StatCard title="Total Flight Hours" value={(stats.totalHours || 0).toLocaleString()} />
          </div>

          {/* Charts Grid - Only show in stats or both mode */}
          {viewMode !== 'map' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DefectTrendChart />
                <FleetHealthGauge />
              </div>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                <MTBFChart />
              </div>

              {/* AI Predictive Maintenance - No duplicate header */}
              <div className="mt-12">
                <FleetRiskDashboard />
              </div>
            </>
          )}
        </>
      )}

      {/* Live Aircraft Map - Visible in map or both mode */}
      {viewMode !== 'stats' && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">Live Aircraft Tracking</h2>
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <AircraftMap />
          
          {/* Quick Stats Overlay for Map Mode */}
          {viewMode === 'map' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <StatCard title="Total Aircraft" value={stats.total || 0} size="sm" />
              <StatCard title="Active" value={stats.active || 0} color="text-green-400" size="sm" />
              <StatCard title="In Maintenance" value={stats.maintenance || 0} color="text-yellow-400" size="sm" />
              <StatCard title="Total Hours" value={(stats.totalHours || 0).toLocaleString()} size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Fleet Summary by Type */}
      {viewMode !== 'map' && stats.byType && stats.byType.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Fleet Composition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.byType.map((type, index) => (
              <div key={index} className="bg-slate-900 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">{type._id}</p>
                <p className="text-2xl font-bold text-white">{type.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
