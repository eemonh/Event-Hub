import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type {
  CommentsResponse,
  EventResponse,
  EventsResponse,
} from "../../types";

export interface EventFilters {
  category?: string;
  search?: string;
  sort?: string;
  dateFilter?: string;
  page?: number;
  limit?: number;
}

export function useEvents(filters: EventFilters = {}) {
  const { category, search, sort, dateFilter, page = 1, limit = 6 } = filters;
  return useQuery({
    queryKey: ["events", { category, search, sort, dateFilter, page, limit }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      if (dateFilter) params.set("dateFilter", dateFilter);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      const qs = params.toString();
      return apiClient<EventsResponse>(`/events${qs ? `?${qs}` : ""}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => apiClient<EventResponse>(`/events/${id}`),
    enabled: !!id,
  });
}

export function useMyEvents() {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: () => apiClient<Pick<EventsResponse, "events">>("/events/my"),
    staleTime: 15 * 1000,
  });
}

export function useSavedEvents() {
  return useQuery({
    queryKey: ["saved-events"],
    queryFn: () => apiClient<Pick<EventsResponse, "events">>("/events/saved"),
    staleTime: 15 * 1000,
  });
}

export function useRecommendedEvents(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["recommended-events"],
    queryFn: () => apiClient<Pick<EventsResponse, "events">>("/events/recommended"),
    staleTime: 300 * 1000,
    ...options,
  });
}

export function useAllEvents(filters: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 20 } = filters;
  return useQuery({
    queryKey: ["all-events", { page, limit }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      return apiClient<EventsResponse>(`/events/all?${params.toString()}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useComments(eventId: string | undefined) {
  return useQuery({
    queryKey: ["comments", eventId],
    queryFn: () => apiClient<CommentsResponse>(`/events/${eventId}/comments`),
    enabled: !!eventId,
    staleTime: 10 * 1000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient<{ totalEvents: number; totalRegistrations: number }>("/events/admin/stats"),
    staleTime: 30 * 1000,
  });
}
