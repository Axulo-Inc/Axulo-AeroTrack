import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DataTable, 
  Badge, 
  Button, 
  Card, 
  useToast,
  Modal,
  Input,
  Select,
  LoadingSpinner
} from "../components/ui"
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  DollarSign,
  Box,
  AlertCircle
} from 'lucide-react'
import inventoryService from "../services/inventory.service"

function Inventory() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    lowStock: 0,
    critical: 0,
    outOfStock: 0,
    byCategory: [],
    byStatus: []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [stockOperation, setStockOperation] = useState({
    quantity: 0,
    operation: 'add'
  })
  const [newItem, setNewItem] = useState({
    partNumber: '',
    name: '',
    description: '',
    category: 'Other',
    manufacturer: '',
    supplier: '',
    unitCost: '',
    stock: 0,
    minRequired: 1,
    maxStock: 10,
    location: '',
    compatibleAircraft: []
  })

  // Fetch data on load
  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      
      // Fetch all inventory items
      const inventoryResponse = await inventoryService.getAllInventory({ limit: 100 })
      if (inventoryResponse.success) {
        setInventory(inventoryResponse.data)
      }
      
      // Fetch inventory stats
      const statsResponse = await inventoryService.getInventoryStats()
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
      
    } catch (error) {
      console.error('Failed to fetch inventory data:', error)
      toast.error('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = async () => {
    if (!newItem.partNumber || !newItem.name || !newItem.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    
    try {
      const response = await inventoryService.createInventory({
        ...newItem,
        unitCost: parseFloat(newItem.unitCost) || 0,
        stock: parseInt(newItem.stock) || 0,
        minRequired: parseInt(newItem.minRequired) || 1,
        maxStock: parseInt(newItem.maxStock) || 10
      })
      
      if (response.success) {
        await fetchInventoryData()
        setShowModal(false)
        setNewItem({
          partNumber: '',
          name: '',
          description: '',
          category: 'Other',
          manufacturer: '',
          supplier: '',
          unitCost: '',
          stock: 0,
          minRequired: 1,
          maxStock: 10,
          location: '',
          compatibleAircraft: []
        })
        toast.success('Inventory item created successfully')
      }
    } catch (error) {
      console.error('Failed to create item:', error)
      toast.error(error.message || 'Failed to create inventory item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStock = async () => {
    if (!selectedItem) return
    
    setSubmitting(true)
    
    try {
      const response = await inventoryService.updateStock(
        selectedItem._id,
        parseInt(stockOperation.quantity),
        stockOperation.operation
      )
      
      if (response.success) {
        await fetchInventoryData()
        setShowStockModal(false)
        setSelectedItem(null)
        setStockOperation({ quantity: 0, operation: 'add' })
        toast.success('Stock updated successfully')
      }
    } catch (error) {
      console.error('Failed to update stock:', error)
      toast.error(error.message || 'Failed to update stock')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (item) => {
    if (!confirm(`Are you sure you want to delete ${item.partNumber}?`)) return
    
    try {
      const response = await inventoryService.deleteInventory(item._id)
      
      if (response.success) {
        await fetchInventoryData()
        toast.success('Item deleted successfully')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      toast.error(error.message || 'Failed to delete item')
    }
  }

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
            <span className="text-xs text-gray-400">/ {row.maxStock || 10}</span>
          </div>
          <div className="w-24 h-2 bg-slate-700 rounded-full mt-1">
            <div 
              className={`h-full rounded-full ${
                row.stock === 0 ? 'bg-red-500' :
                row.stock <= (row.minRequired || 1) ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${((row.stock || 0) / (row.maxStock || 10)) * 100}%` }}
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
      cell: (row) => `$${(row.unitCost || 0).toLocaleString()}`,
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedItem(row)
              setStockOperation({ quantity: 0, operation: 'add' })
              setShowStockModal(true)
            }}
            icon={Edit}
          >
            Stock
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteItem(row)
            }}
            icon={Trash2}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const handleRowClick = (item) => {
    navigate(`/inventory/${item._id}`)
  }

  // Filter inventory based on search
  const filteredInventory = inventory.filter(item => 
    item.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categoryOptions = [
    { value: 'Engine', label: 'Engine' },
    { value: 'Hydraulic', label: 'Hydraulic' },
    { value: 'Avionics', label: 'Avionics' },
    { value: 'Landing Gear', label: 'Landing Gear' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Structural', label: 'Structural' },
    { value: 'Interior', label: 'Interior' },
    { value: 'Other', label: 'Other' }
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
            onClick={() => setShowModal(true)}
          >
            Add Part
          </Button>
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={fetchInventoryData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Total Parts</p>
            <p className="text-2xl font-bold text-white">{stats.total || inventory.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Inventory Value</p>
            <p className="text-2xl font-bold text-green-400">
              ${(stats.totalValue || 0).toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.lowStock || 0}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Critical</p>
            <p className="text-2xl font-bold text-red-400">{stats.critical || 0}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-400">{stats.outOfStock || 0}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {(stats.lowStock > 0 || stats.critical > 0) && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-yellow-500" size={20} />
          <p className="text-yellow-500">
            {stats.lowStock + stats.critical} item(s) are low on stock. Please reorder soon.
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
        emptyMessage="No parts found"
        storageKey="inventory_columns"
        defaultVisibleColumns={['partNumber', 'category', 'stock', 'status', 'location', 'supplier']}
      />

      {/* Add Part Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Part"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateItem}
              isLoading={submitting}
            >
              Add Part
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Part Number *"
              value={newItem.partNumber}
              onChange={(e) => setNewItem({ ...newItem, partNumber: e.target.value.toUpperCase() })}
              placeholder="e.g., HYD-001"
            />
            <Input
              label="Part Name *"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="e.g., Hydraulic Pump"
            />
          </div>

          <Input
            label="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Brief description of the part"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category *"
              options={categoryOptions}
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            />
            <Input
              label="Manufacturer"
              value={newItem.manufacturer}
              onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
              placeholder="e.g., Airbus, Boeing"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Supplier"
              value={newItem.supplier}
              onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
              placeholder="e.g., AviaParts"
            />
            <Input
              label="Location"
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              placeholder="e.g., A1-03"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Unit Cost ($)"
              value={newItem.unitCost}
              onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
              placeholder="0.00"
            />
            <Input
              type="number"
              label="Initial Stock"
              value={newItem.stock}
              onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
            <Input
              type="number"
              label="Min Required"
              value={newItem.minRequired}
              onChange={(e) => setNewItem({ ...newItem, minRequired: parseInt(e.target.value) || 1 })}
              placeholder="1"
            />
          </div>
        </div>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false)
          setSelectedItem(null)
        }}
        title={`Update Stock - ${selectedItem?.partNumber}`}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => {
              setShowStockModal(false)
              setSelectedItem(null)
            }}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleUpdateStock}
              isLoading={submitting}
            >
              Update Stock
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Current Stock</p>
            <p className="text-2xl font-bold text-white">{selectedItem?.stock || 0}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Operation"
              value={stockOperation.operation}
              onChange={(e) => setStockOperation({ ...stockOperation, operation: e.target.value })}
              options={[
                { value: 'add', label: 'Add' },
                { value: 'subtract', label: 'Remove' },
                { value: 'set', label: 'Set to' }
              ]}
            />
            <Input
              type="number"
              label="Quantity"
              value={stockOperation.quantity}
              onChange={(e) => setStockOperation({ ...stockOperation, quantity: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          {stockOperation.operation === 'subtract' && (
            <p className="text-sm text-yellow-400">
              ⚠️ This will reduce the stock level. Make sure you have enough inventory.
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Inventory
