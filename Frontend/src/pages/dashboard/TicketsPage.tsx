import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Ticket, XCircle, X } from "lucide-react"
import Button from "../../components/ui/Button"
import toast from "react-hot-toast"
import QRCode from "qrcode"
import { useAuth } from "../../context/AuthContext"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useMyEvents } from "../../hooks/queries/useEvents"
import { useCancelRegistration } from "../../hooks/mutations/useEventMutations"
import { EventGridSkeleton, SkeletonBlock } from "../../components/ui/Skeletons"

export default function TicketsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data, isLoading } = useMyEvents()
  const cancelMutation = useCancelRegistration()
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const [selectedQr, setSelectedQr] = useState<string | null>(null)
  const [selectedQrEvent, setSelectedQrEvent] = useState<{ name?: string; title?: string } | null>(null)

  const events = useMemo(() => data?.events || [], [data])

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Tickets"])
    setAction(null)
  }, [setBreadcrumbs, setAction])

  useEffect(() => {
    if (!events || events.length === 0) return
    events.forEach((event) => {
      const eventId = event._id || event.id || ""
      if (eventId && !qrCodes[eventId]) {
        const data = JSON.stringify({ eventId, userId: user?.id, eventName: event.name, date: event.startDate })
        QRCode.toDataURL(data, { width: 200, margin: 1, color: { dark: "#4f46e5" } })
          .then((url) => setQrCodes((prev) => ({ ...prev, [eventId]: url })))
          .catch(() => {})
      }
    })
  }, [events, qrCodes, user?.id])

  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= now)
  const pastEvents = events.filter((e) => new Date(e.startDate) < now)
  const displayedEvents = showUpcoming ? upcomingEvents : pastEvents

  const handleCancel = (eventId: string) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return
    cancelMutation.mutate(eventId, {
      onSuccess: () => toast.success("Registration cancelled"),
      onError: (err) => toast.error(err.message),
    })
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
        <EventGridSkeleton compact showFilters={false} />
      </main>
    )
  }

  return (
     <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
        <p className="text-gray-500">View and manage your event tickets.</p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setShowUpcoming(true)}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${showUpcoming ? "bg-violet-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setShowUpcoming(false)}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${!showUpcoming ? "bg-violet-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Past ({pastEvents.length})
        </button>
      </div>

      {displayedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Ticket size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No {showUpcoming ? "upcoming" : "past"} tickets</p>
          <p className="text-sm text-slate-400">{showUpcoming ? "Register for events to see your tickets here." : "Past tickets will appear here."}</p>
          {showUpcoming && <Button onClick={() => navigate("/dashboard/events")}>Browse Events</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedEvents.map((event) => {
            const eventId = event._id || event.id || ""
            const startDate = new Date(event.startDate)
            const isPast = startDate < now
            return (
              <div key={eventId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative h-40 w-full flex items-center justify-center overflow-hidden bg-gray-200"
                  style={{ backgroundImage: `url(${event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 bg-white/90 p-1.5 rounded-xl">
                    {qrCodes[eventId] ? (
                      <img src={qrCodes[eventId]} alt="QR Code"
                        onClick={() => { setSelectedQr(qrCodes[eventId]); setSelectedQrEvent(event) }}
                        className="h-32 w-32 cursor-pointer object-contain transition hover:scale-105" />
                    ) : (
                      <SkeletonBlock className="h-32 w-32 rounded-xl bg-white/70" />
                    )}
                  </div>
                  <span className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-violet-700 shadow-sm">{event.category}</span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{event.title || event.name}</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><Calendar size={14} />{startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
                    <div className="flex items-center gap-2"><Clock size={14} />{event.startTime || "All day"}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} />{event.venue || event.location}</div>
                  </div>
                  {!isPast && (
                    <Button variant="outline-destructive" onClick={() => handleCancel(eventId)} fullWidth icon={XCircle}>Cancel Registration</Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => { setSelectedQr(null); setSelectedQrEvent(null) }}>
          <div className="relative max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => { setSelectedQr(null); setSelectedQrEvent(null) }} icon={X} className="absolute right-4 top-4" />
            <img src={selectedQr} alt="Event QR Code" className="h-64 w-64 object-contain" />
            {selectedQrEvent && (
              <p className="mt-4 text-center text-sm sm:text-lg md:text-xl font-semibold text-gray-700">{selectedQrEvent.title || selectedQrEvent.name}</p>
            )}
            <p className="text-center text-xs text-gray-500 mt-1">Show this QR at the event entrance</p>
          </div>
        </div>
      )}
    </main>
  )
}
