/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Trash2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getAllUsers, updateUserRole, deleteUser, createUser } from "../../services/users";
import { DashboardTableSkeleton } from "../../components/ui/Skeletons";
import type { User, UsersResponse } from "../../types";

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-gray-100 text-gray-700",
};

const USERS_PER_PAGE = 8;

export default function UsersPage() {
  const { token } = useAuth();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<{ name: string; email: string; password: string; role: string }>({ name: "", email: "", password: "", role: "user" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Admin", "Users"]);
    setAction({ label: "Add New User", onClick: () => setShowAddModal(true) });
    return () => setAction(null);
  }, [setBreadcrumbs, setAction]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllUsers<UsersResponse>(token!)
      .then((res) => setUsers(res.users))
      .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => setCurrentPage(1), [searchQuery, roleFilter]);

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const avatarEl = (user: User) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0" />;
    }
    const initial = (user.name?.[0] || "?").toUpperCase();
    return (
      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
        {initial}
      </div>
    );
  };

  const roleBadge = (role: keyof typeof ROLE_STYLES) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ROLE_STYLES[role] || ROLE_STYLES.user}`}>
      {role}
    </span>
  );

  const handleRoleChange = async (user: User, newRole: "admin" | "user") => {
    const actionLabel = newRole === "admin" ? "promoted to admin" : "demoted to user";
    if (!window.confirm(`${newRole === "admin" ? "Promote" : "Demote"} "${user.name}" ${newRole === "admin" ? "to admin" : "to user"}?`)) return;
    try {
      await updateUserRole(token!, user.id || user._id, newRole);
      toast.success(`${user.name} ${actionLabel}`);
      setUsers((prev) => prev.map((u) => ((u.id || u._id) === (user.id || user._id) ? { ...u, role: newRole } : u)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(token!, user.id || user._id);
      toast.success(`${user.name} deleted`);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== (user.id || user._id)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleAddUser = async () => {
    const { name, email, password, role } = addForm;
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await createUser(token!, { name: name.trim(), email: email.trim(), password, role });
      toast.success("User created successfully");
      setShowAddModal(false);
      setAddForm({ name: "", email: "", password: "", role: "user" });
      const res: UsersResponse = await getAllUsers(token!);
      setUsers(res.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
        <DashboardTableSkeleton columns={4} rows={8} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-500 text-sm">Manage platform users, roles, and account statuses.</p>
        </div>
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
            {["All", "Admin", "User"].map((filter) => (
              <button
                key={filter}
                onClick={() => setRoleFilter(filter)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  roleFilter === filter ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Mobile card layout — visible on < sm */}
        <div className="sm:hidden divide-y divide-gray-100">
          {paginated.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">No users found</div>
          ) : (
            paginated.map((user) => (
              <div key={user.id || user._id} className="p-4">
                <div className="flex items-center mb-3">
                  {avatarEl(user)}
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {roleBadge(user.role)}
                  <div className="flex items-center gap-2">
                    {user.role === "user" && (
                      <button
                        onClick={() => handleRoleChange(user, "admin")}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                      >
                        Promote
                      </button>
                    )}
                    {user.role === "admin" && (
                      <button
                        onClick={() => handleRoleChange(user, "user")}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        Demote
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Desktop table — visible on sm+ */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[35%]">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[35%]">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">No users found</td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id || user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {avatarEl(user)}
                        <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === "user" && (
                          <button
                            onClick={() => handleRoleChange(user, "admin")}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                          >
                            Promote
                          </button>
                        )}
                        {user.role === "admin" && (
                          <button
                            onClick={() => handleRoleChange(user, "user")}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Demote
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">{filtered.length === 0 ? 0 : (currentPage - 1) * USERS_PER_PAGE + 1}</span> to{" "}
            <span className="font-medium text-gray-700">{Math.min(currentPage * USERS_PER_PAGE, filtered.length)}</span> of{" "}
            <span className="font-medium text-gray-700">{filtered.length}</span> users
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
