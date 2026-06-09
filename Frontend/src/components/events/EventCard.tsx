import { memo, type MouseEvent } from "react"
import { CalendarDays, MapPin, User, Bookmark, Ticket } from "lucide-react"
import type { Event } from "../../types"
import Button from "../../components/ui/Button"

type CardMode = "explore" | "my-events" | "saved" | string
type EventAction = (eventId: string, event?: MouseEvent<HTMLElement>) => void

interface EventCardProps {
  event: Event
  mode?: CardMode
  isRegistered?: boolean
  isSaved?: boolean
  isOwner?: boolean
  isPast?: boolean
  onRegister?: EventAction
  onBookmark?: EventAction
  onCancel?: EventAction
  onRemoveBookmark?: EventAction
  onClick?: () => void
}

const EventCard = memo(function EventCard({
  event,
  mode = "explore",
  isRegistered = false,
  isSaved = false,
  isOwner = false,
  isPast = false,
  onRegister,
  onBookmark,
  onCancel,
  onRemoveBookmark,
  onClick,
}: EventCardProps) {
  const eventId = (event._id || event.id) ?? ""
  const startDate = new Date(event.startDate)

  const cardContent = (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-slate-200">
        <img
          src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"}
          alt={event.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop" }}
          className="h-full w-full object-cover"
        />
        {event.category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold tracking-wide text-slate-800 shadow-sm backdrop-blur-sm">
            {event.category}
          </span>
        )}
      </div>

      <div className="flex flex-grow flex-col p-6">
        <h3 className="mb-5 line-clamp-2 text-xl font-bold leading-tight text-slate-900">
          {event.name}
        </h3>

        <div className="mb-6 flex-grow space-y-3">
          <div className="flex items-start text-sm text-slate-500">
            <CalendarDays className="mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              {startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              {event.startTime ? ` at ${event.startTime}` : ""}
            </span>
          </div>

          <div className="flex items-start text-sm text-slate-500">
            <MapPin className="mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{event.venue}</span>
          </div>

          <div className="flex items-start text-sm text-slate-500">
            <User className="mr-2.5 mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{typeof event.organizer === "object" ? event.organizer.name : "Unknown"}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-sm font-semibold text-slate-700">
            {event.price === 0 || !event.price ? "Free" : `$${event.price}`}
          </span>
        </div>

        <div className="mt-auto flex gap-3">
          {mode === "explore" && renderExploreActions(eventId, isOwner, isRegistered, isSaved, onRegister, onBookmark)}
          {mode === "my-events" && renderMyEventsActions(eventId, isPast, onCancel)}
          {mode === "saved" && renderSavedActions(eventId, isOwner, isRegistered, isSaved, onRemoveBookmark, onRegister)}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onClick?.() }}>
        {cardContent}
      </div>
    )
  }

  return cardContent
})

function renderExploreActions(
  eventId: string,
  isOwner: boolean,
  isRegistered: boolean,
  isSaved: boolean,
  onRegister?: EventAction,
  onBookmark?: EventAction,
) {
  return (
    <>
      {isOwner ? (
        <span className="flex flex-grow items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-500">
          <User size={14} /> Organizer
        </span>
      ) : isRegistered ? (
        <span className="flex flex-grow items-center justify-center gap-1.5 rounded-xl bg-emerald-100 py-2.5 text-sm font-medium text-emerald-700">
          <Ticket size={14} /> Registered
        </span>
      ) : (
        <Button onClick={(e) => { e.stopPropagation(); onRegister?.(eventId, e) }} size="sm" className="flex-grow">Register</Button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onBookmark?.(eventId, e) }}
        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
          isSaved
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        }`}
      >
        <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
      </button>
    </>
  )
}

function renderMyEventsActions(eventId: string, isPast: boolean, onCancel?: EventAction) {
  if (isPast) {
    return (
      <span className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-400 select-none">Event Ended</span>
    )
  }
  return (
    <div className="flex w-full gap-2">
      <Button className="flex-1 !rounded-xl">View Ticket</Button>
      <button onClick={(e) => { e.stopPropagation(); onCancel?.(eventId, e) }} className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100">Cancel</button>
    </div>
  )
}

function renderSavedActions(
  eventId: string,
  isOwner: boolean,
  isRegistered: boolean,
  _isSaved: boolean,
  onRemoveBookmark?: EventAction,
  onRegister?: EventAction,
) {
  return (
    <>
      {isOwner ? (
        <span className="flex flex-grow items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-500">
          <User size={14} /> Organizer
        </span>
      ) : isRegistered ? (
        <span className="flex flex-grow items-center justify-center gap-2 rounded-xl bg-emerald-100 py-2.5 text-sm font-medium text-emerald-700">
          <Ticket size={14} /> Registered
        </span>
      ) : (
        <Button size="sm" className="flex-grow" onClick={(e) => { e.stopPropagation(); onRegister?.(eventId, e) }}>Register Now</Button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemoveBookmark?.(eventId, e) }}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-violet-700 transition-colors hover:bg-violet-50"
        title="Remove bookmark"
      >
        <Bookmark className="h-5 w-5" fill="currentColor" />
      </button>
    </>
  )
}

export default EventCard
