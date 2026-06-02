import { useState } from "react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts"
import type { TooltipProps } from "recharts"
import { useUserGrowth } from "../../hooks/queries/useAnalytics"
import { SkeletonBlock } from "../ui/Skeletons"

const ranges = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
]

function CustomTooltip({ active = false, payload = [], label = "" }: Partial<TooltipProps<number, string>>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{payload[0].value} new user{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  )
}

export default function UserGrowthChart() {
  const [range, setRange] = useState(30)
  const { data, isLoading } = useUserGrowth(range)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">User Growth</h2>
          <p className="text-sm text-gray-500 mt-0.5">New users over time</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                range === r.value
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonBlock className="h-[250px] w-full rounded-xl" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data?.data || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6200ea" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6200ea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#f0f0f0" }}
              tickFormatter={(val) => {
                const d = new Date(val)
                return `${d.getMonth() + 1}/${d.getDate()}`
              }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6200ea"
              strokeWidth={2.5}
              fill="url(#userGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#6200ea", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
