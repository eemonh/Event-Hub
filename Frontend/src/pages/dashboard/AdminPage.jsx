import { useState, useEffect } from "react";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { useAuth } from "../../context/AuthContext";
import { getAllEvents } from "../../services/events";
import { getUsers, getOrganizers } from "../../services/users";
import { Calendar, Users, UserCheck, Activity, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const styles = { published: "bg-emerald-50 text-emerald-700 border-emerald-100", draft: "bg-gray-100 text-gray-600 border-gray-200", cancelled: "bg-red-50 text-red-700 border-red-100" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function AdminPage() {
  const { token } = useAuth();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Admin"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        getAllEvents(token).then((r) => r.events || []),
        getUsers(token).then((r) => r.users || []),
        getOrganizers(token).then((r) => r.users || []),
      ]);

      const [eventsRes, usersRes, organizersRes] = results;

      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value);
      else console.error("Failed to fetch events:", eventsRes.reason);

      if (usersRes.status === "fulfilled") setUsers(usersRes.value);
      else console.error("Failed to fetch users:", usersRes.reason);

      if (organizersRes.status === "fulfilled") setOrganizers(organizersRes.value);
      else console.error("Failed to fetch organizers:", organizersRes.reason);

      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        const msg = `Failed to load ${failures.length} of 3 data sources`;
        setError(msg);
        toast.error(msg);
      }

      setLoading(false);
    };
    fetchData();
  }, [token, retryCount]);

  const liveEvents = events.filter((e) => e.status === "published");
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

  const statCards = [
    { label: "Total Events", count: events.length, icon: Calendar, bg: "bg-violet-100", iconColor: "text-violet-600" },
    { label: "Total Users", count: users.length, icon: Users, bg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Organizers", count: organizers.length, icon: UserCheck, bg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { label: "Live Events", count: liveEvents.length, icon: Activity, bg: "bg-amber-100", iconColor: "text-amber-600" },
  ];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview and management of the Event Hub platform.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center"
            >
              <div className={`p-4 rounded-xl mr-5 ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">{card.label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{card.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEvents.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                    {event.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {event.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {new Date(event.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={event.status} />
                  </td>
                </tr>
              ))}
              {recentEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                    No published events yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
