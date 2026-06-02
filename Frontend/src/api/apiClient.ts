const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

type TokenGetter = () => string | null;
type OnRefreshFailed = () => void;

let getToken: TokenGetter = () => null;
let onRefreshFailed: OnRefreshFailed = () => {};
let refreshPromise: Promise<string | null> | null = null;

export function configureAuth(tokenGetter: TokenGetter, onFailed: OnRefreshFailed): void {
  getToken = tokenGetter;
  onRefreshFailed = onFailed;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/refresh/access`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json() as { token: string };
    return data.token;
  } catch {
    return null;
  }
}

export interface ApiClientOptions {
  body?: unknown;
  method?: string;
  headers?: Record<string, string>;
  noAuth?: boolean;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, method, headers: extraHeaders, noAuth } = options;
  const headers: Record<string, string> = { ...extraHeaders };

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
    method: method ?? "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (res.status === 401 && !noAuth) {
    refreshPromise = refreshPromise ?? refreshAccessToken();
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        method: method ?? "GET",
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
