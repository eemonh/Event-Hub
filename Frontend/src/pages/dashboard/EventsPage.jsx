import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, MapPin, User, Search, Loader2, Bookmark, Ticket } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useEvents, useMyEvents, useSavedEvents } from "../../hooks/queries/useEvents"
import { useRegisterForEvent, useBookmarkEvent, useRemoveBookmark } from "../../hooks/mutations/useEventMutations"
import EventCard from "../../components/events/EventCard"

const CATEGORIES = ["All", "Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"]

export default function DashboardEvents() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useEvents({ category, search, page, limit: 6 })
  const { data: myEventsData } = useMyEvents()
  const { data: savedData } = useSavedEvents()

  const registerMutation = useRegisterForEvent()
  const bookmarkMutation = useBookmarkEvent()
  const removeBookmarkMutation = useRemoveBookmark()

  const events = data?.events || []
  const totalPages = data?.pages || 1

  const registeredIds = new Set((myEventsData?.events || []).map((e) => e._id || e.id))
  const savedIds = new Set((savedData?.events || []).map((e) => e._id || e.id))

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events"])
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") })
  }, [setBreadcrumbs, setAction, navigate])

  const handleRegister = (eventId, e) => {
    e.stopPropagation()
    if (!token) return
    registerMutation.mutate(eventId)
  }

  const handleBookmark = (eventId, e) => {
    e.stopPropagation()
    if (!token) return
    if (savedIds.has(eventId)) {
      removeBookmarkMutation.mutate(eventId)
    } else {
      bookmarkMutation.mutate(eventId)
    }
  }

  const isOwner = (event) => {
    const ownerId = event.organizer?._id ?? event.organizer
    return ownerId?.toString() === user?.id
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Events</h1>
        <p className="text-gray-500">Discover events and manage your registrations.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search events..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <select
          value={category || "All"}
          onChange={(e) => { setCategory(e.target.value === "All" ? "" : e.target.value); setPage(1) }}
          className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 sm:w-48"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.filter(c => c !== "All").map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
          <CalendarDays size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No events found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const eventId = event._id || event.id
            return (
              <EventCard
                key={eventId}
                event={event}
                mode="explore"
                isRegistered={registeredIds.has(eventId)}
                isSaved={savedIds.has(eventId)}
                isOwner={isOwner(event)}
                onRegister={handleRegister}
                onBookmark={handleBookmark}
                onClick={() => navigate("/events/" + eventId)}
              />
            )
          })}
        </div>
      )}

      {totalPages > 1 && page < totalPages && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-700 bg-transparent px-8 py-3 font-bold text-violet-700 transition-colors hover:bg-violet-50"
          >
            Load More Events
          </button>
        </div>
      )}
    </main>
  )
}
