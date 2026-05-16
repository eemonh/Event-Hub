import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, RotateCcw } from "lucide-react";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

const upcomingEvents = [
  {
    id: 1,
    title: "Tech Innovators Summit 2024",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    status: "Registered",
    date: "Oct 15 - 17, 2024",
    time: "09:00 AM - 05:00 PM PST",
    location: "Moscone Center, SF",
  },
  {
    id: 2,
    title: "Design Leadership Conference",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    status: "Registered",
    date: "Nov 05, 2024",
    time: "10:00 AM - 04:00 PM EST",
    location: "Virtual Event",
  },
];

const pastEvents = [
  {
    id: 3,
    title: "Global React Summit",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    status: "Attended",
    date: "Aug 12, 2024",
    time: "08:00 AM - 06:00 PM EST",
    location: "Jacob Javits Center, NY",
  },
];

const EventCard = ({ event, isPast }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={event.image}
          alt={event.title}
          className={`w-full h-full object-cover ${isPast ? "grayscale opacity-80" : ""}`}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isPast
                ? "bg-gray-100 text-gray-600"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {event.status}
          </span>
        </div>
        <div className="space-y-2 mb-6 flex-grow">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {event.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {event.location}
          </div>
        </div>
        <button
          disabled={isPast}
          className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${
            isPast
              ? "bg-purple-50 text-purple-400 cursor-not-allowed"
              : "bg-violet-700 hover:bg-violet-800 text-white"
          }`}
        >
          {isPast ? (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              Event Ended
            </>
          ) : (
            <>
              <Ticket className="w-4 h-4 mr-2" />
              View Ticket
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "My Events"]);
    setAction({
      label: "Explore More",
      onClick: () => navigate("/events"),
    });
  }, [setBreadcrumbs, setAction, navigate]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-gray-500">
          Manage your registrations and view your tickets.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} isPast={false} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Past Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} isPast={true} />
          ))}
        </div>
      </div>
    </main>
  );
}
