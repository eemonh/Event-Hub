/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../services/auth";

const AUTH_KEY = "eventhub_auth";
const AuthContext = createContext(null);

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

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = loadAuth();
    return {
      user: saved?.user ?? null,
      token: saved?.token ?? null,
    };
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.token) {
      getMe(state.token)
        .then((data) => {
          setState((prev) => ({ ...prev, user: data.user }));
        })
        .catch(() => {
          setState({ user: null, token: null });
          saveAuth(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginUser(email, password);
    setState({ user: result.user, token: result.token });
    saveAuth(result);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const result = await registerUser(name, email, password);
    setState({ user: result.user, token: result.token });
    saveAuth(result);
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null });
    saveAuth(null);
  }, []);

  const isAuthenticated = state.user !== null && state.token !== null;

  return (
    <AuthContext.Provider value={{ user: state.user, token: state.token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
