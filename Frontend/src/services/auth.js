const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/auth`;

async function request(url, options = {}) {
  const res = await fetch(url, options);
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

export async function loginUser(email, password) {
  return request(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name, email, password) {
  return request(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMe(token) {
  return request(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function logout(token) {
  return request(`${API_BASE}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function changePassword(token, currentPassword, newPassword) {
  return request(`${API_BASE}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function updateProfile(token, data) {
  return request(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
