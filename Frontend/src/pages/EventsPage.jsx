import { useState, useEffect } from "react"
import { CalendarDays, MapPin, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { getEvents } from "../services/events"
import EventDetailModal from "../components/events/EventDetailModal"

const CATEGORIES = ["All", "Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"]

export default function EventsPage() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEventId, setSelectedEventId] = useState(null)

  const fetchEvents = async (page = currentPage) => {
    setLoading(true)
    try {
      const data = await getEvents(token, { category, search, page, limit: 12 })
      setEvents(data.events || [])
      setTotalPages(data.pages || 1)
      setCurrentPage(data.page || 1)
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchEvents(1)
  }, [token, category])

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    fetchEvents(page)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchEvents(1)
  }

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">Events</h1>
        <p className="text-base text-text-muted">Discover and explore upcoming events.</p>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full rounded-lg border border-border-light bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </form>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                (cat === "All" && !category) || category === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-light py-20 text-center">
          <CalendarDays size={48} className="text-text-muted/50" />
          <p className="mt-4 text-lg font-medium text-text-muted">No events found</p>
          <p className="text-sm text-text-muted/70">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const startDate = new Date(event.startDate)
            return (
              <div
                key={event._id || event.id}
                onClick={() => setSelectedEventId(event._id || event.id)}
                className="cursor-pointer overflow-hidden rounded-xl border border-border-light bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"}
                    alt={event.name}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-primary shadow">
                    {event.category}
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="text-xl font-semibold leading-snug text-text-primary">
                    {event.name}
                  </h3>
                  <div className="space-y-1.5 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {startDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {event.startTime && ` at ${event.startTime}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {event.venue}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {event.price === 0 ? "Free" : `$${event.price}`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-text-muted transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-text-muted transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      <EventDetailModal
        eventId={selectedEventId}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </main>
  )
}
