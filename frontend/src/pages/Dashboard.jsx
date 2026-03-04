import StatCard from "../components/StatCard"
import { Button, useToast } from "../components/ui"
import DefectTrendChart from "../components/Charts/DefectTrendChart"
import MTBFChart from "../components/Charts/MTBFChart"
import FleetHealthGauge from "../components/Charts/FleetHealthGauge"

function Dashboard() {
  const toast = useToast()

  return (
    <div className="bg-slate-800 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Fleet Overview</h1>
        
        {/* Toast Test Buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => toast.success('Operation completed successfully!')}
          >
            Test Success
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => toast.error('Something went wrong!')}
          >
            Test Error
          </Button>
        </div>
      </div>

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
