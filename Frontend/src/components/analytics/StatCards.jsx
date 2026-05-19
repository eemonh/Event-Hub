import { Calendar, UserPlus, Banknote, Users, Percent, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { SkeletonBlock } from "../ui/Skeletons"

const cards = [
  { key: "totalEvents", title: "TOTAL EVENTS", icon: Calendar, colorClass: "text-purple-600 bg-purple-100", gradientClass: "bg-gradient-to-t from-purple-50 to-white" },
  { key: "totalRegistrations", title: "TOTAL REGISTRATION", icon: UserPlus, colorClass: "text-blue-600 bg-blue-100", gradientClass: "bg-gradient-to-t from-blue-50 to-white" },
  { key: "estimatedRevenue", title: "ESTIMATED REVENUE", icon: Banknote, colorClass: "text-emerald-600 bg-emerald-100", gradientClass: "bg-gradient-to-t from-emerald-50 to-white", format: "currency" },
  { key: "totalUsers", title: "ACTIVE USERS", icon: Users, colorClass: "text-amber-600 bg-amber-100", gradientClass: "bg-gradient-to-t from-amber-50 to-white" },
  { key: "capacityFillRate", title: "CAPACITY FILL RATE", icon: Percent, colorClass: "text-rose-600 bg-rose-100", gradientClass: "bg-gradient-to-t from-rose-50 to-white" },
  { key: "upcomingEvents", title: "UPCOMING EVENTS", icon: Clock, colorClass: "text-cyan-600 bg-cyan-100", gradientClass: "bg-gradient-to-t from-cyan-50 to-white" },
]

function formatValue(value, format) {
  if (format === "currency") {
    return `$${Number(value).toLocaleString()}`
  }
  return String(value ?? 0)
}

export default function StatCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between">
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-28" />
                <SkeletonBlock className="h-10 w-20" />
              </div>
              <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />
            </div>
            <SkeletonBlock className="h-4 w-40" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const stat = stats?.[card.key]
        const value = stat?.value ?? 0
        const trend = stat?.trend ?? 0
        const Icon = card.icon
        const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown
        const trendColor = trend >= 0 ? "text-emerald-600" : "text-red-600"

        return (
          <div
            key={card.key}
            className={`border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${card.gradientClass}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">{card.title}</h3>
                <div className="text-4xl font-extrabold text-gray-900">
                  {formatValue(value, card.format)}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${card.colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center text-sm mt-2">
              <TrendIcon className={`w-4 h-4 ${trendColor} mr-1.5`} />
              <span className={`font-semibold mr-2 ${trendColor}`}>
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
              <span className="text-gray-400">from last month</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
