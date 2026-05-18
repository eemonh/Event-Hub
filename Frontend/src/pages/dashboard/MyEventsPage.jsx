import { useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar } from "lucide-react"
import toast from "react-hot-toast"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useMyEvents } from "../../hooks/queries/useEvents"
import { useCancelRegistration } from "../../hooks/mutations/useEventMutations"
import EventCard from "../../components/events/EventCard"
import { EventGridSkeleton } from "../../components/ui/Skeletons"

export default function MyEventsPage() {
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data, isLoading } = useMyEvents()
  const cancelMutation = useCancelRegistration()

  const events = useMemo(() => data?.events || [], [data])

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "My Events"])
    setAction({ label: "Explore More", onClick: () => navigate("/events") })
  }, [setBreadcrumbs, setAction, navigate])

  const now = useMemo(() => new Date(), [])
  const upcoming = useMemo(() => events.filter((e) => new Date(e.startDate) >= now), [events, now])
  const past = useMemo(() => events.filter((e) => new Date(e.startDate) < now), [events, now])

  const handleCancel = (eventId) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return
    cancelMutation.mutate(eventId, {
      onSuccess: () => toast.success("Registration cancelled"),
      onError: (err) => toast.error(err.message),
    })
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <EventGridSkeleton compact showFilters={false} />
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-gray-500">Manage your registrations and view your tickets.</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Calendar size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No registered events yet</p>
          <p className="text-sm text-slate-400">Browse events and register to see them here.</p>
          <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <EventCard
                    key={event._id || event.id}
                    event={event}
                    mode="my-events"
                    isPast={false}
                    onCancel={handleCancel}
                    onClick={() => navigate("/events/" + (event._id || event.id))}
                  />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((event) => (
                  <EventCard
                    key={event._id || event.id}
                    event={event}
                    mode="my-events"
                    isPast={true}
                    onClick={() => navigate("/events/" + (event._id || event.id))}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
