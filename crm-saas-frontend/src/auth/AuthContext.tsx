import { createContext } from "react";

// ─── AuthContext ────────────────────────────────────────────────────────────
// Este archivo SOLO exporta el context y sus tipos. Nada de componentes,
// nada de hooks. Es la forma de dejar contento al plugin react-refresh:
// "un archivo, una clase de export".
//
// El AuthProvider (componente) vive en AuthProvider.tsx
// El useAuth (hook) vive en useAuth.ts
// Los tres importan AuthState/AuthContext de aca.

export type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  /** Guarda el token, lo persiste y notifica a los consumidores. */
  login: (token: string) => void;
  /** Borra el token y notifica. */
  logout: () => void;
};

// El default `undefined` es a proposito: si alguien usa useAuth fuera del
// provider, queremos que falle con un error claro, no con datos basura.
export const AuthContext = createContext<AuthState | undefined>(undefined);
