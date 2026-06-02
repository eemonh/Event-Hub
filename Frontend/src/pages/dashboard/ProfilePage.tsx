import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";

export default function DashboardProfile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setBreadcrumbs, setAction } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Profile"]);
    setAction({
      label: "Settings",
      onClick: () => navigate("/dashboard/profile/settings"),
    });
  }, [setBreadcrumbs, setAction, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  const userInitials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <section className="space-y-2">
        <h1 className="font-[Poppins] text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Profile
        </h1>
        <p className="text-base text-slate-500">
          Manage your account settings and preferences.
        </p>
      </section>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <span className="text-xl font-bold text-violet-700">{userInitials}</span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.name || "User"}
            </h2>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Mail size={14} />
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{user?.name || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900">{user?.email || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">User ID</span>
              <span className="font-medium text-slate-900 text-xs">{user?.id || "N/A"}</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Interests</h4>
              {user?.interests?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No interests added yet</p>
              )}
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate("/dashboard/profile/settings")}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer hover:border-violet-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
              <Settings size={20} className="text-violet-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
              <p className="text-sm text-slate-500">Update password, notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
