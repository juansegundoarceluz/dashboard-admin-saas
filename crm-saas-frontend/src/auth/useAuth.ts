import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState } from "./AuthContext";

// ─── useAuth ────────────────────────────────────────────────────────────────
// Custom hook: la unica manera "oficial" de consumir el AuthContext.
// Esconde los detalles (que se llama useContext, que context, etc.) y agrega
// validacion. Si alguien lo usa fuera del provider, lanza un error claro
// en vez de devolver undefined y romper mas adelante con un mensaje confuso.

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
