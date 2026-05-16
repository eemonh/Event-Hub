import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardProfile() {
  const { user } = useAuth();

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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <User size={28} className="text-violet-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.name || "User"}
            </h2>
            <p className="text-sm text-slate-500">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
