import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { DataTable, Badge, Button, useToast } from "../components/ui"
import { ExportFleetButton } from "../components/ui/ExportButton"
import { Plane, RefreshCw } from 'lucide-react'
import { TableSkeleton } from '../components/skeletons'

function Fleet() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [fleet, setFleet] = useState([
    { id: 1, registration: "ZS-ABC", type: "A320", status: "Active", hours: 12450, cycles: 8450, lastMaintenance: "2024-02-15" },
    { id: 2, registration: "ZS-DEF", type: "B737", status: "Maintenance", hours: 15620, cycles: 10200, lastMaintenance: "2024-01-20" },
    { id: 3, registration: "ZS-GHI", type: "A320", status: "Active", hours: 9870, cycles: 6540, lastMaintenance: "2024-02-28" },
    { id: 4, registration: "ZS-JKL", type: "B777", status: "Active", hours: 20340, cycles: 7890, lastMaintenance: "2024-02-10" },
    { id: 5, registration: "ZS-MNO", type: "A330", status: "Active", hours: 15420, cycles: 9230, lastMaintenance: "2024-02-20" },
    { id: 6, registration: "ZS-PQR", type: "B787", status: "Maintenance", hours: 8760, cycles: 5430, lastMaintenance: "2024-01-05" },
    { id: 7, registration: "ZS-STU", type: "A380", status: "Active", hours: 32100, cycles: 12500, lastMaintenance: "2024-02-01" },
    { id: 8, registration: "ZS-VWX", type: "B747", status: "Active", hours: 28760, cycles: 11200, lastMaintenance: "2024-02-18" },
  ])

  // Simulate loading data
  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Fleet data refreshed')
    }, 1000)
  }

  const columns = [
    {
      header: 'Registration',
      accessor: 'registration',
      searchable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Plane className="text-blue-400" size={16} />
          <span className="font-semibold">{row.registration}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      searchable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      searchable: true,
      cell: (row) => <Badge.Status status={row.status} />,
    },
    {
      header: 'Flight Hours',
      accessor: 'hours',
      searchable: false,
      cell: (row) => row.hours.toLocaleString(),
    },
    {
      header: 'Cycles',
      accessor: 'cycles',
      searchable: false,
      cell: (row) => row.cycles.toLocaleString(),
    },
    {
      header: 'Last Maintenance',
      accessor: 'lastMaintenance',
      searchable: false,
      cell: (row) => new Date(row.lastMaintenance).toLocaleDateString(),
    },
  ]

  const handleRowClick = (aircraft) => {
    navigate(`/fleet/${aircraft.id}`)
  }

  const actions = (row) => (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/fleet/${row.id}/maintenance`)
        }}
      >
        Schedule
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          toast.info(`Viewing details for ${row.registration}`)
        }}
      >
        Details
      </Button>
    </>
  )

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <div className="flex gap-3">
          {/* Export Button */}
          <ExportFleetButton 
            data={fleet} 
            variant="dropdown" 
            size="md"
          />
          
          {/* Refresh Button */}
          <Button
            variant="primary"
            onClick={refreshData}
            icon={RefreshCw}
            isLoading={loading}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Show skeleton when loading, otherwise show DataTable */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} hasActions={true} />
      ) : (
        <DataTable
          title="Aircraft Fleet"
          data={fleet}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by registration, type, or status..."
          sortable={true}
          pagination={true}
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 50]}
          onRowClick={handleRowClick}
          actions={actions}
          loading={false}
          emptyMessage="No aircraft found matching your search"
          className="mb-6"
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Aircraft</p>
          <p className="text-2xl font-bold text-blue-600">{fleet.length}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {fleet.filter(a => a.status === 'Active').length}
          </p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">In Maintenance</p>
          <p className="text-2xl font-bold text-yellow-400">
            {fleet.filter(a => a.status === 'Maintenance').length}
          </p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Flight Hours</p>
          <p className="text-2xl font-bold text-white">
            {fleet.reduce((acc, a) => acc + a.hours, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Fleet
