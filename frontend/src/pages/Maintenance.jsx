import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DataTable, 
  Badge, 
  Button, 
  Card, 
  useToast,
  Tabs 
} from "../components/ui"
import { 
  Wrench, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Filter,
  Plus
} from 'lucide-react'

function Maintenance() {
  const navigate = useNavigate()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('scheduled')

  // Mock maintenance data
  const [maintenanceTasks] = useState([
    { 
      id: 1, 
      aircraft: "ZS-ABC", 
      type: "A320",
      task: "100-Hour Inspection", 
      status: "Scheduled", 
      priority: "Medium",
      scheduledDate: "2024-03-15",
      estimatedHours: 8,
      assignedTo: "John Doe"
    },
    { 
      id: 2, 
      aircraft: "ZS-DEF", 
      type: "B737",
      task: "Engine Oil Change", 
      status: "In Progress", 
      priority: "High",
      scheduledDate: "2024-03-10",
      estimatedHours: 4,
      assignedTo: "Jane Smith",
      progress: 60
    },
    { 
      id: 3, 
      aircraft: "ZS-GHI", 
      type: "A320",
      task: "Landing Gear Inspection", 
      status: "Completed", 
      priority: "High",
      scheduledDate: "2024-03-05",
      completedDate: "2024-03-05",
      estimatedHours: 6,
      assignedTo: "Mike Johnson"
    },
    { 
      id: 4, 
      aircraft: "ZS-JKL", 
      type: "B777",
      task: "Avionics Software Update", 
      status: "Scheduled", 
      priority: "Low",
      scheduledDate: "2024-03-20",
      estimatedHours: 2,
      assignedTo: "Sarah Williams"
    },
    { 
      id: 5, 
      aircraft: "ZS-MNO", 
      type: "A330",
      task: "Hydraulic System Check", 
      status: "In Progress", 
      priority: "Medium",
      scheduledDate: "2024-03-08",
      estimatedHours: 5,
      assignedTo: "Tom Brown",
      progress: 30
    },
  ])

  const columns = [
    {
      header: 'Aircraft',
      accessor: 'aircraft',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.aircraft}</div>
          <div className="text-xs text-gray-400">{row.type}</div>
        </div>
      ),
    },
    {
      header: 'Task',
      accessor: 'task',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const statusColors = {
          'Scheduled': 'bg-blue-500/20 text-blue-400',
          'In Progress': 'bg-yellow-500/20 text-yellow-400',
          'Completed': 'bg-green-500/20 text-green-400',
          'Delayed': 'bg-red-500/20 text-red-400',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status] || 'bg-gray-500/20 text-gray-400'}`}>
            {row.status}
          </span>
        )
      },
    },
    {
      header: 'Priority',
      accessor: 'priority',
      cell: (row) => <Badge.Status status={row.priority} />,
    },
    {
      header: 'Scheduled',
      accessor: 'scheduledDate',
      cell: (row) => new Date(row.scheduledDate).toLocaleDateString(),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo',
    },
    {
      header: 'Progress',
      accessor: 'progress',
      cell: (row) => {
        if (row.status === 'Completed') return <CheckCircle size={18} className="text-green-400" />
        if (row.progress) {
          return (
            <div className="w-20">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            </div>
          )
        }
        return <Clock size={18} className="text-gray-400" />
      },
    },
  ]

  const handleRowClick = (task) => {
    navigate(`/maintenance/${task.id}`)
  }

  const actions = (row) => (
    <>
      {row.status !== 'Completed' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            toast.success(`Task ${row.id} updated`)
          }}
        >
          Update
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          toast.info(`Viewing details for ${row.task}`)
        }}
      >
        Details
      </Button>
    </>
  )

  // Summary statistics
  const totalTasks = maintenanceTasks.length
  const scheduled = maintenanceTasks.filter(t => t.status === 'Scheduled').length
  const inProgress = maintenanceTasks.filter(t => t.status === 'In Progress').length
  const completed = maintenanceTasks.filter(t => t.status === 'Completed').length
  const highPriority = maintenanceTasks.filter(t => t.priority === 'High').length

  const tabs = [
    {
      id: 'scheduled',
      label: 'Scheduled',
      badge: scheduled,
      content: (
        <DataTable
          data={maintenanceTasks.filter(t => t.status === 'Scheduled')}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No scheduled maintenance"
        />
      ),
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      badge: inProgress,
      content: (
        <DataTable
          data={maintenanceTasks.filter(t => t.status === 'In Progress')}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No maintenance in progress"
        />
      ),
    },
    {
      id: 'completed',
      label: 'Completed',
      badge: completed,
      content: (
        <DataTable
          data={maintenanceTasks.filter(t => t.status === 'Completed')}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No completed maintenance"
        />
      ),
    },
    {
      id: 'all',
      label: 'All Tasks',
      badge: totalTasks,
      content: (
        <DataTable
          data={maintenanceTasks}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No maintenance tasks"
        />
      ),
    },
  ]

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance Management</h1>
        <div className="flex gap-3">
          <Button
            variant="primary"
            icon={Plus}
          >
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-white">{totalTasks}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Scheduled</p>
            <p className="text-2xl font-bold text-blue-400">{scheduled}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-400">{inProgress}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completed}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-red-400">{highPriority}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs tabs={tabs} defaultTab="scheduled" variant="pills" />
    </div>
  )
}

export default Maintenance
