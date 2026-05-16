import { useState, useCallback } from "react";
import { loginUser, registerUser } from "../services/auth";
import { AuthContext } from "./authContextValue";

const AUTH_KEY = "eventhub_auth";

function loadAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.user && parsed.token) {
        return parsed;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function saveAuth(data) {
  if (data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

function initializeAuth() {
  const saved = loadAuth();
  return {
    user: saved?.user ?? null,
    token: saved?.token ?? null,
  };
}

export function AuthProvider({ children }) {
  const [{ user, token }, setAuthState] = useState(initializeAuth);
  const [isLoading] = useState(false);

  const setUser = useCallback((user) => setAuthState((prev) => ({ ...prev, user })), []);
  const setToken = useCallback((token) => setAuthState((prev) => ({ ...prev, token })), []);

  const login = useCallback(async (email, password) => {
    const result = await loginUser(email, password);
    setUser(result.user);
    setToken(result.token);
    saveAuth(result);
  }, [setUser, setToken]);

  const register = useCallback(async (name, email, password) => {
    const result = await registerUser(name, email, password);
    setUser(result.user);
    setToken(result.token);
    saveAuth(result);
  }, [setUser, setToken]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    saveAuth(null);
  }, [setUser, setToken]);

  const isAuthenticated = user !== null && token !== null;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
