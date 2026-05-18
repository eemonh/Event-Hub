import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { configureAuth, apiClient } from "../api/apiClient";

const AUTH_KEY = "eventhub_auth";
const AuthContext = createContext(null);

function loadAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.user && parsed.token) return parsed;
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
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(() => loadAuth());
  const [token, setToken] = useState(() => saved?.token ?? null);

  const getToken = useCallback(() => token, [token]);

  const handleRefreshFailed = useCallback(() => {
    setToken(null);
    setSaved(null);
    saveAuth(null);
    queryClient.clear();
  }, [queryClient]);

  configureAuth(getToken, handleRefreshFailed);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => apiClient("/auth/me"),
    enabled: !!token,
    staleTime: 60 * 1000,
    retry: false,
    meta: { noAuthRedirect: false },
  });

  const user = userData?.user ?? saved?.user ?? null;

  const login = useCallback(async (email, password) => {
    const result = await apiClient("/auth/login", { method: "POST", body: { email, password }, noAuth: true });
    setToken(result.token);
    setSaved({ user: result.user, token: result.token });
    saveAuth({ user: result.user, token: result.token });
    queryClient.setQueryData(["auth-user"], result);
    queryClient.invalidateQueries({ queryKey: ["events"] });
  }, [queryClient]);

  const register = useCallback(async (name, email, password) => {
    const result = await apiClient("/auth/register", { method: "POST", body: { name, email, password }, noAuth: true });
    setToken(result.token);
    setSaved({ user: result.user, token: result.token });
    saveAuth({ user: result.user, token: result.token });
    queryClient.setQueryData(["auth-user"], result);
    queryClient.invalidateQueries({ queryKey: ["events"] });
  }, [queryClient]);

  const logout = useCallback(() => {
    if (token) {
      apiClient("/auth/logout", { method: "POST" }).catch(() => {});
    }
    setToken(null);
    setSaved(null);
    saveAuth(null);
    queryClient.setQueryData(["auth-user"], null);
  }, [token, queryClient]);

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  }), [user, token, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
