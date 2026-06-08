import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, Search } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useEvents, useMyEvents, useSavedEvents } from "../hooks/queries/useEvents"
import { useRegisterForEvent, useBookmarkEvent, useRemoveBookmark } from "../hooks/mutations/useEventMutations"
import EventCard from "../components/events/EventCard"
import { EventGridSkeleton } from "../components/ui/Skeletons"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { ChevronDown } from "lucide-react"

const CATEGORIES = ["All", "Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"]

export default function EventsPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("date_desc")
  const [dateFilter, setDateFilter] = useState("upcoming")
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching } = useEvents({ category, search, sort, dateFilter, page, limit: 6 })
  const { data: myEventsData } = useMyEvents()
  const { data: savedData } = useSavedEvents()

  const registerMutation = useRegisterForEvent()
  const bookmarkMutation = useBookmarkEvent()
  const removeBookmarkMutation = useRemoveBookmark()

  const events = data?.events || []
  const totalPages = data?.pages || 1

  const registeredIds = new Set((myEventsData?.events || []).map((e) => e._id || e.id))
  const savedIds = new Set((savedData?.events || []).map((e) => e._id || e.id))

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const handleRegister = async (eventId: string, e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation()
    if (!token) return
    registerMutation.mutate(eventId)
  }

  const handleBookmark = async (eventId: string, e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation()
    if (!token) return
    if (savedIds.has(eventId)) {
      removeBookmarkMutation.mutate(eventId)
    } else {
      bookmarkMutation.mutate(eventId)
    }
  }

  const isOwner = (event: { organizer?: string | { _id?: string } }) => {
    const organizerObj = typeof event.organizer === "object" ? event.organizer : null
    const ownerId = organizerObj?._id ?? event.organizer
    return ownerId?.toString() === user?.id
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <EventGridSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Explore Events</h1>
          <p className="text-base text-slate-500">Discover the best events happening around you.</p>
        </div>

        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:flex-row">
          <form onSubmit={handleSearch} className="flex flex-grow items-center rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary">
            <Search className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400" />
            <Input
              name="search"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              fullWidth={false}
              inputClassName="border-0 bg-transparent shadow-none focus:ring-0"
              className="border-0 bg-transparent shadow-none focus-within:ring-0"
            />
          </form>

          <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <div className="relative w-full sm:w-auto">
              <select
                value={category || "All"}
                onChange={(e) => { setCategory(e.target.value === "All" ? "" : e.target.value); setPage(1) }}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary sm:w-44"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.filter(c => c !== "All").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1) }}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary sm:w-40"
              >
                <option value="date_asc">Date (Earliest)</option>
                <option value="date_desc">Date (Latest)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={dateFilter || "all"}
                onChange={(e) => { setDateFilter(e.target.value === "all" ? "" : e.target.value); setPage(1) }}
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary sm:w-36"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
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
            <Button variant="tertiary" onClick={() => setPage((p) => p + 1)} loading={isFetching}>Load More Events</Button>
          </div>
        )}
      </div>
    </div>
  )
}
