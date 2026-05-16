import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Bookmark } from "lucide-react";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

const savedEvents = [
  {
    id: 1,
    title: "Design Systems at Scale 2024",
    category: "UX/UI",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    datetime: "Oct 15, 2024 \u2022 9:00 AM PST",
    location: "San Francisco, CA",
    actionText: "Register Now",
    actionType: "primary",
  },
  {
    id: 2,
    title: "Executive Leadership Summit",
    category: "Leadership",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    datetime: "Nov 02, 2024 \u2022 10:00 AM EST",
    location: "New York, NY",
    actionText: "View Details",
    actionType: "secondary",
  },
  {
    id: 3,
    title: "Founder\u2019s Pitch Night",
    category: "Startup",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800",
    datetime: "Nov 18, 2024 \u2022 6:00 PM CST",
    location: "Austin, TX",
    actionText: "Register Now",
    actionType: "primary",
  },
];

const SavedEventCard = ({ event }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-gray-800 tracking-wide">
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {event.title}
          </h3>
          <button className="text-violet-700 hover:text-violet-800 transition-colors flex-shrink-0 mt-1">
            <Bookmark className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
        <div className="space-y-3 mb-8 flex-grow">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Calendar className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.datetime}
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            {event.location}
          </div>
        </div>
        <button
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-colors ${
            event.actionType === "primary"
              ? "bg-violet-700 hover:bg-violet-800 text-white shadow-sm"
              : "bg-purple-100 hover:bg-purple-200 text-violet-700"
          }`}
        >
          {event.actionText}
        </button>
      </div>
    </div>
  );
};

export default function SavedEventsPage() {
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Saved"]);
    setAction({
      label: "Explore Events",
      onClick: () => navigate("/events"),
    });
  }, [setBreadcrumbs, setAction, navigate]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Saved Events
        </h1>
        <p className="text-gray-500 text-base">
          Events you&apos;ve bookmarked for later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savedEvents.map((event) => (
          <SavedEventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
