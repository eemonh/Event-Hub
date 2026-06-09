import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MapPin, Plus, Trash2 } from "lucide-react";
import type { EventFormData, ScheduleItem } from "../../types";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { eventFormSchema, EVENT_TYPE_OPTIONS, CATEGORY_OPTIONS, buildEventPayload, toInitialFormState } from "../../utils/eventSchemas";
import type { EventFormValues } from "../../utils/eventSchemas";

const CATEGORIES = CATEGORY_OPTIONS;

interface EventFormProps {
  initialData?: Partial<EventFormValues> & { schedule?: ScheduleItem[] };
  onSubmit: (data: EventFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export default function EventForm({ initialData, onSubmit, isSubmitting = false, onCancel }: EventFormProps) {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => initialData?.schedule ?? []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormValues>,
    defaultValues: useMemo(() => toInitialFormState(initialData), [initialData]),
  });

  const submitting = isSubmitting || formSubmitting;

  const handleScheduleChange = useCallback((index: number, field: keyof ScheduleItem, value: string) => {
    setScheduleItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addScheduleItem = useCallback(() => {
    setScheduleItems((prev) => [...prev, { day: "", time: "", title: "", description: "" }]);
  }, []);

  const removeScheduleItem = useCallback((index: number) => {
    setScheduleItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleFormSubmit = useCallback(
    (values: EventFormValues) => {
      const payload = buildEventPayload(values, scheduleItems);
      onSubmit(payload);
    },
    [scheduleItems, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Event Name *"
          name="name"
          placeholder="Enter event name"
          error={errors.name}
          register={register}
          fullWidth
        />
        <Select
          label="Event Type *"
          name="type"
          placeholder="Select event type"
          options={EVENT_TYPE_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
          error={errors.type}
          register={register}
          fullWidth
        />
      </div>

      <Select
        label="Category *"
        name="category"
        placeholder="Select category"
        options={CATEGORIES.map((opt) => ({ value: opt, label: opt }))}
        error={errors.category}
        register={register}
        fullWidth
      />

      <Input
        label="Subtitle"
        name="subtitle"
        placeholder="A short tagline under the title"
        error={errors.subtitle}
        register={register}
        fullWidth
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="date"
          label="Start Date *"
          name="startDate"
          icon={Calendar}
          register={register}
          error={errors.startDate}
          fullWidth
        />
        <Input
          label="Start Time"
          name="startTime"
          type="time"
          error={errors.startTime}
          register={register}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="End Date"
          name="endDate"
          type="date"
          error={errors.endDate}
          register={register}
          fullWidth
        />
        <Input
          label="End Time"
          name="endTime"
          type="time"
          error={errors.endTime}
          register={register}
          fullWidth
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2">Venue / Location *</label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            name="venue"
            placeholder="Search for a venue or address"
            error={errors.venue}
            register={register}
            fullWidth
            inputClassName="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Capacity"
          name="capacity"
          type="number"
          placeholder="e.g. 100"
          error={errors.capacity}
          register={register}
          registerOptions={{ valueAsNumber: true }}
          fullWidth
        />
        <Input
          label="Price ($)"
          name="price"
          type="number"
          placeholder="0 = Free"
          error={errors.price}
          register={register}
          registerOptions={{ valueAsNumber: true }}
          fullWidth
        />
        <Select
          label="Status"
          name="status"
          placeholder=""
          options={[
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
          error={errors.status}
          register={register}
          fullWidth
        />
      </div>

      <Input
        label="Cover Image URL"
        name="coverImage"
        placeholder="https://example.com/image.jpg"
        error={errors.coverImage}
        register={register}
        fullWidth
      />

      <Textarea
        label="Event Description"
        name="description"
        placeholder="Provide details about your event..."
        rows={4}
        error={errors.description}
        register={register}
        fullWidth
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-500">Schedule Highlights</label>
          <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addScheduleItem}>Add Item</Button>
        </div>
        {scheduleItems.map((item, i) => (
          <div key={i} className="relative rounded-lg border border-gray-200 bg-gray-50/30 p-4 space-y-3">
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => removeScheduleItem(i)} className="absolute top-3 right-3 hover:!text-red-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Day</label>
                <Input name="day" value={item.day} onChange={(e) => handleScheduleChange(i, "day", e.target.value)} placeholder="e.g. Day 1" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Time</label>
                <Input name="time" value={item.time} onChange={(e) => handleScheduleChange(i, "time", e.target.value)} placeholder="e.g. 09:00 AM" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Title</label>
              <Input name="title" value={item.title} onChange={(e) => handleScheduleChange(i, "title", e.target.value)} placeholder="Session title" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Description</label>
              <Textarea name="description" value={item.description} onChange={(e) => handleScheduleChange(i, "description", e.target.value)} placeholder="Session description" rows={2} />
            </div>
          </div>
        ))}
        {scheduleItems.length === 0 && (
          <p className="text-xs text-gray-400 italic">No schedule items added yet.</p>
        )}
      </div>

      {onCancel && (
        <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={submitting} showTextWhileLoading size="lg">Save Changes</Button>
        </div>
      )}
    </form>
  );
}
