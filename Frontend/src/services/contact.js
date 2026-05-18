const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/contact`;

export async function submitContact({ name, email, subject, message }) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message }),
  });
  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid JSON response from ${res.status} ${res.statusText}: ${text}`);
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
