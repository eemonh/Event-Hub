import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Bookmark, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getSavedEvents, removeBookmark, getMyEvents } from "../../services/events";
import EventDetailModal from "../../components/events/EventDetailModal";

const SavedEventCard = ({ event, onRemove, onClick, isOwner, isRegistered }) => {
  return (
    <div onClick={onClick} className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={event.coverImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"}
          alt={event.title || event.name}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-gray-800 tracking-wide">{event.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{event.title || event.name}</h3>
          <button onClick={(e) => { e.stopPropagation(); onRemove(event._id || event.id); }} className="text-violet-700 hover:text-violet-800 transition-colors flex-shrink-0 mt-1" title="Remove bookmark">
            <Bookmark className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
        <div className="space-y-3 mb-8 flex-grow">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Calendar className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : event.datetime}
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.venue || event.location}
          </div>
        </div>
        {isOwner ? (
          <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500"><Bookmark size={14} />You are the organizer</span>
        ) : isRegistered ? (
          <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700"><Bookmark size={14} />Registered</span>
        ) : (
          <button className="w-full py-3 px-4 rounded-xl text-sm font-bold transition-colors bg-violet-700 hover:bg-violet-800 text-white shadow-sm">Register Now</button>
        )}
      </div>
    </div>
  );
};

export default function SavedEventsPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchSaved = async () => {
    try {
      const data = await getSavedEvents(token);
      setEvents(data.events || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistered = async () => {
    if (!token) return;
    try {
      const data = await getMyEvents(token);
      setRegisteredIds(new Set((data.events || []).map((e) => e._id || e.id)));
    } catch {}
  };

  useEffect(() => { fetchSaved(); fetchRegistered(); }, [token]);
  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Saved"]);
    setAction({ label: "Explore Events", onClick: () => navigate("/events") });
  }, [setBreadcrumbs, setAction, navigate]);

  const handleRemove = async (eventId) => {
    try {
      await removeBookmark(token, eventId);
      toast.success("Bookmark removed");
      fetchSaved();
    } catch (err) {
      toast.error(err.message);
    }
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
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Events</h1>
        <p className="text-gray-500 text-base">Events you've bookmarked for later.</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Bookmark size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No saved events yet</p>
          <p className="text-sm text-slate-400">Browse events and bookmark them to see them here.</p>
          <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <SavedEventCard key={event._id || event.id} event={event} onRemove={handleRemove} onClick={() => setSelectedEventId(event._id || event.id)} isOwner={(event.organizer?.toString()) === user?.id} isRegistered={registeredIds.has(event._id || event.id)} />
          ))}
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
