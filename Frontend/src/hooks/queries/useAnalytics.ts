import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type {
  AnalyticsOverview,
  CategoryBreakdownResponse,
  EventPerformanceResponse,
  RegistrationTrend,
  TopEvent,
  UserGrowth,
} from "../../types";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => apiClient<AnalyticsOverview>("/analytics/overview"),
    staleTime: 30 * 1000,
  });
}

export function useRegistrationTrends(range = 30) {
  return useQuery({
    queryKey: ["analytics", "registration-trends", range],
    queryFn: () =>
      apiClient<{ data: RegistrationTrend[] }>(
        `/analytics/registration-trends?range=${range}`,
      ),
    staleTime: 30 * 1000,
  });
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ["analytics", "category-breakdown"],
    queryFn: () => apiClient<CategoryBreakdownResponse>("/analytics/category-breakdown"),
    staleTime: 60 * 1000,
  });
}

export function useEventPerformance(
  filters: { page?: number; limit?: number; sort?: string } = {},
) {
  const { page = 1, limit = 10, sort = "registrations" } = filters;
  return useQuery({
    queryKey: ["analytics", "event-performance", { page, limit, sort }],
    queryFn: () =>
      apiClient<EventPerformanceResponse>(
        `/analytics/event-performance?page=${page}&limit=${limit}&sort=${sort}`,
      ),
    placeholderData: (prev) => prev,
  });
}

export function useUserGrowth(range = 30) {
  return useQuery({
    queryKey: ["analytics", "user-growth", range],
    queryFn: () =>
      apiClient<{ data: UserGrowth[] }>(`/analytics/user-growth?range=${range}`),
    staleTime: 30 * 1000,
  });
}

export function useTopEvents(limit = 5) {
  return useQuery({
    queryKey: ["analytics", "top-events", limit],
    queryFn: () => apiClient<{ events: TopEvent[] }>(`/analytics/top-events?limit=${limit}`),
    staleTime: 30 * 1000,
  });
}
