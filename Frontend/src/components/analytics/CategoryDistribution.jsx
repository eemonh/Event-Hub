import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie } from "recharts"
import { useCategoryBreakdown } from "../../hooks/queries/useAnalytics"
import { SkeletonBlock } from "../ui/Skeletons"

const STATUS_COLORS = {
  published: "#6200ea",
  draft: "#f59e0b",
  cancelled: "#ef4444",
}

const CATEGORY_COLORS = [
  "#6200ea", "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#ec4899", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316",
  "#6366f1", "#14b8a6",
]

function CategoryTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{payload[0].value} event{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  )
}

function StatusTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{data.name}</p>
      <p className="text-sm font-bold text-gray-900">{data.value} event{data.value !== 1 ? "s" : ""}</p>
    </div>
  )
}

export default function CategoryDistribution() {
  const { data, isLoading } = useCategoryBreakdown()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <SkeletonBlock className="h-5 w-48 mb-2" />
          <SkeletonBlock className="h-4 w-64 mb-6" />
          <SkeletonBlock className="h-[250px] w-full rounded-xl" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <SkeletonBlock className="h-5 w-48 mb-2" />
          <SkeletonBlock className="h-4 w-64 mb-6" />
          <SkeletonBlock className="h-[250px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const statusData = (data?.byStatus || []).map((s) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count,
    color: STATUS_COLORS[s._id] || "#9CA3AF",
  }))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Events by Category</h2>
        <p className="text-sm text-gray-500 mb-6">Distribution across categories</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data?.byCategory || []} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={{ stroke: "#f0f0f0" }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="_id"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip content={<CategoryTooltip />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
              {(data?.byCategory || []).map((entry, idx) => (
                <Cell key={entry._id} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Events by Status</h2>
        <p className="text-sm text-gray-500 mb-6">Published, draft & cancelled</p>
        <div className="flex items-center justify-center h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3 ml-2">
            {statusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-600 font-medium">{entry.name}</span>
                <span className="text-xs text-gray-900 font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
