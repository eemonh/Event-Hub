import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Search, Bookmark, Loader2, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getEvents, registerForEvent, bookmarkEvent, removeBookmark, getSavedEvents, getMyEvents } from "../../services/events";
import EventDetailModal from "../../components/events/EventDetailModal";

const CATEGORIES = ["All", "Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"];

export default function DashboardEvents() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedIds, setSavedIds] = useState(new Set());
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => { setBreadcrumbs(["Dashboard", "Events"]); setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") }); }, [setBreadcrumbs, setAction, navigate]);

  const fetchEvents = async (page = currentPage) => {
    setLoading(true);
    try {
      const data = await getEvents(token, { category, search, page, limit: 20 });
      setEvents(data.events || []);
      setTotalPages(data.pages || 1);
      setCurrentPage(data.page || 1);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchEvents(page);
  };

  const fetchSaved = async () => {
    if (!token) return;
    try {
      const data = await getSavedEvents(token);
      setSavedIds(new Set((data.events || []).map((e) => e._id || e.id)));
    } catch {}
  };

  const fetchRegistered = async () => {
    if (!token) return;
    try {
      const data = await getMyEvents(token);
      setRegisteredIds(new Set((data.events || []).map((e) => e._id || e.id)));
    } catch {}
  };

  useEffect(() => { setCurrentPage(1); fetchEvents(1); fetchSaved(); fetchRegistered(); }, [token, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEvents(1);
  };

  const handleRegister = async (eventId, e) => {
    e.stopPropagation();
    try { await registerForEvent(token, eventId); toast.success("Registered successfully!"); }
    catch (err) { toast.error(err.message); }
  };

  const isOwner = (event) => {
    const ownerId = event.organizer?._id ?? event.organizer;
    return ownerId?.toString() === user?.id;
  };

  const handleBookmark = async (eventId, e) => {
    e.stopPropagation();
    try {
      if (savedIds.has(eventId)) {
        await removeBookmark(token, eventId);
        setSavedIds((prev) => { const n = new Set(prev); n.delete(eventId); return n; });
        toast.success("Bookmark removed");
      } else {
        await bookmarkEvent(token, eventId);
        setSavedIds((prev) => new Set(prev).add(eventId));
        toast.success("Event saved!");
      }
    } catch (err) { toast.error(err.message); }
  };

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
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Browse Events</h1>
        <p className="text-base text-slate-500">Discover events and register to attend.</p>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-700/50" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${(cat === "All" && !category) || category === cat ? "bg-violet-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <CalendarDays size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No events found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventId = event._id || event.id;
            const isSaved = savedIds.has(eventId);
            const startDate = new Date(event.startDate);
            return (
              <div key={eventId} onClick={() => setSelectedEventId(eventId)} className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                   <img src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"} alt={event.name} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"; }} className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-violet-700 shadow">{event.category}</div>
                  <button onClick={(e) => handleBookmark(eventId, e)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition-colors">
                    <Bookmark size={16} className={isSaved ? "text-violet-700 fill-violet-700" : "text-slate-500"} />
                  </button>
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="font-[Poppins] text-xl font-semibold leading-snug text-slate-900">{event.name}</h3>
                  <div className="space-y-1.5 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      {event.startTime && ` at ${event.startTime}`}
                    </div>
                    <div className="flex items-center gap-2"><MapPin size={14} />{event.venue}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-slate-700">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                    {isOwner(event) ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500"><Ticket size={14} />You are the organizer</span>
                    ) : registeredIds.has(eventId) ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700"><Ticket size={14} />Registered</span>
                    ) : (
                      <button onClick={(e) => handleRegister(eventId, e)} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800">
                        <Ticket size={14} />Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
  );
}
