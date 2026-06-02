import { useTopEvents } from "../../hooks/queries/useAnalytics"
import { SkeletonBlock } from "../ui/Skeletons"

export default function TopEventsTable() {
  const { data, isLoading } = useTopEvents(5)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Top Performing Events</h2>
        <p className="text-sm text-gray-500 mt-0.5">Ranked by registration count</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4 font-medium w-12">#</th>
              <th className="px-6 py-4 font-medium">Event Name</th>
              <th className="px-6 py-4 font-medium text-right">Registrations</th>
              <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">Capacity</th>
              <th className="px-6 py-4 font-medium text-right hidden md:table-cell">Fill Rate</th>
              <th className="px-6 py-4 font-medium text-right hidden lg:table-cell">Bookmarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <SkeletonBlock className={`h-4 ${j === 0 ? "w-6" : j === 1 ? "w-40" : "w-16 ml-auto"}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.events?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                  No event data available yet.
                </td>
              </tr>
            ) : (
              data?.events?.map((event, index) => (
                <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? "bg-amber-100 text-amber-700"
                        : index === 1
                        ? "bg-gray-200 text-gray-600"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-50 text-gray-400"
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{event.name}</div>
                    <div className="text-xs text-gray-400">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-900">{event.registrationCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{event.capacity}</span>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            event.fillRate != null && event.fillRate >= 80
                              ? "bg-emerald-500"
                              : event.fillRate != null && event.fillRate >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(event.fillRate ?? 0, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 min-w-[3ch]">{event.fillRate ?? 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{event.bookmarkCount ?? 0}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
