const API_BASE = "/api/events";

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getEvents(token, query = {}) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", query.page);
  if (query.limit) params.set("limit", query.limit);
  const qs = params.toString();
  return request(`${API_BASE}${qs ? `?${qs}` : ""}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getEvent(id) {
  return request(`${API_BASE}/${id}`);
}

export async function getMyEvents(token) {
  return request(`${API_BASE}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getSavedEvents(token) {
  return request(`${API_BASE}/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRecommendedEvents(token) {
  return request(`${API_BASE}/recommended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createEvent(token, data) {
  return request(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateEvent(token, id, data) {
  return request(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(token, id) {
  return request(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function registerForEvent(token, id) {
  return request(`${API_BASE}/${id}/register`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function cancelRegistration(token, id) {
  return request(`${API_BASE}/${id}/register`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function bookmarkEvent(token, id) {
  return request(`${API_BASE}/${id}/bookmark`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function removeBookmark(token, id) {
  return request(`${API_BASE}/${id}/bookmark`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAdminStats(token) {
  return request(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAllEvents(token, query = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", query.page);
  if (query.limit) params.set("limit", query.limit);
  const qs = params.toString();
  return request(`${API_BASE}/all${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
