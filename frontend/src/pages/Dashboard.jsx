import StatCard from "../components/StatCard"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "Mon", uptime: 94 },
  { day: "Tue", uptime: 96 },
  { day: "Wed", uptime: 95 },
  { day: "Thu", uptime: 97 },
  { day: "Fri", uptime: 96.3 },
]

function Dashboard() {
  return (
    <div className="bg-slate-800">
      <h1 className="text-3xl font-bold mb-8">Fleet Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Aircraft" value="24" color="text-white" />
        <StatCard title="Active Defects" value="7" color="text-red-400" />
        <StatCard title="Fleet Uptime" value="96.3%" color="text-green-400" />
        <StatCard title="Inventory Risk" value="3 Parts" color="text-yellow-400" />
      </div>

      {/* Chart */}
      <div className="bg-slate-900 p-6 rounded-xl shadow-md h-80">
        <h2 className="text-lg font-semibold mb-4">Weekly Uptime Trend</h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard
