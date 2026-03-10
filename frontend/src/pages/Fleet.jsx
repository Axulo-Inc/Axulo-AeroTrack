import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { DataTable, Badge, Button, useToast } from "../components/ui"
import { ExportFleetButton } from "../components/ui/ExportButton"
import { PrintFleetReport } from "../components/ui/PrintButton"
import { EmailFleetReport } from "../components/ui/EmailScheduleButton"
import { Plane, RefreshCw, Loader2 } from 'lucide-react'
import { TableSkeleton } from '../components/skeletons'
import aircraftService from "../services/aircraft.service"

function Fleet() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [fleet, setFleet] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Fetch real aircraft data from backend
  const fetchAircraft = async (page = 1) => {
    try {
      setLoading(true)
      const response = await aircraftService.getAllAircraft({ 
        page, 
        limit: pagination.limit 
      })
      
      if (response.success) {
        setFleet(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch aircraft:', error)
      toast.error('Failed to load fleet data')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchAircraft()
  }, [])

  const refreshData = () => {
    fetchAircraft(pagination.page)
    toast.success('Fleet data refreshed')
  }

  const handlePageChange = (newPage) => {
    fetchAircraft(newPage)
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
      cell: (row) => row.hours?.toLocaleString() || '0',
    },
    {
      header: 'Cycles',
      accessor: 'cycles',
      searchable: false,
      cell: (row) => row.cycles?.toLocaleString() || '0',
    },
    {
      header: 'Last Maintenance',
      accessor: 'lastMaintenance',
      searchable: false,
      cell: (row) => row.lastMaintenance ? new Date(row.lastMaintenance).toLocaleDateString() : 'N/A',
    },
  ]

  const handleRowClick = (aircraft) => {
    navigate(`/fleet/${aircraft._id}`)
  }

  const actions = (row) => (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/fleet/${row._id}/maintenance`)
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

  // Calculate summary statistics from real data
  const totalAircraft = fleet.length
  const activeCount = fleet.filter(a => a.status === 'Active').length
  const maintenanceCount = fleet.filter(a => a.status === 'Maintenance').length
  const totalHours = fleet.reduce((acc, a) => acc + (a.hours || 0), 0)

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <div className="flex gap-3">
          <EmailFleetReport 
            data={fleet}
            recipients={['thabang@axulo.aero']}
          />
          
          <PrintFleetReport 
            data={fleet}
            variant="dropdown"
            size="md"
          />
          
          <ExportFleetButton 
            data={fleet} 
            variant="dropdown" 
            size="md"
          />
          
          <Button
            variant="primary"
            onClick={refreshData}
            icon={RefreshCw}
            isLoading={loading}
          >
            Refresh
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
          pageSize={pagination.limit}
          pageSizeOptions={[5, 10, 25, 50]}
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          actions={actions}
          loading={false}
          emptyMessage="No aircraft found matching your search"
          className="mb-6"
          storageKey="fleet_columns"
          viewsStorageKey="fleet_views"
          defaultVisibleColumns={['registration', 'type', 'status', 'hours']}
          defaultColumnOrder={['registration', 'type', 'status', 'hours', 'cycles', 'lastMaintenance']}
        />
      )}

      {/* Summary Cards with real data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Aircraft</p>
          <p className="text-2xl font-bold text-blue-600">{totalAircraft}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">In Maintenance</p>
          <p className="text-2xl font-bold text-yellow-400">{maintenanceCount}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Flight Hours</p>
          <p className="text-2xl font-bold text-white">{totalHours.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Fleet
