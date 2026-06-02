const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/contact`;

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContact<T = unknown>(data: ContactData): Promise<T> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  let parsed: T;

  try {
    parsed = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(
      `Invalid JSON response from ${res.status} ${res.statusText}: ${text}`,
    );
  }

  if (!res.ok) {
    const err = parsed as { message?: string };
    throw new Error(err.message ?? "Request failed");
  }
  return parsed;
}
