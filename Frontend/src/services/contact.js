const API_BASE = "/api/contact";

export async function submitContact({ name, email, subject, message }) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message }),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    throw new Error(`Invalid JSON response: ${text}`);
  }
  if (!res.ok) throw new Error(data.message);
  return data;
}
