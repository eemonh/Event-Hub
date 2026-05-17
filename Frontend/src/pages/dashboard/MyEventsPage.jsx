import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, RotateCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getMyEvents, cancelRegistration } from "../../services/events";
import EventDetailModal from "../../components/events/EventDetailModal";

const EventCard = ({ event, isPast, onCancel, onClick }) => {
  return (
    <div onClick={onClick} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
          alt={event.title || event.name}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"; }}
          className={`w-full h-full object-cover ${isPast ? "grayscale opacity-80" : ""}`}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title || event.name}
        </h3>
        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPast ? "bg-gray-100 text-gray-600" : "bg-purple-100 text-purple-700"
          }`}>
            {isPast ? "Attended" : "Registered"}
          </span>
        </div>
        <div className="space-y-2 mb-6 flex-grow">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : event.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {event.startTime || event.time || "All day"}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {event.venue || event.location}
          </div>
        </div>
        {isPast ? (
          <button disabled className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-purple-50 text-purple-400 cursor-not-allowed">
            <RotateCcw className="w-4 h-4 mr-2" />
            Event Ended
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-violet-700 hover:bg-violet-800 text-white transition-colors">
              <Ticket className="w-4 h-4 mr-2" />
              View Ticket
            </button>
            <button onClick={(e) => { e.stopPropagation(); onCancel(event._id || event.id); }} className="py-2.5 px-4 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MyEventsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const data = await getMyEvents(token);
      setEvents(data.events || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [token]);
  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "My Events"]);
    setAction({ label: "Explore More", onClick: () => navigate("/events") });
  }, [setBreadcrumbs, setAction, navigate]);

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
  const upcoming = events.filter((e) => new Date(e.startDate) >= now);
  const past = events.filter((e) => new Date(e.startDate) < now);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-gray-500">Manage your registrations and view your tickets.</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <Calendar size={48} className="text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No registered events yet</p>
          <p className="text-sm text-slate-400">Browse events and register to see them here.</p>
          <button onClick={() => navigate("/dashboard/events")} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 transition-colors">
            Browse Events
          </button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <EventCard key={event._id || event.id} event={event} isPast={false} onCancel={handleCancel} onClick={() => setSelectedEventId(event._id || event.id)} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((event) => (
                  <EventCard key={event._id || event.id} event={event} isPast={true} onClick={() => setSelectedEventId(event._id || event.id)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <EventDetailModal
        eventId={selectedEventId}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </main>
  );
}
