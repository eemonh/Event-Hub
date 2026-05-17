import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getAllUsers } from "../../services/users";

export default function UsersPage() {
  const { token } = useAuth();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Admin", "Users"]);
    setAction(null);
  }, [setBreadcrumbs, setAction]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllUsers(token)
      .then((res) => setUsers(res.users))
      .catch((err) => toast.error(err?.message || "Failed to load users"))
      .finally(() => setLoading(false));
  }, [token]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const roleBadge = (role) => {
    const color =
      role?.toLowerCase() === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700";
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {role}
      </span>
    );
  };

  const avatarEl = (user) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
        />
      );
    }
    const initial = (user.name?.[0] || "?").toUpperCase();
    return (
      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
        {initial}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-500 text-sm">Manage all registered platform users.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">
                  Interests
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {avatarEl(user)}
                      <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">{roleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(user.interests || []).map((interest, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
