const API_BASE = "https://event-hub-90p3.onrender.com/api";

let getToken = () => null;
let onRefreshFailed = () => {};
let refreshPromise = null;

export function configureAuth(tokenGetter, onFailed) {
  getToken = tokenGetter;
  onRefreshFailed = onFailed;
}

async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE}/refresh/access`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json();
    return data.token;
  } catch {
    return null;
  }
}

export async function apiClient(endpoint, options = {}) {
  const { body, method, headers: extraHeaders, noAuth } = options;
  const headers = { ...extraHeaders };

  if (!noAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    method: method || "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (res.status === 401 && !noAuth) {
    refreshPromise = refreshPromise || refreshAccessToken();
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: method || "GET",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });
    } else {
      onRefreshFailed();
      throw new Error("Session expired. Please log in again.");
    }
  }

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid JSON response: ${text}`);
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
