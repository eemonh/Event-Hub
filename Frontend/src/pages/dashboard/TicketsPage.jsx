import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Ticket, QrCode, XCircle, X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import QRCode from "qrcode"
import { useAuth } from "../../context/AuthContext"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useMyEvents } from "../../hooks/queries/useEvents"
import { useCancelRegistration } from "../../hooks/mutations/useEventMutations"

export default function TicketsPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data, isLoading } = useMyEvents()
  const cancelMutation = useCancelRegistration()
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [qrCodes, setQrCodes] = useState({})
  const [selectedQr, setSelectedQr] = useState(null)
  const [selectedQrEvent, setSelectedQrEvent] = useState(null)

  const events = data?.events || []

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Tickets"])
    setAction(null)
  }, [setBreadcrumbs, setAction])

  useEffect(() => {
    if (!events || events.length === 0) return
    events.forEach((event) => {
      const eventId = event._id || event.id
      if (!qrCodes[eventId]) {
        const data = JSON.stringify({ eventId, userId: user?.id, eventName: event.name, date: event.startDate })
        QRCode.toDataURL(data, { width: 200, margin: 1, color: { dark: "#4F46E5" } })
          .then((url) => setQrCodes((prev) => ({ ...prev, [eventId]: url })))
          .catch(() => {})
      }
    })
  }, [events, qrCodes, user?.id])

  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= now)
  const pastEvents = events.filter((e) => new Date(e.startDate) < now)
  const displayedEvents = showUpcoming ? upcomingEvents : pastEvents

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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
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
          {showUpcoming && <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">Browse Events</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedEvents.map((event) => {
            const eventId = event._id || event.id
            const startDate = new Date(event.startDate)
            const isPast = startDate < now
            return (
              <div key={eventId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative h-40 w-full bg-violet-100 flex items-center justify-center">
                  {qrCodes[eventId] ? (
                    <img src={qrCodes[eventId]} alt="QR Code"
                      onClick={() => { setSelectedQr(qrCodes[eventId]); setSelectedQrEvent(event) }}
                      className="h-32 w-32 cursor-pointer object-contain transition hover:scale-105" />
                  ) : (
                    <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
                  )}
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-violet-700 shadow-sm">{event.category}</span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{event.title || event.name}</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><Calendar size={14} />{startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
                    <div className="flex items-center gap-2"><Clock size={14} />{event.startTime || "All day"}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} />{event.venue || event.location}</div>
                  </div>
                  {!isPast && (
                    <button onClick={() => handleCancel(eventId)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                      <XCircle size={15} /> Cancel Registration
                    </button>
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
          <div className="relative rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setSelectedQr(null); setSelectedQrEvent(null) }}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors">
              <X size={18} />
            </button>
            <img src={selectedQr} alt="Event QR Code" className="h-64 w-64 object-contain" />
            {selectedQrEvent && (
              <p className="mt-4 text-center text-sm font-semibold text-gray-700">{selectedQrEvent.title || selectedQrEvent.name}</p>
            )}
            <p className="text-center text-xs text-gray-500 mt-1">Show this QR at the event entrance</p>
          </div>
        </div>
      )}
    </main>
  )
}
