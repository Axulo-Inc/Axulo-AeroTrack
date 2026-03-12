import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DataTable, 
  Badge, 
  Button, 
  Card, 
  useToast,
  Tabs,
  Modal,
  Input,
  Select,
  LoadingSpinner
} from "../components/ui"
import { 
  Wrench, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Plus,
  RefreshCw,
  Filter,
  XCircle
} from 'lucide-react'
import maintenanceService from "../services/maintenance.service"
import aircraftService from "../services/aircraft.service"

function Maintenance() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [aircraft, setAircraft] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    byPriority: [],
    byType: []
  })
  const [activeTab, setActiveTab] = useState('scheduled')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newTask, setNewTask] = useState({
    aircraft: '',
    task: '',
    type: 'Scheduled',
    priority: 'Medium',
    status: 'Scheduled',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedHours: '',
    assignedTo: [],
    notes: ''
  })

  // Fetch data on load
  useEffect(() => {
    fetchMaintenanceData()
    fetchAircraft()
  }, [])

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true)
      
      // Fetch all maintenance tasks
      const tasksResponse = await maintenanceService.getAllMaintenance({ limit: 100 })
      if (tasksResponse.success) {
        setTasks(tasksResponse.data)
      }
      
      // Fetch maintenance stats
      const statsResponse = await maintenanceService.getMaintenanceStats()
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
      
    } catch (error) {
      console.error('Failed to fetch maintenance data:', error)
      toast.error('Failed to load maintenance data')
    } finally {
      setLoading(false)
    }
  }

  const fetchAircraft = async () => {
    try {
      const response = await aircraftService.getAllAircraft({ limit: 100 })
      if (response.success) {
        setAircraft(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch aircraft:', error)
    }
  }

  const handleCreateTask = async () => {
    if (!newTask.aircraft || !newTask.task || !newTask.scheduledDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    
    try {
      const response = await maintenanceService.createMaintenance(newTask)
      
      if (response.success) {
        // Refresh data
        await fetchMaintenanceData()
        setShowModal(false)
        setNewTask({
          aircraft: '',
          task: '',
          type: 'Scheduled',
          priority: 'Medium',
          status: 'Scheduled',
          scheduledDate: new Date().toISOString().split('T')[0],
          estimatedHours: '',
          assignedTo: [],
          notes: ''
        })
        toast.success('Maintenance task created successfully')
      }
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error(error.message || 'Failed to create maintenance task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateProgress = async (taskId, progress) => {
    try {
      const response = await maintenanceService.updateProgress(taskId, progress)
      
      if (response.success) {
        await fetchMaintenanceData()
        toast.success('Progress updated')
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
      toast.error('Failed to update progress')
    }
  }

  const columns = [
    {
      header: 'Aircraft',
      accessor: 'aircraft',
      cell: (row) => {
        const aircraftInfo = aircraft.find(a => a._id === row.aircraft) || {}
        return (
          <div>
            <div className="font-medium">{aircraftInfo.registration || 'Unknown'}</div>
            <div className="text-xs text-gray-400">{aircraftInfo.type || ''}</div>
          </div>
        )
      },
    },
    {
      header: 'Task',
      accessor: 'task',
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => {
        const typeColors = {
          'Scheduled': 'bg-blue-500/20 text-blue-400',
          'Unscheduled': 'bg-yellow-500/20 text-yellow-400',
          'Inspection': 'bg-purple-500/20 text-purple-400',
          'Repair': 'bg-orange-500/20 text-orange-400',
          'Overhaul': 'bg-red-500/20 text-red-400',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${typeColors[row.type] || 'bg-gray-500/20 text-gray-400'}`}>
            {row.type}
          </span>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const statusColors = {
          'Scheduled': 'bg-blue-500/20 text-blue-400',
          'In Progress': 'bg-yellow-500/20 text-yellow-400',
          'Completed': 'bg-green-500/20 text-green-400',
          'Cancelled': 'bg-gray-500/20 text-gray-400',
          'Deferred': 'bg-red-500/20 text-red-400',
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
      header: 'Progress',
      accessor: 'progress',
      cell: (row) => {
        if (row.status === 'Completed') return <CheckCircle size={18} className="text-green-400" />
        if (row.progress !== undefined) {
          return (
            <div className="w-24">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${row.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">{row.progress}%</span>
            </div>
          )
        }
        return <Clock size={18} className="text-gray-400" />
      },
    },
  ]

  const handleRowClick = (task) => {
    navigate(`/maintenance/${task._id}`)
  }

  const actions = (row) => (
    <>
      {row.status !== 'Completed' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            const newProgress = Math.min((row.progress || 0) + 10, 100)
            handleUpdateProgress(row._id, newProgress)
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

  // Filter tasks by status for tabs
  const scheduledTasks = tasks.filter(t => t.status === 'Scheduled')
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress')
  const completedTasks = tasks.filter(t => t.status === 'Completed')

  const tabs = [
    {
      id: 'scheduled',
      label: 'Scheduled',
      badge: scheduledTasks.length,
      content: (
        <DataTable
          data={scheduledTasks}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No scheduled maintenance"
          storageKey="maintenance_scheduled"
        />
      ),
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      badge: inProgressTasks.length,
      content: (
        <DataTable
          data={inProgressTasks}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No maintenance in progress"
          storageKey="maintenance_progress"
        />
      ),
    },
    {
      id: 'completed',
      label: 'Completed',
      badge: completedTasks.length,
      content: (
        <DataTable
          data={completedTasks}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No completed maintenance"
          storageKey="maintenance_completed"
        />
      ),
    },
    {
      id: 'all',
      label: 'All Tasks',
      badge: tasks.length,
      content: (
        <DataTable
          data={tasks}
          columns={columns}
          onRowClick={handleRowClick}
          actions={actions}
          emptyMessage="No maintenance tasks"
          storageKey="maintenance_all"
        />
      ),
    },
  ]

  const aircraftOptions = aircraft.map(a => ({
    value: a._id,
    label: `${a.registration} - ${a.type}`
  }))

  const typeOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Unscheduled', label: 'Unscheduled' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Repair', label: 'Repair' },
    { value: 'Overhaul', label: 'Overhaul' }
  ]

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance Management</h1>
        <div className="flex gap-3">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowModal(true)}
          >
            Schedule Maintenance
          </Button>
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={fetchMaintenanceData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-white">{stats.total || tasks.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Scheduled</p>
            <p className="text-2xl font-bold text-blue-400">{stats.scheduled || scheduledTasks.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.inProgress || inProgressTasks.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400">{stats.completed || completedTasks.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-red-400">
              {tasks.filter(t => t.priority === 'High' || t.priority === 'Critical').length}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs tabs={tabs} defaultTab="scheduled" variant="pills" />

      {/* Schedule Maintenance Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Schedule Maintenance"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateTask}
              isLoading={submitting}
            >
              Schedule
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Aircraft *"
            options={aircraftOptions}
            value={newTask.aircraft}
            onChange={(e) => setNewTask({ ...newTask, aircraft: e.target.value })}
            placeholder="Select aircraft"
          />

          <Input
            label="Task Description *"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            placeholder="e.g., 100-Hour Inspection"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              options={typeOptions}
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            />

            <Select
              label="Priority"
              options={priorityOptions}
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Scheduled Date *"
              value={newTask.scheduledDate}
              onChange={(e) => setNewTask({ ...newTask, scheduledDate: e.target.value })}
            />

            <Input
              type="number"
              label="Estimated Hours"
              value={newTask.estimatedHours}
              onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
              placeholder="e.g., 8"
            />
          </div>

          <Input
            label="Notes"
            value={newTask.notes}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            placeholder="Additional notes..."
          />
        </div>
      </Modal>
    </div>
  )
}

export default Maintenance
