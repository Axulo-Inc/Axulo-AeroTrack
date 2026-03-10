import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DataTable, 
  Badge, 
  Button, 
  Card, 
  useToast,
  Input 
} from "../components/ui"
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

function Inventory() {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock inventory data
  const [inventory] = useState([
    { 
      id: 1, 
      partNumber: "HYD-001", 
      name: "Hydraulic Pump", 
      category: "Hydraulic",
      stock: 4, 
      minRequired: 2, 
      maxStock: 10,
      unitCost: 12500,
      location: "A1-03",
      supplier: "AviaParts",
      lastOrdered: "2024-02-15",
      status: "In Stock"
    },
    { 
      id: 2, 
      partNumber: "ENG-045", 
      name: "Oil Filter", 
      category: "Engine",
      stock: 15, 
      minRequired: 10, 
      maxStock: 30,
      unitCost: 850,
      location: "B2-07",
      supplier: "AeroSupply",
      lastOrdered: "2024-02-20",
      status: "In Stock"
    },
    { 
      id: 3, 
      partNumber: "BRK-023", 
      name: "Brake Pad Set", 
      category: "Landing Gear",
      stock: 2, 
      minRequired: 4, 
      maxStock: 8,
      unitCost: 3200,
      location: "C3-12",
      supplier: "BrakeTech",
      lastOrdered: "2024-01-10",
      status: "Low Stock"
    },
    { 
      id: 4, 
      partNumber: "AVN-112", 
      name: "Navigation Unit", 
      category: "Avionics",
      stock: 1, 
      minRequired: 1, 
      maxStock: 3,
      unitCost: 45000,
      location: "D4-01",
      supplier: "Garmin",
      lastOrdered: "2024-02-05",
      status: "Critical"
    },
    { 
      id: 5, 
      partNumber: "LGT-078", 
      name: "Landing Light", 
      category: "Lighting",
      stock: 8, 
      minRequired: 5, 
      maxStock: 15,
      unitCost: 950,
      location: "A2-09",
      supplier: "LightingTech",
      lastOrdered: "2024-02-18",
      status: "In Stock"
    },
    { 
      id: 6, 
      partNumber: "SEA-034", 
      name: "Seat Assembly", 
      category: "Interior",
      stock: 0, 
      minRequired: 2, 
      maxStock: 5,
      unitCost: 8750,
      location: "E1-05",
      supplier: "CabinComfort",
      lastOrdered: "2024-01-25",
      status: "Out of Stock"
    },
  ])

  const getStatusBadge = (status) => {
    switch(status) {
      case 'In Stock': return <Badge variant="success">In Stock</Badge>
      case 'Low Stock': return <Badge variant="warning">Low Stock</Badge>
      case 'Critical': return <Badge variant="danger">Critical</Badge>
      case 'Out of Stock': return <Badge variant="danger">Out of Stock</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const columns = [
    {
      header: 'Part Number',
      accessor: 'partNumber',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.partNumber}</div>
          <div className="text-xs text-gray-400">{row.name}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Stock Level',
      accessor: 'stock',
      cell: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.stock}</span>
            <span className="text-xs text-gray-400">/ {row.maxStock}</span>
          </div>
          <div className="w-24 h-2 bg-slate-700 rounded-full mt-1">
            <div 
              className={`h-full rounded-full ${
                row.stock === 0 ? 'bg-red-500' :
                row.stock <= row.minRequired ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${(row.stock / row.maxStock) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Location',
      accessor: 'location',
    },
    {
      header: 'Unit Cost',
      accessor: 'unitCost',
      cell: (row) => `$${row.unitCost.toLocaleString()}`,
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
    },
  ]

  const handleRowClick = (item) => {
    navigate(`/inventory/${item.id}`)
  }

  const actions = (row) => (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          toast.success(`Order placed for ${row.partNumber}`)
        }}
      >
        Order
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          toast.info(`Viewing details for ${row.partNumber}`)
        }}
      >
        Details
      </Button>
    </>
  )

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item => 
    item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Summary statistics
  const totalParts = inventory.length
  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * item.unitCost), 0)
  const lowStock = inventory.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length
  const outOfStock = inventory.filter(item => item.status === 'Out of Stock').length

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <Button
            variant="primary"
            icon={Plus}
          >
            Add Part
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Total Parts</p>
            <p className="text-2xl font-bold text-white">{totalParts}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Inventory Value</p>
            <p className="text-2xl font-bold text-green-400">${totalValue.toLocaleString()}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Low Stock Items</p>
            <p className="text-2xl font-bold text-yellow-400">{lowStock}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-400">{outOfStock}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-yellow-500" size={20} />
          <p className="text-yellow-500">
            {lowStock} item{lowStock > 1 ? 's are' : ' is'} low on stock. Please reorder soon.
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <DataTable
        title="Parts Inventory"
        data={filteredInventory}
        columns={columns}
        searchable={false}
        sortable={true}
        pagination={true}
        pageSize={10}
        onRowClick={handleRowClick}
        actions={actions}
        emptyMessage="No parts found"
        storageKey="inventory_columns"
        defaultVisibleColumns={['partNumber', 'category', 'stock', 'status', 'location', 'supplier']}
      />
    </div>
  )
}

export default Inventory
