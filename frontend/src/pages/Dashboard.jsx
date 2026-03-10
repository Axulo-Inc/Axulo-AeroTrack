import { useState, useEffect } from "react"
import StatCard from "../components/StatCard"
import { Button, useToast } from "../components/ui"
import DefectTrendChart from "../components/Charts/DefectTrendChart"
import MTBFChart from "../components/Charts/MTBFChart"
import FleetHealthGauge from "../components/Charts/FleetHealthGauge"
import { useTheme } from "../contexts/ThemeContext"
import aircraftService from "../services/aircraft.service"
import { Loader2 } from 'lucide-react'

function Dashboard() {
  const toast = useToast()
  const { colors } = useTheme()
  const [loading, setLoading] = useState(true)
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
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Fleet Overview</h1>
        
        <Button 
          size="sm" 
          onClick={refreshData}
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid - Now with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Aircraft" value={stats.total || 0} />
        <StatCard title="Active" value={stats.active || 0} color="text-green-400" />
        <StatCard title="In Maintenance" value={stats.maintenance || 0} color="text-yellow-400" />
        <StatCard title="Total Flight Hours" value={(stats.totalHours || 0).toLocaleString()} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DefectTrendChart />
        <FleetHealthGauge />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <MTBFChart />
      </div>
    </div>
  )
}

export default Dashboard
