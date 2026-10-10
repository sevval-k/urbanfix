import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CATEGORY_COLORS } from '../utils/constants'
import EmptyState from './EmptyState'

export default function CategoryChart({ data }) {
  const hasData = data.some((item) => item.value > 0)

  if (!hasData) {
    return <EmptyState message="No issues to chart yet." />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Bar dataKey="value" name="Issues" radius={[0, 4, 4, 0]}>
          {data.map((item) => (
            <Cell
              key={item.name}
              fill={CATEGORY_COLORS[item.name] ?? '#64748b'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}