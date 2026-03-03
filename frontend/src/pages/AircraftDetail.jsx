import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDefects } from "../contexts/DefectsContext.jsx"
import { AiOutlineClose } from "react-icons/ai"

function AircraftDetail() {
  // ✅ Get id FIRST from useParams
  const { id } = useParams()
  const navigate = useNavigate()
  const { defects, addDefect } = useDefects()
  
  const [showModal, setShowModal] = useState(false)
  const [newDefect, setNewDefect] = useState({
    description: "",
    severity: "Low",
    status: "Open",
  })

  // Now we can use id safely
  const aircraftDefects = defects.filter((d) => d.aircraftId === parseInt(id))

  const healthScore = aircraftDefects.some(
    (d) => d.severity === "High" && d.status === "Open"
  )
    ? "Critical"
    : aircraftDefects.length > 0
    ? "Under Review"
    : "Good"

  const handleAddDefect = () => {
    if (!newDefect.description.trim()) return
    addDefect({ aircraftId: parseInt(id), ...newDefect })
    setNewDefect({ description: "", severity: "Low", status: "Open" })
    setShowModal(false)
  }

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      {/* Back button - FIXED to go to /fleet */}
      <button
        onClick={() => navigate("/fleet")}
        className="mb-6 text-blue-400 hover:underline flex items-center gap-1"
      >
        ← Back to Fleet
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aircraft {id} Details</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Defect
        </button>
      </div>

      {/* Health Status Card */}
      <div className="bg-slate-900 p-6 rounded-xl mb-8">
        <p className="text-gray-400 mb-2">Health Status</p>
        <p
          className={`text-2xl font-bold ${
            healthScore === "Good"
              ? "text-green-400"
              : healthScore === "Critical"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {healthScore}
        </p>
      </div>

      {/* Defects Table */}
      <h2 className="text-2xl font-bold mb-4">Defect Log</h2>
      <div className="bg-slate-900 rounded-xl overflow-hidden">
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
                <td
                  className={`p-4 font-semibold ${
                    defect.severity === "High"
                      ? "text-red-400"
                      : defect.severity === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {defect.severity}
                </td>
                <td
                  className={`p-4 ${
                    defect.status === "Open" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {defect.status}
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
      </div>

      {/* Add Defect Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <AiOutlineClose size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6">Add New Defect</h3>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Description"
                value={newDefect.description}
                onChange={(e) =>
                  setNewDefect({ ...newDefect, description: e.target.value })
                }
                className="p-3 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />

              <select
                value={newDefect.severity}
                onChange={(e) =>
                  setNewDefect({ ...newDefect, severity: e.target.value })
                }
                className="p-3 rounded bg-slate-800 text-white border border-slate-700"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select
                value={newDefect.status}
                onChange={(e) =>
                  setNewDefect({ ...newDefect, status: e.target.value })
                }
                className="p-3 rounded bg-slate-800 text-white border border-slate-700"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <button
                onClick={handleAddDefect}
                className="bg-green-600 px-4 py-3 rounded hover:bg-green-700 transition mt-2"
              >
                Add Defect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AircraftDetail
