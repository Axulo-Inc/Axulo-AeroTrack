import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { aircraft: 'ZS-ABC', mtbf: 245 },
  { aircraft: 'ZS-DEF', mtbf: 189 },
  { aircraft: 'ZS-GHI', mtbf: 312 },
  { aircraft: 'ZS-JKL', mtbf: 278 },
  { aircraft: 'ZS-MNO', mtbf: 156 },
];

function MTBFChart() {
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md h-80">
      <h3 className="text-lg font-semibold mb-4 text-white">MTBF by Aircraft (hours)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="aircraft" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Bar dataKey="mtbf" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MTBFChart;
