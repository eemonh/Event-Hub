import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export function useEvents(filters = {}) {
  const { category, search, sort, dateFilter, page = 1, limit = 6 } = filters;
  return useQuery({
    queryKey: ["events", { category, search, sort, dateFilter, page, limit }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      if (dateFilter) params.set("dateFilter", dateFilter);
      if (page) params.set("page", page);
      if (limit) params.set("limit", limit);
      const qs = params.toString();
      return apiClient(`/events${qs ? `?${qs}` : ""}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useEvent(id) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => apiClient(`/events/${id}`),
    enabled: !!id,
  });
}

export function useMyEvents() {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: () => apiClient("/events/my"),
    staleTime: 15 * 1000,
  });
}

export function useSavedEvents() {
  return useQuery({
    queryKey: ["saved-events"],
    queryFn: () => apiClient("/events/saved"),
    staleTime: 15 * 1000,
  });
}

export function useRecommendedEvents() {
  return useQuery({
    queryKey: ["recommended-events"],
    queryFn: () => apiClient("/events/recommended"),
    staleTime: 300 * 1000,
  });
}

export function useAllEvents(filters = {}) {
  const { page = 1, limit = 20 } = filters;
  return useQuery({
    queryKey: ["all-events", { page, limit }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (page) params.set("page", page);
      if (limit) params.set("limit", limit);
      return apiClient(`/events/all?${params.toString()}`);
    },
    placeholderData: (prev) => prev,
  });
}

export function useComments(eventId) {
  return useQuery({
    queryKey: ["comments", eventId],
    queryFn: () => apiClient(`/events/${eventId}/comments`),
    enabled: !!eventId,
    staleTime: 10 * 1000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient("/events/admin/stats"),
    staleTime: 30 * 1000,
  });
}
