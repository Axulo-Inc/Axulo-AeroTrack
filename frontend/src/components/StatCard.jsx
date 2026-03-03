function StatCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md">
      <p className="text-gray-400 mb-2">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default StatCard
