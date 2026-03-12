import { useState, useEffect } from "react"
import { 
  Card, 
  Tabs, 
  Select, 
  Button,
  Badge,
  LoadingSpinner
} from "../components/ui"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  Activity,
  DollarSign,
  Plane
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import analyticsService from "../services/analytics.service"
import { useToast } from "../components/ui"

function Analytics() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    aircraft: {
      total: 0,
      active: 0,
      maintenance: 0,
      grounded: 0,
      totalHours: 0,
      byType: []
    },
    defects: {
      total: 0,
      open: 0,
      inProgress: 0,
      closed: 0,
      bySeverity: [],
      byCategory: [],
      overTime: []
    },
    maintenance: {
      total: 0,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      byPriority: [],
      byType: []
    },
    inventory: {
      total: 0,
      totalValue: 0,
      lowStock: 0,
      critical: 0,
      outOfStock: 0,
      byCategory: []
    }
  })
  const [defectTrends, setDefectTrends] = useState([])
  const [costAnalysis, setCostAnalysis] = useState({ byType: [], byMonth: [] })
  const [utilization, setUtilization] = useState({
    utilizationRate: 0,
    openDefects: 0,
    scheduledMaintenance: 0
  })

  // Fetch all analytics data
  useEffect(() => {
    fetchAllAnalytics()
  }, [dateRange])

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true)
      
      // Get dashboard analytics
      const dashboardData = await analyticsService.getDashboardAnalytics()
      if (dashboardData.success) {
        setAnalytics(dashboardData.data)
      }
      
      // Get defect trends
      const trends = await analyticsService.getDefectTrends(dateRange)
      if (trends.success) {
        setDefectTrends(trends.data)
      }
      
      // Get cost analysis
      const costs = await analyticsService.getMaintenanceCostAnalysis()
      if (costs.success) {
        setCostAnalysis(costs.data)
      }
      
      // Get fleet utilization
      const util = await analyticsService.getFleetUtilization()
      if (util.success) {
        setUtilization(util.data)
      }
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatDefectTrendData = () => {
    if (!defectTrends.byDate) return []
    
    return Object.entries(defectTrends.byDate)
      .map(([date, data]) => ({
        date,
        total: data.total,
        Low: data.bySeverity.Low || 0,
        Medium: data.bySeverity.Medium || 0,
        High: data.bySeverity.High || 0,
        Critical: data.bySeverity.Critical || 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Last 30 days
  }

  const formatMaintenanceCostData = () => {
    if (!costAnalysis.byMonth) return []
    
    return Object.entries(costAnalysis.byMonth)
      .map(([month, data]) => ({
        month,
        cost: data.totalCost,
        count: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months
  }

  const defectByCategoryData = analytics.defects.byCategory?.map(item => ({
    name: item._id || 'Other',
    value: item.count,
    color: getCategoryColor(item._id)
  })) || []

  const defectBySeverityData = analytics.defects.bySeverity?.map(item => ({
    name: item._id,
    value: item.count,
    color: getSeverityColor(item._id)
  })) || []

  const maintenanceByTypeData = costAnalysis.byType ? 
    Object.entries(costAnalysis.byType).map(([type, data]) => ({
      name: type,
      count: data.count,
      cost: data.totalCost
    })) : []

  function getSeverityColor(severity) {
    switch(severity) {
      case 'Critical': return '#EF4444'
      case 'High': return '#F59E0B'
      case 'Medium': return '#3B82F6'
      case 'Low': return '#10B981'
      default: return '#6B7280'
    }
  }

  function getCategoryColor(category) {
    const colors = {
      'Mechanical': '#EF4444',
      'Electrical': '#3B82F6',
      'Hydraulic': '#10B981',
      'Avionics': '#8B5CF6',
      'Structural': '#F59E0B',
      'Other': '#6B7280'
    }
    return colors[category] || '#6B7280'
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ]

  if (loading) {
    return (
      <div className="p-6 text-white bg-slate-800 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <div className="flex gap-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={dateRangeOptions}
            className="w-40"
          />
          <Button variant="primary" icon={Download} onClick={() => {
            toast.info('Export feature coming soon')
          }}>
            Export Report
          </Button>
          <Button variant="ghost" icon={Activity} onClick={fetchAllAnalytics}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Fleet Utilization</p>
                <p className="text-2xl font-bold text-white">{utilization.utilizationRate}%</p>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.aircraft.active} of {analytics.aircraft.total} active
                </p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Plane className="text-blue-400" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Open Defects</p>
                <p className="text-2xl font-bold text-yellow-400">{analytics.defects.open || 0}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.defects.inProgress || 0} in progress
                </p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="text-yellow-400" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Maintenance Tasks</p>
                <p className="text-2xl font-bold text-white">{analytics.maintenance.total || 0}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.maintenance.scheduled || 0} scheduled
                </p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="text-purple-400" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Inventory Value</p>
                <p className="text-2xl font-bold text-green-400">
                  ${(analytics.inventory.totalValue || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.inventory.lowStock || 0} low stock items
                </p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="text-green-400" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Defect Trends */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Defect Trends</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatDefectTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Critical" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="High" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="Medium" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Low" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Defect Distribution */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Defects by Category</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={defectByCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {defectByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Maintenance Costs */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Maintenance Costs by Month</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatMaintenanceCostData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                  />
                  <Bar dataKey="cost" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Defect Severity */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Defects by Severity</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={defectBySeverityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {defectBySeverityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Fleet Health Summary */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="text-lg font-semibold">Fleet Health Summary</h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Aircraft Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Active</span>
                    <span className="text-green-400 font-bold">{analytics.aircraft.active || 0}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: analytics.aircraft.total ? `${(analytics.aircraft.active / analytics.aircraft.total) * 100}%` : '0%' }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white">In Maintenance</span>
                    <span className="text-yellow-400 font-bold">{analytics.aircraft.maintenance || 0}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: analytics.aircraft.total ? `${(analytics.aircraft.maintenance / analytics.aircraft.total) * 100}%` : '0%' }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white">Grounded</span>
                    <span className="text-red-400 font-bold">{analytics.aircraft.grounded || 0}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: analytics.aircraft.total ? `${(analytics.aircraft.grounded / analytics.aircraft.total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Defect Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Open</span>
                    <span className="text-yellow-400 font-bold">{analytics.defects.open || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">In Progress</span>
                    <span className="text-blue-400 font-bold">{analytics.defects.inProgress || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Closed (30d)</span>
                    <span className="text-green-400 font-bold">{defectTrends.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">High/Critical</span>
                    <span className="text-red-400 font-bold">{utilization.highSeverityDefects || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Maintenance Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Scheduled</span>
                    <span className="text-blue-400 font-bold">{analytics.maintenance.scheduled || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">In Progress</span>
                    <span className="text-yellow-400 font-bold">{analytics.maintenance.inProgress || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Completed</span>
                    <span className="text-green-400 font-bold">{analytics.maintenance.completed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Avg. Cost</span>
                    <span className="text-white font-bold">
                      ${(costAnalysis.averageCost || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Inventory Summary */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Inventory Status</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 rounded-lg">
              <p className="text-gray-400 text-sm">Total Parts</p>
              <p className="text-2xl font-bold text-white">{analytics.inventory.total || 0}</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <p className="text-gray-400 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-400">{analytics.inventory.lowStock || 0}</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <p className="text-gray-400 text-sm">Critical</p>
              <p className="text-2xl font-bold text-red-400">{analytics.inventory.critical || 0}</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-red-400">{analytics.inventory.outOfStock || 0}</p>
            </div>
          </div>

          {analytics.inventory.byCategory && analytics.inventory.byCategory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">By Category</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {analytics.inventory.byCategory.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <span className="text-white text-sm">{cat._id}</span>
                    <span className="text-blue-400 font-bold">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Analytics
