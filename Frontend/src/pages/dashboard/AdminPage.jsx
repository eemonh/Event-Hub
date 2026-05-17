import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { useAuth } from "../../context/AuthContext";
import { getAllEvents, getAdminStats } from "../../services/events";
import {
  Calendar, UserPlus, Banknote, TrendingUp,
  Activity, Palette, Utensils,
  MoreVertical, ChevronLeft, ChevronRight, ArrowRight, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const styles = {
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const eventIcons = [Activity, Palette, Utensils];

const iconColorClasses = [
  { bg: "bg-purple-100", icon: "text-purple-600" },
  { bg: "bg-blue-100", icon: "text-blue-600" },
  { bg: "bg-amber-100", icon: "text-amber-700" },
];

export default function AdminPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Admin"]);
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") });
  }, [setBreadcrumbs, setAction, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        getAllEvents(token).then((r) => r.events || []),
        getAdminStats(token).then((r) => r),
      ]);

      const [eventsRes, statsRes] = results;

      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value);
      else console.error("Failed to fetch events:", eventsRes.reason);

      if (statsRes.status === "fulfilled") setTotalRegistrations(statsRes.value.totalRegistrations);
      else console.error("Failed to fetch stats:", statsRes.reason);

      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        const msg = `Failed to load ${failures.length} of 2 data sources`;
        setError(msg);
        toast.error(msg);
      }

      setLoading(false);
    };
    fetchData();
  }, [token, retryCount]);

  const recentEvents = [...events]
    .filter((e) => e.status === "published")
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      </main>
    );
  }

  const statsData = [
    {
      title: "TOTAL EVENTS",
      value: String(events.length),
      trend: "+12%",
      icon: Calendar,
      colorClass: "text-purple-600 bg-purple-100",
      gradientClass: "bg-gradient-to-t from-purple-50 to-white",
    },
    {
      title: "TOTAL REGISTRATION",
      value: totalRegistrations.toLocaleString(),
      trend: "+5.4%",
      icon: UserPlus,
      colorClass: "text-blue-600 bg-blue-100",
      gradientClass: "bg-gradient-to-t from-blue-50 to-white",
    },
    {
      title: "MONTHLY REVENUE",
      value: "$12,450",
      trend: "+8.2%",
      icon: Banknote,
      colorClass: "text-emerald-600 bg-emerald-100",
      gradientClass: "bg-gradient-to-t from-emerald-50 to-white",
    },
  ];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening with your events today.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-600 font-medium text-sm">{error}</span>
          </div>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${stat.gradientClass}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                    {stat.title}
                  </h3>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {stat.value}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center text-sm mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1.5" />
                <span className="text-emerald-600 font-semibold mr-2">{stat.trend}</span>
                <span className="text-gray-400">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
          <button className="text-[#6200ea] hover:text-[#5200c3] text-sm font-semibold flex items-center transition-colors">
            View All
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    No published events yet.
                  </td>
                </tr>
              ) : (
                recentEvents.map((event) => {
                  const EventIcon = eventIcons[Math.abs(event.name?.length || 0) % 3];
                  const colors = iconColorClasses[Math.abs(event.name?.length || 0) % 3];
                  const startDate = new Date(event.startDate);
                  return (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center">
                        <div className={`p-2.5 rounded-xl mr-4 ${colors.bg} ${colors.icon}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-0.5">{event.name}</div>
                          <div className="text-xs text-gray-400">ID: {(event._id || "").slice(-6).toUpperCase()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-800 mb-0.5">
                          {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="text-xs text-gray-400">{event.startTime || "All day"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{event.venue}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-700">1</span> to{" "}
            <span className="font-semibold text-gray-700">{Math.min(recentEvents.length, 5) || 0}</span> of{" "}
            <span className="font-semibold text-gray-700">{events.length}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-900 font-semibold text-xs">1</button>
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
