import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useAnalyticsOverview } from "../../hooks/queries/useAnalytics"
import StatCards from "../../components/analytics/StatCards"
import RegistrationTrends from "../../components/analytics/RegistrationTrends"
import CategoryDistribution from "../../components/analytics/CategoryDistribution"
import TopEventsTable from "../../components/analytics/TopEventsTable"
import UserGrowthChart from "../../components/analytics/UserGrowthChart"

export default function AdminPage() {
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data: overviewData, isLoading: overviewLoading } = useAnalyticsOverview()

  useEffect(() => {
    setBreadcrumbs(["Dashboard"])
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") })
  }, [setBreadcrumbs, setAction, navigate])

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your events today.</p>
      </div>

      <StatCards stats={overviewData?.stats} isLoading={overviewLoading} />

      <RegistrationTrends />

      <CategoryDistribution />

      <TopEventsTable />

      <UserGrowthChart />
    </main>
  )
}
