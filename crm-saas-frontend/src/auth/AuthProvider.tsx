import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState } from "./AuthContext";

// ─── AuthProvider ───────────────────────────────────────────────────────────
// Componente que mete el valor del context en el arbol. Va una sola vez en
// main.tsx, envolviendo a toda la app.

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: la funcion solo corre en el primer render. Sin esto,
  // localStorage.getItem se llamaria en cada render — desperdicio puro.
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  // Si otra pestana actualiza el token, queremos enterarnos. El evento
  // "storage" lo dispara el navegador entre tabs del mismo origen.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
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
  };

  // isAuthenticated es derived state: lo calculamos a partir de token en
  // cada render — nunca lo guardamos en useState propio.
  const value: AuthState = {
    token,
    isAuthenticated: token !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
