import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import type { AuthState } from "./AuthContext";
import { setUnauthorizedHandler } from "../lib/apiClient";

// ─── AuthProvider ───────────────────────────────────────────────────────────
// 1) Mantiene token en state + localStorage.
// 2) Sincroniza entre tabs (storage event).
// 3) Registra el handler global de 401 -> logout automatico.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    // Limpiamos el cache para que un proximo user no vea data del anterior.
    queryClient.clear();
  };

  // Registramos el callback que apiClient llama al detectar 401.
  // logout() pone token a null -> ProtectedRoute redirige a /login solo.
  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    return () => setUnauthorizedHandler(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthState = {
    token,
    isAuthenticated: token !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
