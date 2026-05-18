import { useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bookmark } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useSavedEvents, useMyEvents } from "../../hooks/queries/useEvents"
import { useRemoveBookmark, useRegisterForEvent } from "../../hooks/mutations/useEventMutations"
import EventCard from "../../components/events/EventCard"
import { EventGridSkeleton } from "../../components/ui/Skeletons"

export default function SavedEventsPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data: savedData, isLoading } = useSavedEvents()
  const { data: myEventsData } = useMyEvents()
  const removeBookmarkMutation = useRemoveBookmark()
  const registerMutation = useRegisterForEvent()

  const events = savedData?.events || []
  const registeredIds = useMemo(
    () => new Set((myEventsData?.events || []).map((e) => e._id || e.id)),
    [myEventsData]
  )

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Saved"])
    setAction({ label: "Explore Events", onClick: () => navigate("/events") })
  }, [setBreadcrumbs, setAction, navigate])

  const handleRemove = (eventId) => {
    removeBookmarkMutation.mutate(eventId, {
      onSuccess: () => toast.success("Bookmark removed"),
      onError: (err) => toast.error(err.message),
    })
  }

  const handleRegister = (eventId) => {
    if (!token) return
    registerMutation.mutate(eventId, {
      onSuccess: () => toast.success("Registered successfully!"),
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Events</h1>
        <p className="text-gray-500 text-base">Events you've bookmarked for later.</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Bookmark size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No saved events yet</p>
          <p className="text-sm text-slate-400">Browse events and bookmark them to see them here.</p>
          <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const eventId = event._id || event.id
            const isOwner = (event.organizer?.toString()) === user?.id
            return (
              <EventCard
                key={eventId}
                event={event}
                mode="saved"
                isOwner={isOwner}
                isRegistered={registeredIds.has(eventId)}
                onRemoveBookmark={handleRemove}
                onRegister={handleRegister}
                onClick={() => navigate("/events/" + eventId)}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
