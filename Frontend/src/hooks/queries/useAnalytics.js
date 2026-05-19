import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => apiClient("/analytics/overview"),
    staleTime: 30 * 1000,
  });
}

export function useRegistrationTrends(range = 30) {
  return useQuery({
    queryKey: ["analytics", "registration-trends", range],
    queryFn: () => apiClient(`/analytics/registration-trends?range=${range}`),
    staleTime: 30 * 1000,
  });
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ["analytics", "category-breakdown"],
    queryFn: () => apiClient("/analytics/category-breakdown"),
    staleTime: 60 * 1000,
  });
}

export function useEventPerformance(filters = {}) {
  const { page = 1, limit = 10, sort = "registrations" } = filters;
  return useQuery({
    queryKey: ["analytics", "event-performance", { page, limit, sort }],
    queryFn: () => apiClient(`/analytics/event-performance?page=${page}&limit=${limit}&sort=${sort}`),
    placeholderData: (prev) => prev,
  });
}

export function useUserGrowth(range = 30) {
  return useQuery({
    queryKey: ["analytics", "user-growth", range],
    queryFn: () => apiClient(`/analytics/user-growth?range=${range}`),
    staleTime: 30 * 1000,
  });
}

export function useTopEvents(limit = 5) {
  return useQuery({
    queryKey: ["analytics", "top-events", limit],
    queryFn: () => apiClient(`/analytics/top-events?limit=${limit}`),
    staleTime: 30 * 1000,
  });
}
