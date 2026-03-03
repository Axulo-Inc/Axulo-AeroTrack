import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Healthy', value: 18, color: '#10B981' },
  { name: 'Warning', value: 4, color: '#F59E0B' },
  { name: 'Critical', value: 2, color: '#EF4444' },
];

function FleetHealthGauge() {
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md h-80">
      <h3 className="text-lg font-semibold mb-4 text-white">Fleet Health Status</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FleetHealthGauge;
