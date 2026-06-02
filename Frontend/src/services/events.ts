const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/events`;

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: T;

  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(
      `Invalid JSON response from ${res.status} ${res.statusText}: ${text}`,
    );
  }

  if (!res.ok) {
    const err = data as { message?: string };
    throw new Error(err.message ?? "Request failed");
  }
  return data;
}

export interface EventQuery {
  category?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}

export async function getEvents<T = unknown>(token: string | null, query: EventQuery = {}): Promise<T> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return request<T>(`${API_BASE}${qs ? `?${qs}` : ""}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getEvent<T = unknown>(id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}`);
}

export async function getMyEvents<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getSavedEvents<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRecommendedEvents<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}/recommended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createEvent<T = unknown>(
  token: string,
  data: Record<string, unknown>,
): Promise<T> {
  return request<T>(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateEvent<T = unknown>(
  token: string,
  id: string,
  data: Record<string, unknown>,
): Promise<T> {
  return request<T>(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent<T = unknown>(token: string, id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function registerForEvent<T = unknown>(token: string, id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}/register`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function cancelRegistration<T = unknown>(token: string, id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}/register`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function bookmarkEvent<T = unknown>(token: string, id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}/bookmark`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function removeBookmark<T = unknown>(token: string, id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}/bookmark`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAdminStats<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface AllEventsQuery {
  page?: number | string;
  limit?: number | string;
}

export async function getAllEvents<T = unknown>(
  token: string,
  query: AllEventsQuery = {},
): Promise<T> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return request<T>(`${API_BASE}/all${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
