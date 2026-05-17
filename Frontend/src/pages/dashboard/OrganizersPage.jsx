import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useBreadcrumbs } from "../../context/BreadcrumbContext";
import { getAllOrganizers } from "../../services/users";

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrganizersPage() {
  const { token } = useAuth();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Admin", "Organizers"]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllOrganizers(token)
      .then((res) => setOrganizers(res.users || []))
      .catch((err) => toast.error(err?.message || "Failed to load organizers"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizers</h1>
        <p className="text-gray-500 text-sm">Manage all event organizers on the platform.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map((org) => (
            <div key={org._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                {org.avatar ? (
                  <img
                    src={org.avatar}
                    alt={org.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg">
                    {getInitials(org.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                  <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    Organizer
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2 truncate">{org.email}</p>

              {org.bio && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{org.bio}</p>
              )}

              <p className="text-xs text-gray-400 mb-3">
                Joined {formatDate(org.createdAt)}
              </p>

              {org.interests && org.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {org.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
