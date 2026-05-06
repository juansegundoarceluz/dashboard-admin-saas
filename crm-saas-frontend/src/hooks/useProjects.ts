import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import type { Project } from "../types";

import { env } from "../lib/env";

// ─── useProjects ────────────────────────────────────────────────────────────
// Custom hook: encapsula el "como traer proyectos del backend". El consumidor
// no se entera de fetch, AbortController, retries, ni cache. Solo recibe
// { data, isLoading, error } y renderea.
//
// Conceptos clave que cubre TanStack Query:
//   - queryKey: ID unico del cache. Si dos componentes piden ['projects'],
//     comparten cache y solo se hace UN request (request deduplication).
//   - queryFn: la funcion que trae los datos. Recibe { signal } para abortar
//     automaticamente si el componente desmonta o cambia el queryKey.
//   - enabled: condicion para correr la query. Si no hay token, no pidas.

export function useProjects() {
  const { token } = useAuth();

  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async ({ signal }) => {
      const res = await fetch(`${env.API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    enabled: token !== null,
  });
}
