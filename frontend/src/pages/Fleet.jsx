import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Fleet() {
  const navigate = useNavigate()

  const [fleet] = useState([
    { id: 1, registration: "ZS-ABC", type: "A320", status: "Active", hours: 12450 },
    { id: 2, registration: "ZS-DEF", type: "B737", status: "Maintenance", hours: 15620 },
    { id: 3, registration: "ZS-GHI", type: "A320", status: "Active", hours: 9870 },
    { id: 4, registration: "ZS-JKL", type: "B777", status: "Active", hours: 20340 },
  ])

  return (
    // ✅ Added bg-slate-800 for dark background
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Fleet Overview</h1>
      
      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th className="p-4">Registration</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Flight Hours</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map((aircraft) => (
              <tr
                key={aircraft.id}
                onClick={() => navigate(`/fleet/${aircraft.id}`)}
                className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer transition"
              >
                <td className="p-4 font-semibold">{aircraft.registration}</td>
                <td className="p-4">{aircraft.type}</td>
                <td className={`p-4 ${
                  aircraft.status === "Active" 
                    ? "text-green-400" 
                    : "text-yellow-400"
                }`}>
                  {aircraft.status}
                </td>
                <td className="p-4">{aircraft.hours.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Fleet
