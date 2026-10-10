import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { STATUS_COLORS } from '../utils/constants'
import EmptyState from './EmptyState'

export default function StatusChart({ data }) {
  const visible = data.filter((item) => item.value > 0)

  if (visible.length === 0) {
    return <EmptyState message="No issues to chart yet." />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={visible}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {visible.map((item) => (
            <Cell
              key={item.name}
              fill={STATUS_COLORS[item.name] ?? '#64748b'}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}