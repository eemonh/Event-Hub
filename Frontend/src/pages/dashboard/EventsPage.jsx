import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, User, Search, Loader2, Bookmark, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getEvents, registerForEvent, bookmarkEvent, removeBookmark, getSavedEvents, getMyEvents } from "../../services/events";

const CATEGORIES = ["All", "Technology", "Design", "Business", "Startup", "Music", "Arts", "Health", "Sports", "Education", "Food & Drink", "Networking", "Other"];
const DATE_FILTERS = ["Any Date", "Today", "This Weekend", "This Week", "This Month"];
const SORT_OPTIONS = ["Upcoming", "Price: Low to High", "Price: High to Low"];

export default function DashboardEvents() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Any Date");
  const [sort, setSort] = useState("Upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedIds, setSavedIds] = useState(new Set());
  const [registeredIds, setRegisteredIds] = useState(new Set());

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events"]);
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") });
  }, [setBreadcrumbs, setAction, navigate]);

  const fetchEvents = async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await getEvents(token, { category, search, page, limit: 6 });
      if (append) {
        setEvents(prev => [...prev, ...(data.events || [])]);
      } else {
        setEvents(data.events || []);
      }
      setTotalPages(data.pages || 1);
      setCurrentPage(data.page || 1);
    } catch (err) {
      if (!append) setEvents([]);
      if (!append) toast.error(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEvents(1, false);
  }, [token, category, dateFilter, sort]);

  const fetchSaved = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getSavedEvents(token);
      setSavedIds(new Set((data.events || []).map(e => e._id || e.id)));
    } catch {}
  }, [token]);

  const fetchRegistered = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getMyEvents(token);
      setRegisteredIds(new Set((data.events || []).map(e => e._id || e.id)));
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchSaved();
    fetchRegistered();
  }, [fetchSaved, fetchRegistered]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEvents(1, false);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchEvents(currentPage + 1, true);
    }
  };

  const handleRegister = async (eventId, e) => {
    e.stopPropagation();
    if (!token) return toast.error("Please log in to register");
    try {
      await registerForEvent(token, eventId);
      toast.success("Registered successfully!");
      setRegisteredIds(prev => new Set(prev).add(eventId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBookmark = async (eventId, e) => {
    e.stopPropagation();
    if (!token) return toast.error("Please log in to bookmark");
    try {
      if (savedIds.has(eventId)) {
        await removeBookmark(token, eventId);
        setSavedIds(prev => { const n = new Set(prev); n.delete(eventId); return n; });
        toast.success("Bookmark removed");
      } else {
        await bookmarkEvent(token, eventId);
        setSavedIds(prev => new Set(prev).add(eventId));
        toast.success("Event saved!");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isOwner = (event) => {
    const ownerId = event.organizer?._id ?? event.organizer;
    return ownerId?.toString() === user?.id;
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          Browse Events
        </h1>
        <p className="text-base text-slate-500">
          Discover events and register to attend.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:flex-row">
        <form onSubmit={handleSearch} className="flex flex-grow items-center rounded-xl border border-slate-100 bg-[#F8F9FA] px-4 py-2 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary">
          <Search className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </form>

        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="relative w-full sm:w-auto">
            <select
              value={category || "All"}
              onChange={(e) => setCategory(e.target.value === "All" ? "" : e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-[#F8F9FA] px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary sm:w-44"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-[#F8F9FA] px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary sm:w-40"
            >
              {DATE_FILTERS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-[#F8F9FA] px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary sm:w-44"
            >
              {SORT_OPTIONS.map(s => (
                <option key={s} value={s}>Sort: {s}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
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
            const eventId = event._id || event.id;
            const startDate = new Date(event.startDate);
            const isSaved = savedIds.has(eventId);
            const isRegistered = registeredIds.has(eventId);
            const isEventOwner = isOwner(event);
            return (
              <div key={eventId} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-lg">
                <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                  <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"}
                    alt={event.name}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"; }}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold tracking-wide text-slate-800 shadow-sm backdrop-blur-sm">
                    {event.category}
                  </span>
                  <button
                    onClick={(e) => handleBookmark(eventId, e)}
                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition-colors hover:bg-gray-50 ${
                      isSaved ? "text-primary" : "text-slate-500"
                    }`}
                  >
                    <Bookmark size={16} className={isSaved ? "fill-primary" : ""} />
                  </button>
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
                      <span>{event.organizer?.name || "Unknown"}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-semibold text-slate-700">
                      {event.price === 0 || !event.price ? "Free" : `$${event.price}`}
                    </span>
                  </div>

                  <div className="mt-auto flex gap-3">
                    {isEventOwner ? (
                      <span className="flex flex-grow items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-500">
                        <User size={14} /> Organizer
                      </span>
                    ) : isRegistered ? (
                      <span className="flex flex-grow items-center justify-center gap-1.5 rounded-xl bg-emerald-100 py-2.5 text-sm font-medium text-emerald-700">
                        <Ticket size={14} /> Registered
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleRegister(eventId, e)}
                        className="flex-grow rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
                      >
                        Register
                      </button>
                    )}

                    <button
                      onClick={(e) => handleBookmark(eventId, e)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                        isSaved
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && currentPage < totalPages && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-transparent px-8 py-3 font-bold text-primary shadow-sm transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Load More Events
          </button>
        </div>
      )}
    </div>
  );
}
