import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard.jsx"
import Fleet from "./pages/Fleet.jsx"
import AircraftDetail from "./pages/AircraftDetail.jsx"
import Maintenance from "./pages/Maintenance.jsx"
import Inventory from "./pages/Inventory.jsx"
import Analytics from "./pages/Analytics.jsx"

function App() {
  return (
    <div className="flex bg-slate-800 text-white min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/fleet/:id" element={<AircraftDetail />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
