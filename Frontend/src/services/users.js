const API_BASE = "/api/users";

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
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


