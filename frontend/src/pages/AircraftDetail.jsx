import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDefects } from "../contexts/DefectsContext.jsx"
import { Button, Badge, Card, Modal, useToast, Input, Select } from "../components/ui"
import { ArrowLeft, Plus } from 'lucide-react'

function AircraftDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { defects, addDefect } = useDefects()
  const toast = useToast()
  
  const [showModal, setShowModal] = useState(false)
  const [newDefect, setNewDefect] = useState({
    description: "",
    severity: "Low",
    status: "Open",
  })

  const aircraftDefects = defects.filter((d) => d.aircraftId === parseInt(id))

  const healthScore = aircraftDefects.some(
    (d) => d.severity === "High" && d.status === "Open"
  )
    ? "Critical"
    : aircraftDefects.length > 0
    ? "Under Review"
    : "Good"

  const handleAddDefect = () => {
    if (!newDefect.description.trim()) {
      toast.error('Please enter a defect description')
      return
    }
    addDefect({ aircraftId: parseInt(id), ...newDefect })
    setNewDefect({ description: "", severity: "Low", status: "Open" })
    setShowModal(false)
    toast.success('Defect added successfully')
  }

  const severityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ]

  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
  ]

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
        <h1 className="text-3xl font-bold">Aircraft {id} Details</h1>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          icon={Plus}
        >
          Add Defect
        </Button>
      </div>

      {/* Health Status Card */}
      <Card className="mb-8">
        <Card.Body>
          <p className="text-gray-400 mb-2">Health Status</p>
          <Badge.Status status={healthScore} />
        </Card.Body>
      </Card>

      {/* Defects Table */}
      <h2 className="text-2xl font-bold mb-4">Defect Log</h2>
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th className="p-4">Description</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {aircraftDefects.map((defect) => (
              <tr key={defect.id} className="border-t border-slate-800">
                <td className="p-4">{defect.description}</td>
                <td className="p-4">
                  <Badge.Status status={defect.severity} />
                </td>
                <td className="p-4">
                  <Badge.Status status={defect.status} />
                </td>
              </tr>
            ))}
            {aircraftDefects.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-gray-400 text-center">
                  No defects logged for this aircraft.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Add Defect Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Defect"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddDefect}>
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

          <Select
            label="Severity"
            options={severityOptions}
            value={newDefect.severity}
            onChange={(e) =>
              setNewDefect({ ...newDefect, severity: e.target.value })
            }
          />

          <Select
            label="Status"
            options={statusOptions}
            value={newDefect.status}
            onChange={(e) =>
              setNewDefect({ ...newDefect, status: e.target.value })
            }
          />
        </div>
      </Modal>
    </div>
  )
}

export default AircraftDetail
