const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const USERS_KEY = "eventhub_users";

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function loginUser(email, password) {
  await delay(1500);
  const users = getStoredUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  const token = btoa(`${user.email}:${Date.now()}`);
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function registerUser(name, email, password) {
  await delay(1500);
  const users = getStoredUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const newUser = { id: crypto.randomUUID(), name, email, password };
  saveUser(newUser);
  const token = btoa(`${email}:${Date.now()}`);
  return { user: { id: newUser.id, name, email }, token };
}
