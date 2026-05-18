import { useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Modal from "../ui/Modal"
import { useAuth } from "../../context/AuthContext"
import { useEvent } from "../../hooks/queries/useEvents"
import { useUpdateEvent } from "../../hooks/mutations/useEventMutations"
import EventForm from "./EventForm"

export default function EditEventModal({ eventId, isOpen, onClose }) {
  const { token } = useAuth()
  const { data, isLoading } = useEvent(eventId)
  const updateMutation = useUpdateEvent()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setInitialized(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async (payload) => {
    try {
      await updateMutation.mutateAsync({ id: eventId, data: payload })
      toast.success("Event updated successfully!")
      onClose()
    } catch (err) {
      toast.error(err.message)
    }
  }, [eventId, updateMutation, onClose])

  const event = data?.event
  const showForm = isOpen && !!event
  const formInitialData = event ? {
    name: event.name || "",
    type: event.type || "",
    category: event.category || "",
    startDate: event.startDate ? event.startDate.slice(0, 10) : "",
    startTime: event.startTime || "",
    endDate: event.endDate ? event.endDate.slice(0, 10) : "",
    endTime: event.endTime || "",
    venue: event.venue || "",
    coverImage: event.coverImage || "",
    description: event.description || "",
    capacity: event.capacity?.toString() || "",
    price: event.price?.toString() || "0",
    status: event.status || "published",
    subtitle: event.subtitle || "",
    schedule: event.schedule || [],
  } : undefined

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-violet-700" />
        </div>
      ) : showForm ? (
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
            <p className="mt-1 text-sm text-gray-500">Update the event details below.</p>
          </div>
          <EventForm
            initialData={formInitialData}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
            onCancel={onClose}
          />
        </div>
      ) : null}
    </Modal>
  )
}
