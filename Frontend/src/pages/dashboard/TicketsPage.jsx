import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, QrCode, XCircle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getMyEvents, cancelRegistration } from "../../services/events";
import EventDetailModal from "../../components/events/EventDetailModal";

export default function TicketsPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [selectedQr, setSelectedQr] = useState(null);
  const [selectedQrEvent, setSelectedQrEvent] = useState(null);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Tickets"]);
    setAction({ label: "Browse Events", onClick: () => navigate("/dashboard/events") });
  }, [setBreadcrumbs, setAction, navigate]);

  const fetchEvents = async () => {
    try {
      const data = await getMyEvents(token);
      const list = data.events || [];
      setEvents(list);
      const codes = {};
      await Promise.all(list.map(async (event) => {
        const eventId = event._id || event.id;
        const regId = event.registrationId || "";
        const shortId = regId ? regId.toString().slice(-8).toUpperCase() : "--------";
        const renderDate = event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
        try {
          const ticketText = [
            "┌──────────────────────────┐",
            "│      ★ EVENT HUB ★       │",
            "│       OFFICIAL TICKET     │",
            "├──────────────────────────┤",
            "│                          │",
            `  ${(event.name || "").padEnd(24)}│`,
            "│                          │",
            `  ${(user?.name || "").padEnd(24)}│`,
            "│                          │",
            `  Ticket #: ${shortId.padEnd(13)}│`,
            `  ${renderDate.padEnd(24)}│`,
            "│                          │",
            "├──────────────────────────┤",
            "│  Present this at entry   │",
            "└──────────────────────────┘",
          ].join("\n");
          codes[eventId] = await QRCode.toDataURL(ticketText, { width: 160, margin: 1 });
        } catch {}
      }));
      setQrCodes(codes);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [token]);

  useEffect(() => {
    if (!selectedQr) return;
    const handleKey = (e) => { if (e.key === "Escape") { setSelectedQr(null); setSelectedQrEvent(null); } };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedQr]);

  const handleCancel = async (eventId) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return;
    try {
      await cancelRegistration(token, eventId);
      toast.success("Registration cancelled");
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const now = new Date();
  const filtered = events.filter((e) => {
    const d = new Date(e.startDate);
    return showUpcoming ? d >= now : d < now;
  }).sort((a, b) => {
    const diff = new Date(a.startDate) - new Date(b.startDate);
    return showUpcoming ? diff : -diff;
  });

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500 text-base mt-1">Your registered event passes.</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowUpcoming(true)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${showUpcoming ? "bg-violet-700 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setShowUpcoming(false)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${!showUpcoming ? "bg-violet-700 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            Past
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Ticket size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">
            {showUpcoming ? "No upcoming tickets" : "No past tickets"}
          </p>
          <p className="text-sm text-slate-400">
            {showUpcoming ? "Register for events to see your tickets here." : "Your attended events will appear here."}
          </p>
          {showUpcoming && (
            <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
              Browse Events
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((event) => {
            const eventId = event._id || event.id;
            const isPast = new Date(event.startDate) < now;
            const regId = event.registrationId || "";
            const shortRegId = regId ? regId.toString().slice(-8).toUpperCase() : "--------";
            const ownerId = event.organizer?._id ?? event.organizer;
            const isOwner = ownerId?.toString() === user?.id;

            return (
              <div key={eventId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700">
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.name} className="h-full w-full object-cover opacity-70" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Ticket size={48} className="text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-sm">{event.title || event.name}</h3>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {event.startTime && <span className="flex items-center gap-1.5"><Clock size={14} />{event.startTime}</span>}
                    <span className="flex items-center gap-1.5"><MapPin size={14} />{event.venue}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300" />

                <div className="flex items-start gap-4 p-5">
                  <div
                    onClick={(e) => { e.stopPropagation(); if (qrCodes[eventId]) { setSelectedQr(qrCodes[eventId]); setSelectedQrEvent(event); } }}
                    className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 bg-white overflow-hidden transition hover:border-violet-300"
                  >
                    {qrCodes[eventId] ? (
                      <img src={qrCodes[eventId]} alt="QR code" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <QrCode size={28} className="text-slate-400" />
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Scan</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="text-xs text-slate-500">
                      Ticket ID: <span className="font-mono font-semibold text-slate-700">{shortRegId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${isPast ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
                        {isPast ? "Attended" : "Registered"}
                      </span>
                      {!isOwner && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                          <Ticket size={11} />Ticket
                        </span>
                      )}
                    </div>
                    {!isPast && !isOwner && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(eventId); }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <XCircle size={14} />Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setSelectedEventId(eventId)}
                  className="cursor-pointer border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-center text-xs font-semibold text-violet-700 transition hover:bg-slate-100"
                >
                  View Event Details
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EventDetailModal
        eventId={selectedEventId}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />

      {selectedQr && (
        <div
          onClick={() => { setSelectedQr(null); setSelectedQrEvent(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => { setSelectedQr(null); setSelectedQrEvent(null); }}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-100"
            >
              <X size={16} />
            </button>
            <img src={selectedQr} alt="QR code" className="h-64 w-64 object-contain" />
            {selectedQrEvent && (
              <>
                <p className="text-lg font-bold text-gray-900">{selectedQrEvent.title || selectedQrEvent.name}</p>
                <p className="text-sm text-slate-500">
                  Ticket ID: <span className="font-mono font-semibold text-slate-700">
                    {(() => { const r = selectedQrEvent.registrationId || ""; return r ? r.toString().slice(-8).toUpperCase() : "--------"; })()}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
