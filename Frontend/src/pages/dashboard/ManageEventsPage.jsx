import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Globe,
  Rocket,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

const StatusBadge = ({ status }) => {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 mr-1.5" />
        Active
      </span>
    );
  }
  if (status === "Draft") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <Circle className="w-2 h-2 fill-gray-400 text-gray-400 mr-1.5" />
        Draft
      </span>
    );
  }
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
        <CheckCircle2 className="w-3 h-3 text-purple-600 mr-1.5" />
        Completed
      </span>
    );
  }
  return null;
};

const ProgressBar = ({ registered, capacity, status }) => {
  const percentage = capacity > 0 ? (registered / capacity) * 100 : 0;
  let barColor = "bg-emerald-500";
  if (status === "Completed") barColor = "bg-purple-300";
  if (status === "Draft" || registered === 0) barColor = "bg-purple-100";

  return (
    <div className="w-24">
      <div className="flex justify-end mb-1">
        <span className="text-sm font-semibold text-gray-700">
          {registered.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`${barColor} h-1.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function ManageEventsPage() {
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [eventsData, setEventsData] = useState([
    {
      id: 1,
      name: "Global Tech Summit 2024",
      type: "Conference",
      date: "Oct 15, 2024",
      time: "09:00 AM PST",
      venue: "Moscone Center, SF",
      registered: 1250,
      capacity: 1500,
      status: "Active",
      icon: Briefcase,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 2,
      name: "Design Systems Workshop",
      type: "Workshop",
      date: "Nov 02, 2024",
      time: "10:00 AM EST",
      venue: "Virtual (Zoom)",
      registered: 45,
      capacity: 50,
      status: "Active",
      icon: Globe,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      name: "Product Launch Alpha",
      type: "Internal",
      date: "TBD",
      time: "TBD",
      venue: "HQ Building A",
      registered: 0,
      capacity: 200,
      status: "Draft",
      icon: Rocket,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
    },
    {
      id: 4,
      name: "Q3 Townhall",
      type: "Company Wide",
      date: "Sep 10, 2024",
      time: "01:00 PM EST",
      venue: "Main Auditorium",
      registered: 500,
      capacity: 500,
      status: "Completed",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]);

  const handleEdit = (id) => {
    toast.success(`Edit event ${id}`);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEventsData((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully");
    }
  };

  const handleView = (id) => {
    toast.success(`View event ${id}`);
  };

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Manage"]);
    setAction({
      label: "Create Event",
      onClick: () => navigate("/dashboard/events/create"),
    });
  }, [setBreadcrumbs, setAction, navigate]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Event Management
        </h1>
        <p className="text-gray-500 text-sm">
          Overview and administration of all platform events.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[25%]">
                  Event Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider text-right">
                  Seats
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider text-right">
                  Registrations
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eventsData.map((event) => {
                const Icon = event.icon;
                return (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-xl mr-4 flex-shrink-0 ${event.iconBg}`}
                        >
                          <Icon className={`w-5 h-5 ${event.iconColor}`} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-0.5">
                            {event.name}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            {event.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-800 mb-0.5">
                        {event.date}
                      </div>
                      <div className="text-xs text-gray-400">
                        {event.time}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {event.venue}
                    </td>
                    <td className="px-6 py-5 text-right text-sm">
                      <span className="font-semibold text-gray-900">
                        {event.registered.toLocaleString()}
                      </span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-600">
                        {event.capacity.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 flex justify-end">
                      <ProgressBar
                        registered={event.registered}
                        capacity={event.capacity}
                        status={event.status}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleView(event.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(event.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="text-sm text-gray-500">
            Showing 1 to 4 of 24 entries
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
