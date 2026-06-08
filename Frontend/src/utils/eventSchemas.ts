import { z } from "zod";
import type { EventFormData, ScheduleItem } from "../../types";

export const EVENT_TYPE_OPTIONS = [
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Networking",
  "Concert",
  "Exhibition",
  "Festival",
  "Other",
] as const satisfies string[];

export const CATEGORY_OPTIONS = [
  "Technology",
  "Design",
  "Business",
  "Startup",
  "Music",
  "Arts",
  "Health",
  "Sports",
  "Education",
  "Food & Drink",
  "Networking",
  "Other",
] as const satisfies string[];

export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  type: z.string().min(1, "Event type is required"),
  category: z.string().min(1, "Category is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  coverImage: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").optional(),
  price: z.coerce.number().min(0, "Price cannot be negative").optional(),
  status: z.enum(["published", "draft", "cancelled"]),
  subtitle: z.string().optional(),
  schedule: z.array(
    z.object({
      day: z.string().optional(),
      time: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
  ).optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultFormValues: EventFormValues = {
  name: "",
  type: "",
  category: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  venue: "",
  coverImage: "",
  description: "",
  capacity: undefined,
  price: undefined,
  status: "published",
  subtitle: "",
  schedule: [],
};

export function buildEventPayload(values: EventFormValues, schedule: ScheduleItem[]): EventFormData {
  return {
    name: values.name,
    type: values.type,
    category: values.category,
    startDate: values.startDate,
    endDate: values.endDate?.length ? values.endDate : values.startDate,
    startTime: values.startTime,
    endTime: values.endTime,
    venue: values.venue,
    coverImage: values.coverImage,
    description: values.description,
    capacity: typeof values.capacity === "number" ? values.capacity : 100,
    price: typeof values.price === "number" ? values.price : 0,
    status: values.status,
    subtitle: values.subtitle,
    schedule,
  };
}

export function toInitialFormState(data?: Partial<EventFormValues> & { schedule?: ScheduleItem[] }): EventFormValues {
  if (!data) {
    return { ...defaultFormValues };
  }
  return {
    name: data.name ?? "",
    type: data.type ?? "",
    category: data.category ?? "",
    startDate: data.startDate ?? "",
    startTime: data.startTime ?? "",
    endDate: data.endDate ?? "",
    endTime: data.endTime ?? "",
    venue: data.venue ?? "",
    coverImage: data.coverImage ?? "",
    description: data.description ?? "",
    capacity: data.capacity,
    price: data.price,
    status: data.status ?? "published",
    subtitle: data.subtitle ?? "",
    schedule: data.schedule ?? [],
  };
}
