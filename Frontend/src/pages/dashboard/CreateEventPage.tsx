import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useBreadcrumbs } from "../../context/BreadcrumbContext"
import { useCreateEvent } from "../../hooks/mutations/useEventMutations"
import EventForm from "../../components/events/EventForm"

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { setBreadcrumbs, setAction } = useBreadcrumbs()
  const createMutation = useCreateEvent()

  useEffect(() => {
    setBreadcrumbs(["Dashboard", "Events", "Create"])
    setAction(null)
  }, [setBreadcrumbs, setAction])

  const handleSubmit = async (payload) => {
    try {
      await createMutation.mutateAsync(payload)
      toast.success("Event created successfully!")
      navigate("/dashboard/events/manage")
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
      <div className="mb-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-500 text-sm">Fill in the details below to create a new event.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-[700px] mx-auto">
        <div className="p-8">
          <EventForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            onCancel={() => navigate("/dashboard/events/manage")}
          />
        </div>
      </div>
    </main>
  )
}
