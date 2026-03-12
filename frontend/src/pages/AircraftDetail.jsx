import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button, Badge, Card, Modal, useToast, Input, Select, LoadingSpinner } from "../components/ui"
import { ExportDefectsButton } from "../components/ui/ExportButton"
import { PrintDefectReport } from "../components/ui/PrintButton"
import { EmailDefectReport } from "../components/ui/EmailScheduleButton"
import { ArrowLeft, Plus, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import aircraftService from "../services/aircraft.service"
import defectService from "../services/defect.service"

function AircraftDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [loading, setLoading] = useState(true)
  const [aircraft, setAircraft] = useState(null)
  const [defects, setDefects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newDefect, setNewDefect] = useState({
    description: "",
    severity: "Low",
    status: "Open",
    category: "Other",
    ataChapter: "00"
  })

  // Fetch aircraft and defects on load
  useEffect(() => {
    fetchAircraftData()
  }, [id])

  const fetchAircraftData = async () => {
    try {
      setLoading(true)
      
      // Fetch aircraft details
      const aircraftResponse = await aircraftService.getAircraftById(id)
      if (aircraftResponse.success) {
        setAircraft(aircraftResponse.data)
      }
      
      // Fetch defects for this aircraft
      const defectsResponse = await defectService.getDefectsByAircraft(id)
      if (defectsResponse.success) {
        setDefects(defectsResponse.data)
      }
      
    } catch (error) {
      console.error('Failed to fetch aircraft data:', error)
      toast.error('Failed to load aircraft details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDefect = async () => {
    if (!newDefect.description.trim()) {
      toast.error('Please enter a defect description')
      return
    }

    setSubmitting(true)
    
    try {
      const response = await defectService.createDefect({
        ...newDefect,
        aircraft: id,
        aircraftRegistration: aircraft?.registration
      })
      
      if (response.success) {
        // Refresh defects list
        const defectsResponse = await defectService.getDefectsByAircraft(id)
        if (defectsResponse.success) {
          setDefects(defectsResponse.data)
        }
        
        setNewDefect({
          description: "",
          severity: "Low",
          status: "Open",
          category: "Other",
          ataChapter: "00"
        })
        setShowModal(false)
        toast.success('Defect added successfully')
      }
    } catch (error) {
      console.error('Failed to add defect:', error)
      toast.error(error.message || 'Failed to add defect')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (defectId, newStatus) => {
    try {
      const response = await defectService.updateDefect(defectId, { status: newStatus })
      
      if (response.success) {
        // Refresh defects
        const defectsResponse = await defectService.getDefectsByAircraft(id)
        if (defectsResponse.success) {
          setDefects(defectsResponse.data)
        }
        toast.success(`Defect status updated to ${newStatus}`)
      }
    } catch (error) {
      console.error('Failed to update defect:', error)
      toast.error('Failed to update defect status')
    }
  }

  const severityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" }
  ]

  const categoryOptions = [
    { value: "Mechanical", label: "Mechanical" },
    { value: "Electrical", label: "Electrical" },
    { value: "Hydraulic", label: "Hydraulic" },
    { value: "Avionics", label: "Avionics" },
    { value: "Structural", label: "Structural" },
    { value: "Other", label: "Other" }
  ]

  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Closed", label: "Closed" },
    { value: "Deferred", label: "Deferred" }
  ]

  // Calculate health score based on open defects
  const getHealthScore = () => {
    const openDefects = defects.filter(d => d.status === 'Open' || d.status === 'In Progress')
    const highSeverity = openDefects.filter(d => d.severity === 'High' || d.severity === 'Critical')
    
    if (highSeverity.length > 0) return 'Critical'
    if (openDefects.length > 2) return 'Warning'
    if (openDefects.length > 0) return 'Under Review'
    return 'Good'
  }

  const healthScore = getHealthScore()

  if (loading) {
    return (
      <div className="p-6 text-white bg-slate-800 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!aircraft) {
    return (
      <div className="p-6 text-white bg-slate-800 min-h-screen">
        <Button
          variant="ghost"
          onClick={() => navigate("/fleet")}
          icon={ArrowLeft}
          className="mb-6"
        >
          Back to Fleet
        </Button>
        <Card>
          <Card.Body className="text-center py-12">
            <XCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aircraft Not Found</h2>
            <p className="text-gray-400 mb-6">The aircraft you're looking for doesn't exist.</p>
            <Button variant="primary" onClick={() => navigate("/fleet")}>
              Return to Fleet
            </Button>
          </Card.Body>
        </Card>
      </div>
    )
  }

  const openDefects = defects.filter(d => d.status !== 'Closed').length
  const highSeverityDefects = defects.filter(d => (d.severity === 'High' || d.severity === 'Critical') && d.status !== 'Closed').length

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/fleet")}
        icon={ArrowLeft}
        className="mb-6"
      >
        Back to Fleet
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{aircraft.registration}</h1>
          <p className="text-gray-400">{aircraft.type} • {aircraft.manufacturer} {aircraft.model}</p>
        </div>
        <div className="flex gap-3">
          <EmailDefectReport 
            data={defects}
            recipients={['thabang@axulo.aero']}
          />
          <PrintDefectReport 
            data={defects}
            aircraft={aircraft.registration}
            variant="button"
            size="md"
          />
          <ExportDefectsButton 
            data={defects} 
            variant="button" 
            format="csv"
            size="md"
            filename={`${aircraft.registration}_defects`}
          />
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            Add Defect
          </Button>
        </div>
      </div>

      {/* Aircraft Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Status</p>
            <Badge.Status status={aircraft.status} />
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Flight Hours</p>
            <p className="text-2xl font-bold">{aircraft.hours?.toLocaleString() || '0'}</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Cycles</p>
            <p className="text-2xl font-bold">{aircraft.cycles?.toLocaleString() || '0'}</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Last Maintenance</p>
            <p className="text-2xl font-bold">
              {aircraft.lastMaintenance ? new Date(aircraft.lastMaintenance).toLocaleDateString() : 'N/A'}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Health Status</p>
            <Badge.Status status={healthScore} />
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Open Defects</p>
            <p className="text-2xl font-bold text-yellow-400">{openDefects}</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">High Severity</p>
            <p className="text-2xl font-bold text-red-400">{highSeverityDefects}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Defects Table */}
      <h2 className="text-2xl font-bold mb-4">Defect Log</h2>
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Reported</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {defects.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No defects logged for this aircraft.
                </td>
              </tr>
            ) : (
              defects.map((defect) => (
                <tr key={defect._id} className="border-t border-slate-800 hover:bg-slate-800">
                  <td className="p-4">{defect.description}</td>
                  <td className="p-4">{defect.category || 'Other'}</td>
                  <td className="p-4">
                    <Badge.Status status={defect.severity} />
                  </td>
                  <td className="p-4">
                    <select
                      value={defect.status}
                      onChange={(e) => handleUpdateStatus(defect._id, e.target.value)}
                      className="bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    {defect.reportedDate ? new Date(defect.reportedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.info(`Viewing details for defect`)
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Add Defect Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Defect"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddDefect}
              isLoading={submitting}
            >
              Add Defect
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Description"
            placeholder="Enter defect description"
            value={newDefect.description}
            onChange={(e) =>
              setNewDefect({ ...newDefect, description: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Severity"
              options={severityOptions}
              value={newDefect.severity}
              onChange={(e) =>
                setNewDefect({ ...newDefect, severity: e.target.value })
              }
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={newDefect.category}
              onChange={(e) =>
                setNewDefect({ ...newDefect, category: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              value={newDefect.status}
              onChange={(e) =>
                setNewDefect({ ...newDefect, status: e.target.value })
              }
            />

            <Input
              label="ATA Chapter"
              placeholder="e.g., 32-10"
              value={newDefect.ataChapter}
              onChange={(e) =>
                setNewDefect({ ...newDefect, ataChapter: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AircraftDetail
