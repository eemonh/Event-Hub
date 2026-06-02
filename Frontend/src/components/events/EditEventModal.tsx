import { useCallback } from "react"
import toast from "react-hot-toast"
import Modal from "../ui/Modal"
import { useEvent } from "../../hooks/queries/useEvents"
import { useUpdateEvent } from "../../hooks/mutations/useEventMutations"
import EventForm from "./EventForm"
import { ModalFormSkeleton } from "../ui/Skeletons"

export default function EditEventModal({ eventId, isOpen, onClose }) {
  const { data, isLoading } = useEvent(eventId)
  const updateMutation = useUpdateEvent()

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
        <ModalFormSkeleton />
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
