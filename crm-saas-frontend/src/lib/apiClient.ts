import { env } from "./env";

// ─── apiClient ──────────────────────────────────────────────────────────────
// Wrapper centralizado de fetch. Maneja:
//   1) base URL (no repetir env.API_URL en todos lados).
//   2) Authorization header (cuando se pasa token).
//   3) Content-Type JSON por default.
//   4) Deteccion de 401 -> dispara el handler global registrado.
//
// Patron "registered handler": el AuthProvider se registra al montar.
// Cuando llega 401, llamamos al handler, NO navegamos desde aca. Esto
// mantiene la separation of concerns: apiClient sabe de HTTP, AuthProvider
// sabe de auth state.

// ─── Estado del modulo (singleton) ──────────────────────────────────────────
// Una variable a nivel modulo: hay UNA sola, compartida en toda la app.
// AuthProvider la setea al montar y la limpia al desmontar.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(cb: (() => void) | null) {
  onUnauthorized = cb;
}

// ─── Tipo de las opciones ───────────────────────────────────────────────────
// Extendemos RequestInit (la interfaz nativa de fetch) agregando token.
type ApiFetchOptions = Omit<RequestInit, "body"> & {
  token?: string | null;
  // body como objeto JS — apiFetch lo serializa solo
  json?: unknown;
};

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

// ─── apiFetch ───────────────────────────────────────────────────────────────
// Reemplaza a fetch en hooks que llaman a /api/.
// Uso: apiFetch("/projects", { token, signal })
//      apiFetch("/projects", { method: "POST", token, json: { name } })
export async function apiFetch(
  path: string,
  { token, json, headers, ...rest }: ApiFetchOptions = {},
): Promise<Response> {
  const res = await fetch(`${env.API_URL}${path}`, {
    ...rest,
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  // Si el backend dice 401, asumimos que el token expiro o es invalido.
  // Notificamos al AuthProvider y tiramos un error tipado para que el
  // hook (TanStack Query) marque la query como fallida.
  if (res.status === 401) {
    onUnauthorized?.();
    throw new UnauthorizedError();
  }

  return res;
}
