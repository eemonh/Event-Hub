import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useAnalyticsOverview } from "../../hooks/queries/useAnalytics"
import StatCards from "../../components/analytics/StatCards"
import RegistrationTrends from "../../components/analytics/RegistrationTrends"
import CategoryDistribution from "../../components/analytics/CategoryDistribution"
import TopEventsTable from "../../components/analytics/TopEventsTable"
import UserGrowthChart from "../../components/analytics/UserGrowthChart"

export default function AdminPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data: overviewData, isLoading: overviewLoading } = useAnalyticsOverview()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setBreadcrumbs(["Dashboard"])
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") })
  }, [setBreadcrumbs, setAction, navigate])

  async function handleRefresh() {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ["analytics"] })
    setRefreshing(false)
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <StatCards stats={overviewData?.stats} isLoading={overviewLoading} />

      <RegistrationTrends />

      <CategoryDistribution />

      <TopEventsTable />

      <UserGrowthChart />
    </main>
  )
}
