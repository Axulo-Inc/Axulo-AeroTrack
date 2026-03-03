import StatCard from "../components/StatCard"
import DefectTrendChart from "../components/Charts/DefectTrendChart"
import MTBFChart from "../components/Charts/MTBFChart"
import FleetHealthGauge from "../components/Charts/FleetHealthGauge"

function Dashboard() {
  return (
    <div className="bg-slate-800 p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Fleet Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Aircraft" value="24" color="text-white" />
        <StatCard title="Active Defects" value="7" color="text-red-400" />
        <StatCard title="Fleet Uptime" value="96.3%" color="text-green-400" />
        <StatCard title="Inventory Risk" value="3 Parts" color="text-yellow-400" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DefectTrendChart />
        <FleetHealthGauge />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <MTBFChart />
      </div>
    </div>
  )
}

export default Dashboard
