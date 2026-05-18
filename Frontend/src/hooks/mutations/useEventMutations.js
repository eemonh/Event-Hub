import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => apiClient(`/events/${eventId}/register`, { method: "POST" }),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}

export function useCancelRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => apiClient(`/events/${eventId}/register`, { method: "DELETE" }),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}

export function useBookmarkEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => apiClient(`/events/${eventId}/bookmark`, { method: "POST" }),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => apiClient(`/events/${eventId}/bookmark`, { method: "DELETE" }),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient("/events", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient(`/events/${id}`, { method: "PUT", body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["all-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient(`/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
