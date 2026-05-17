import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  Users,
  User,
  Tag,
  Bookmark,
  Ticket,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { useAuth } from "../../context/AuthContext";
import {
  getEvent,
  registerForEvent,
  bookmarkEvent,
  removeBookmark,
  getMyEvents,
} from "../../services/events";

export default function EventDetailModal({ eventId, isOpen, onClose }) {
  const { user, token } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setEvent(null);
    try {
      const data = await getEvent(eventId);
      setEvent(data.event);
    } catch (err) {
      toast.error(err.message);
      onClose();
    } finally {
      setLoading(false);
    }
  }, [eventId, onClose]);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchEvent();
      checkRegistration();
    }
  }, [isOpen, eventId, fetchEvent]);

  const checkRegistration = async () => {
    if (!token || !eventId) return;
    try {
      const data = await getMyEvents(token);
      const ids = new Set((data.events || []).map((e) => e._id || e.id));
      setIsRegistered(ids.has(eventId));
    } catch {}
  };

  const handleRegister = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("Please log in to register");
    setActionLoading("register");
    try {
      await registerForEvent(token, eventId);
      toast.success("Registered successfully!");
      setIsRegistered(true);
      fetchEvent();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("Please log in to bookmark");
    setActionLoading("bookmark");
    try {
      if (isSaved) {
        await removeBookmark(token, eventId);
        setIsSaved(false);
        toast.success("Bookmark removed");
      } else {
        await bookmarkEvent(token, eventId);
        setIsSaved(true);
        toast.success("Event saved!");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : event ? (
        <div>
          <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
            <img
              src={
                event.coverImage ||
                "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"
              }
              alt={event.name}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop";
              }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-6 right-20">
              <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow backdrop-blur-sm">
                {event.category}
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {event.name}
              </h2>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <CalendarDays size={18} className="shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Date</p>
                  <p className="text-slate-500">
                    {formatDate(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate
                      ? ` - ${formatDate(event.endDate)}`
                      : ""}
                  </p>
                </div>
              </div>

              {(event.startTime || event.endTime) && (
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <Clock size={18} className="shrink-0 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">Time</p>
                    <p className="text-slate-500">
                      {event.startTime || "All day"}
                      {event.endTime ? ` - ${event.endTime}` : ""}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <MapPin size={18} className="shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Venue</p>
                  <p className="text-slate-500">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <DollarSign size={18} className="shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Price</p>
                  <p className="text-slate-500">
                    {event.price === 0 || !event.price
                      ? "Free"
                      : `$${event.price}`}
                  </p>
                </div>
              </div>

              {event.type && (
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <Tag size={18} className="shrink-0 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">Type</p>
                    <p className="text-slate-500 capitalize">{event.type}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <Users size={18} className="shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Capacity</p>
                  <p className="text-slate-500">
                    {event.registrationCount ?? 0} / {event.capacity} registered
                  </p>
                </div>
              </div>
            </div>

            {event.description && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  About This Event
                </h3>
                <p className="whitespace-pre-line text-base leading-relaxed text-slate-600">
                  {event.description}
                </p>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User size={18} className="text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">
                    {event.organizer.name}
                  </p>
                  <p className="text-slate-500">{event.organizer.email}</p>
                </div>
              </div>
            )}

            {(() => { const isOwner = event?.organizer?._id === user?.id; return (
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
              {isOwner ? (
                <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-500">
                  <User size={16} />You are the organizer
                </span>
              ) : isRegistered ? (
                <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-5 py-2.5 text-sm font-medium text-emerald-700">
                  <Ticket size={16} />Registered
                </span>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading === "register"}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {actionLoading === "register" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Ticket size={16} />
                  )}
                  Register Now
                </button>
              )}

              <button
                onClick={handleBookmark}
                disabled={actionLoading === "bookmark"}
                className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                  isSaved
                    ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {actionLoading === "bookmark" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Bookmark
                    size={16}
                    className={isSaved ? "fill-primary" : ""}
                  />
                )}
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
            ); })()}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}