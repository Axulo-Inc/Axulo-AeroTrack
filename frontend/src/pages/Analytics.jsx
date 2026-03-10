import { useState } from "react"
import { 
  Card, 
  Tabs, 
  Select, 
  Button,
  Badge
} from "../components/ui"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
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

function Analytics() {
  const [dateRange, setDateRange] = useState('30d')
  const [chartType, setChartType] = useState('overview')

  // Mock data for charts
  const defectTrendData = [
    { month: 'Jan', mechanical: 12, electrical: 8, hydraulic: 5, avionics: 3 },
    { month: 'Feb', mechanical: 15, electrical: 10, hydraulic: 7, avionics: 4 },
    { month: 'Mar', mechanical: 11, electrical: 9, hydraulic: 6, avionics: 5 },
    { month: 'Apr', mechanical: 8, electrical: 12, hydraulic: 4, avionics: 7 },
    { month: 'May', mechanical: 10, electrical: 7, hydraulic: 8, avionics: 6 },
    { month: 'Jun', mechanical: 13, electrical: 11, hydraulic: 9, avionics: 8 },
  ]

  const mtbfData = [
    { aircraft: 'ZS-ABC', mtbf: 245, type: 'A320' },
    { aircraft: 'ZS-DEF', mtbf: 189, type: 'B737' },
    { aircraft: 'ZS-GHI', mtbf: 312, type: 'A320' },
    { aircraft: 'ZS-JKL', mtbf: 278, type: 'B777' },
    { aircraft: 'ZS-MNO', mtbf: 156, type: 'A330' },
    { aircraft: 'ZS-PQR', mtbf: 223, type: 'B787' },
    { aircraft: 'ZS-STU', mtbf: 198, type: 'A380' },
    { aircraft: 'ZS-VWX', mtbf: 267, type: 'B747' },
  ]

  const utilizationData = [
    { month: 'Jan', flightHours: 2450, groundTime: 320, maintenance: 180 },
    { month: 'Feb', flightHours: 2320, groundTime: 290, maintenance: 210 },
    { month: 'Mar', flightHours: 2680, groundTime: 310, maintenance: 150 },
    { month: 'Apr', flightHours: 2540, groundTime: 280, maintenance: 190 },
    { month: 'May', flightHours: 2780, groundTime: 300, maintenance: 170 },
    { month: 'Jun', flightHours: 2910, groundTime: 330, maintenance: 200 },
  ]

  const costData = [
    { category: 'Engine', cost: 45000 },
    { category: 'Hydraulic', cost: 28000 },
    { category: 'Avionics', cost: 35000 },
    { category: 'Landing Gear', cost: 32000 },
    { category: 'Electrical', cost: 18000 },
    { category: 'Structure', cost: 22000 },
  ]

  const defectByTypeData = [
    { name: 'Mechanical', value: 35, color: '#EF4444' },
    { name: 'Electrical', value: 28, color: '#3B82F6' },
    { name: 'Hydraulic', value: 20, color: '#10B981' },
    { name: 'Avionics', value: 17, color: '#F59E0B' },
  ]

  const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
  ]

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <Card.Body>
                <p className="text-gray-400 text-sm">Fleet Utilization</p>
                <p className="text-2xl font-bold text-white">87.3%</p>
                <p className="text-xs text-green-400 mt-1">↑ 2.1% vs last month</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-gray-400 text-sm">MTBF (Avg)</p>
                <p className="text2xl font-bold text-white">233 hrs</p>
                <p className="text-xs text-red-400 mt-1">↓ 5.2% vs last month</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-gray-400 text-sm">Open Defects</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )
    }
  ]

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
          <Button variant="primary" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Fleet Utilization</p>
                <p className="text-2xl font-bold text-white">87.3%</p>
                <p className="text-xs text-green-400 mt-1">↑ 2.1% vs last month</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="text-blue-400" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">MTBF (Avg)</p>
                <p className="text-2xl font-bold text-white">233 hrs</p>
                <p className="text-xs text-red-400 mt-1">↓ 5.2% vs last month</p>
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
                <p className="text-gray-400 text-sm">Open Defects</p>
                <p className="text-2xl font-bold text-yellow-400">7</p>
                <p className="text-xs text-yellow-400 mt-1">3 high priority</p>
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
                <p className="text-gray-400 text-sm">Maintenance Cost</p>
                <p className="text-2xl font-bold text-white">$180K</p>
                <p className="text-xs text-green-400 mt-1">↓ 3.2% vs last month</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingDown className="text-green-400" size={20} />
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
            <h3 className="text-lg font-semibold">Defect Trends by Category</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={defectTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="mechanical" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="electrical" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="hydraulic" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="avionics" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Defect Distribution */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Defects by Type</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {defectByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* MTBF Chart */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">MTBF by Aircraft (hours)</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mtbfData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="aircraft" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="mtbf" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Utilization Chart */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Aircraft Utilization</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="flightHours" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="groundTime" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Cost Analysis */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="text-lg font-semibold">Maintenance Cost by Category</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                  />
                  <Bar dataKey="cost" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Top Recommendations</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-white font-medium">ZS-DEF showing increased vibration</p>
                  <p className="text-xs text-gray-400 mt-1">Schedule inspection within 7 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                <TrendingUp className="text-blue-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-white font-medium">Hydraulic pump failure rate increasing</p>
                  <p className="text-xs text-gray-400 mt-1">Consider proactive replacement program</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-white font-medium">ZS-ABC exceeded 98% uptime</p>
                  <p className="text-xs text-gray-400 mt-1">Best performing aircraft this month</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Fleet Health Summary</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Healthy</span>
                <span className="text-green-400 font-bold">6 aircraft</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400">Warning</span>
                <span className="text-yellow-400 font-bold">1 aircraft</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '12.5%' }} />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400">Critical</span>
                <span className="text-red-400 font-bold">1 aircraft</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '12.5%' }} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <Button variant="primary" fullWidth>Generate Full Report</Button>
              <Button variant="secondary" fullWidth>Schedule Maintenance Review</Button>
              <Button variant="ghost" fullWidth>Export Data for Analysis</Button>
              <Button variant="ghost" fullWidth>View Detailed MTBF Report</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
