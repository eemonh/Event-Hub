import { useCallback } from "react"
import toast from "react-hot-toast"
import Modal from "../ui/Modal"
import { useEvent } from "../../hooks/queries/useEvents"
import { useUpdateEvent } from "../../hooks/mutations/useEventMutations"
import EventForm from "./EventForm"
import type { EventFormData } from "../../types"
import { ModalFormSkeleton } from "../ui/Skeletons"

interface EditEventModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditEventModal({ eventId, isOpen, onClose }: EditEventModalProps) {
  const { data, isLoading } = useEvent(eventId)
  const updateMutation = useUpdateEvent()

  const handleSubmit = useCallback(async (payload: EventFormData) => {
    try {
      await updateMutation.mutateAsync({ id: eventId, data: payload as unknown as Record<string, unknown> })
      toast.success("Event updated successfully!")
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update event")
    }
  }, [eventId, updateMutation, onClose])

  const event = data?.event
  const showForm = isOpen && !!event
  const formInitialData = event
    ? {
        name: event.name || "",
        type: event.type || "",
        category: event.category || "",
        startDate: event.startDate?.slice(0, 10) || "",
        startTime: event.startTime || "",
        endDate: event.endDate?.slice(0, 10) || "",
        endTime: event.endTime || "",
        venue: event.venue || "",
        coverImage: event.coverImage || "",
        description: event.description || "",
        capacity: event.capacity,
        price: event.price,
        status: (event.status as "draft" | "published" | "cancelled") || "published",
        subtitle: event.subtitle || "",
        schedule: event.schedule || [],
      }
    : undefined;

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
