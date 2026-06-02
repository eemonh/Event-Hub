const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/auth`;

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

export async function loginUser<T = unknown>(email: string, password: string): Promise<T> {
  return request<T>(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser<T = unknown>(
  name: string,
  email: string,
  password: string,
): Promise<T> {
  return request<T>(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMe<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function logout<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function changePassword<T = unknown>(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<T> {
  return request<T>(`${API_BASE}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function updateProfile<T = unknown>(
  token: string,
  data: Record<string, unknown>,
): Promise<T> {
  return request<T>(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
