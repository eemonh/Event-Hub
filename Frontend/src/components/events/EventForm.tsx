import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, MapPin, Plus, Trash2 } from "lucide-react";
import type { EventFormData, ScheduleItem } from "../../types";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
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
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">Event Type *</label>
          <div className="relative">
            <select
              {...register("type")}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
            >
              <option value="" disabled>Select event type</option>
              {EVENT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.type ? <p className="mt-1.5 text-sm text-red-500">{errors.type.message}</p> : null}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2">Category *</label>
        <div className="relative">
          <select
            {...register("category")}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        {errors.category ? <p className="mt-1.5 text-sm text-red-500">{errors.category.message}</p> : null}
      </div>

      <Input
        label="Subtitle"
        name="subtitle"
        placeholder="A short tagline under the title"
        error={errors.subtitle}
        register={register}
        fullWidth
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">Start Date *</label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          {errors.startDate ? <p className="mt-1.5 text-sm text-red-500">{errors.startDate.message}</p> : null}
        </div>
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
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">Status</label>
          <div className="relative">
            <select
              {...register("status")}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
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
            <button
              type="button"
              onClick={() => removeScheduleItem(i)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Day</label>
                <input
                  type="text"
                  value={item.day}
                  onChange={(e) => handleScheduleChange(i, "day", e.target.value)}
                  placeholder="e.g. Day 1"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Time</label>
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(i, "time", e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleScheduleChange(i, "title", e.target.value)}
                placeholder="Session title"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => handleScheduleChange(i, "description", e.target.value)}
                rows={2}
                placeholder="Session description"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 transition-all resize-y"
              />
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
          <Button type="submit" loading={submitting} showTextWhileLoading fullWidth size="lg">Save Changes</Button>
        </div>
      )}
    </form>
  );
}
