const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = `${API_ORIGIN}/users`;

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

export async function createUser(token, { name, email, password, role }) {
  return request(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function getUsers(token) {
  return request(`${API_BASE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateUserRole(token, id, role) {
  return request(`${API_BASE}/${id}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(token, id) {
  return request(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const getAllUsers = getUsers;


