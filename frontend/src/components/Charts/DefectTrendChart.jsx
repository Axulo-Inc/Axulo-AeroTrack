import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', mechanical: 12, electrical: 8, hydraulic: 5 },
  { month: 'Feb', mechanical: 15, electrical: 10, hydraulic: 7 },
  { month: 'Mar', mechanical: 11, electrical: 9, hydraulic: 6 },
  { month: 'Apr', mechanical: 8, electrical: 12, hydraulic: 4 },
  { month: 'May', mechanical: 10, electrical: 7, hydraulic: 8 },
];

function DefectTrendChart() {
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md h-80">
      <h3 className="text-lg font-semibold mb-4 text-white">Defect Trends by Category</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          <Line type="monotone" dataKey="mechanical" stroke="#EF4444" strokeWidth={2} />
          <Line type="monotone" dataKey="electrical" stroke="#3B82F6" strokeWidth={2} />
          <Line type="monotone" dataKey="hydraulic" stroke="#10B981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DefectTrendChart;
