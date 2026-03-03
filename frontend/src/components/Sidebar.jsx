import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-10 text-white">
        Axulo AeroTrack
      </h2>

      <nav className="space-y-4 text-gray-300">
        <Link to="/" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/fleet" className="block hover:text-blue-400">Fleet</Link>
        <Link to="/maintenance" className="block hover:text-blue-400">Maintenance</Link>
        <Link to="/inventory" className="block hover:text-blue-400">Inventory</Link>
        <Link to="/analytics" className="block hover:text-blue-400">Analytics</Link>
      </nav>
    </div>
  )
}

export default Sidebar
