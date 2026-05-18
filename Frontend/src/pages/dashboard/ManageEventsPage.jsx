import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, Globe, Rocket, Users, Pencil, Trash2, Eye } from "lucide-react"
import toast from "react-hot-toast"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useAllEvents } from "../../hooks/queries/useEvents"
import { useDeleteEvent } from "../../hooks/mutations/useEventMutations"
import EditEventModal from "../../components/events/EditEventModal"
import StatusBadge from "../../components/ui/StatusBadge"
import { DashboardTableSkeleton } from "../../components/ui/Skeletons"

const icons = [Briefcase, Globe, Rocket, Users]

export default function ManageEventsPage() {
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const { data, isLoading } = useAllEvents()
  const deleteMutation = useDeleteEvent()
  const [editEventId, setEditEventId] = useState(null)

  const events = data?.events || []

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Manage"])
    setAction({ label: "Create Event", onClick: () => navigate("/dashboard/events/create") })
  }, [setBreadcrumbs, setAction, navigate])

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Event deleted successfully"),
      onError: (err) => toast.error(err.message),
    })
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <DashboardTableSkeleton columns={6} />
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
        <p className="text-gray-500 text-sm">Overview and administration of all platform events.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-purple-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider w-[25%]">Event Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-purple-900/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No events found</td></tr>
              ) : (
                events.map((event) => {
                  const Icon = icons[Math.abs(event.type?.length || 0) % 4]
                  const isPast = new Date(event.endDate || event.startDate) < new Date()
                  const displayStatus = event.status === "published" && isPast ? "completed" : event.status
                  return (
                    <tr key={event._id || event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="p-3 rounded-xl mr-4 flex-shrink-0 bg-purple-100"><Icon className="w-5 h-5 text-purple-600" /></div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm mb-0.5">{event.name}</div>
                            <div className="text-xs text-gray-400 font-medium">{event.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-800">
                          {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">{event.venue}</td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">{event.category}</td>
                      <td className="px-6 py-5"><StatusBadge status={displayStatus} /></td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => navigate('/events/' + (event._id || event.id))} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => setEditEventId(event._id || event.id)} className="p-1.5 rounded-md text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(event._id || event.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditEventModal
        eventId={editEventId}
        isOpen={!!editEventId}
        onClose={() => setEditEventId(null)}
      />
    </main>
  )
}
