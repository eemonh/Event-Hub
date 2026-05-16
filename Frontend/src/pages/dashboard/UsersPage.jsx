import { useState, useEffect, useCallback } from "react";
import { Search, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

const loadUsers = () => {
  try {
    const stored = localStorage.getItem("eventhub_users");
    if (stored) {
      return JSON.parse(stored);
    }
    const defaultUsers = [
      {
        id: "1",
        name: "Elena James",
        initials: "EJ",
        email: "elena.j@example.com",
        role: "Admin",
        avatarColor: "bg-blue-600",
      },
      {
        id: "2",
        name: "John Smith",
        initials: "JS",
        email: "john.smith@example.com",
        role: "User",
        avatarColor: "bg-green-600",
      },
      {
        id: "3",
        name: "Sarah Wilson",
        initials: "SW",
        email: "sarah.w@example.com",
        role: "Organizer",
        avatarColor: "bg-purple-600",
      },
    ];
    localStorage.setItem("eventhub_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch {
    return [];
  }
};

export default function UsersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState(loadUsers);
  const { setBreadcrumbs, setAction } = useBreadcrumbs();

  const handleAddUser = useCallback(() => {
    const name = prompt("Enter user name:");
    if (!name) return;
    const email = prompt("Enter user email:");
    if (!email) return;
    
    const newUser = {
      id: crypto.randomUUID(),
      name,
      initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      email,
      role: "User",
      avatarColor: "bg-purple-600",
    };
    
    const updatedUsers = [...usersData, newUser];
    setUsersData(updatedUsers);
    localStorage.setItem("eventhub_users", JSON.stringify(updatedUsers));
    toast.success("User added successfully!");
  }, [usersData]);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Users"]);
    setAction({ label: "Add New User", onClick: handleAddUser });
  }, [setBreadcrumbs, setAction, handleAddUser]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Users Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage platform users, roles, and account statuses.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 shadow-sm"
            />
          </div>
          <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            {["All", "Active", "Inactive"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === filter
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[35%]">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[35%]">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersData.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 ${user.avatarColor}`}
                      >
                        {user.initials}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">1</span> to{" "}
            <span className="font-medium text-gray-700">1</span> of{" "}
            <span className="font-medium text-gray-700">1</span> users
          </div>
          <div className="flex items-center space-x-1">
            <button
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
              disabled
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
