const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/users`;

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

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function createUser<T = unknown>(
  token: string,
  { name, email, password, role }: CreateUserData,
): Promise<T> {
  return request<T>(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function getUsers<T = unknown>(token: string): Promise<T> {
  return request<T>(`${API_BASE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateUserRole<T = unknown>(
  token: string,
  id: string,
  role: string,
): Promise<T> {
  return request<T>(`${API_BASE}/${id}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser<T = unknown>(token: string, id: string): Promise<T> {
  return request<T>(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const getAllUsers = getUsers;
