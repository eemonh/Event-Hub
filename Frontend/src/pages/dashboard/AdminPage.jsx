import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useAllEvents, useAdminStats } from "../../hooks/queries/useEvents"
import {
  Calendar, UserPlus, Banknote, TrendingUp,
  Activity, Palette, Utensils,
  MoreVertical, ArrowRight,
} from "lucide-react"
import StatusBadge from "../../components/ui/StatusBadge"
import { DashboardCardsSkeleton } from "../../components/ui/Skeletons"

const eventIcons = [Activity, Palette, Utensils]
const iconColorClasses = [
  { bg: "bg-purple-100", icon: "text-purple-600" },
  { bg: "bg-blue-100", icon: "text-blue-600" },
  { bg: "bg-amber-100", icon: "text-amber-700" },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data: eventsData, isLoading: eventsLoading } = useAllEvents({ page: 1, limit: 50 })
  const { data: statsData, isLoading: statsLoading } = useAdminStats()
  const [, setRetryCount] = useState(0)

  const events = eventsData?.events || []
  const totalRegistrations = statsData?.totalRegistrations || 0
  const isLoading = eventsLoading || statsLoading

  useEffect(() => {
    setBreadcrumbs(["Dashboard"])
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") })
  }, [setBreadcrumbs, setAction, navigate])

  const error = null

  const recentEvents = [...events]
    .filter((e) => e.status === "published")
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5)

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
        <DashboardCardsSkeleton />
      </main>
    )
  }

  const statsDataArray = [
    {
      title: "TOTAL EVENTS",
      value: String(events.length),
      trend: "+12%",
      icon: Calendar,
      colorClass: "text-purple-600 bg-purple-100",
      gradientClass: "bg-gradient-to-t from-purple-50 to-white",
    },
    {
      title: "TOTAL REGISTRATION",
      value: totalRegistrations.toLocaleString(),
      trend: "+5.4%",
      icon: UserPlus,
      colorClass: "text-blue-600 bg-blue-100",
      gradientClass: "bg-gradient-to-t from-blue-50 to-white",
    },
    {
      title: "MONTHLY REVENUE",
      value: "$12,450",
      trend: "+8.2%",
      icon: Banknote,
      colorClass: "text-emerald-600 bg-emerald-100",
      gradientClass: "bg-gradient-to-t from-emerald-50 to-white",
    },
  ]

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-600 font-medium text-sm">{error}</span>
          </div>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsDataArray.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className={`border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${stat.gradientClass}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">{stat.title}</h3>
                  <div className="text-4xl font-extrabold text-gray-900">{stat.value}</div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center text-sm mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1.5" />
                <span className="text-emerald-600 font-semibold mr-2">{stat.trend}</span>
                <span className="text-gray-400">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
          <button onClick={() => navigate("/dashboard/events")} className="cursor-pointer text-primary hover:text-primary-hover text-sm font-semibold flex items-center transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Venue</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">No published events yet.</td>
                </tr>
              ) : (
                recentEvents.map((event) => {
                  const EventIcon = eventIcons[Math.abs(event.name?.length || 0) % 3]
                  const colors = iconColorClasses[Math.abs(event.name?.length || 0) % 3]
                  const startDate = new Date(event.startDate)
                  return (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center">
                        <div className={`p-2.5 rounded-xl mr-4 ${colors.bg} ${colors.icon}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-0.5">{event.name}</div>
                          <div className="text-xs text-gray-400">ID: {(event._id || "").slice(-6).toUpperCase()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-800 mb-0.5">
                          {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="text-xs text-gray-400">{event.startTime || "All day"}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-600 font-medium">{event.venue}</td>
                        <td className="px-6 py-4 hidden lg:table-cell"><StatusBadge status={event.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
