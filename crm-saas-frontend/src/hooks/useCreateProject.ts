import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import type { Project } from "../types";

const API_URL = "http://localhost:3001/api";

// ─── useCreateProject ───────────────────────────────────────────────────────
// Mutation = operacion de escritura (POST/PUT/PATCH/DELETE). NO va al cache
// de queries, pero PODEMOS invalidar queries relacionadas para que el cache
// quede consistente con el servidor.
//
// Patron classic: onSuccess -> queryClient.invalidateQueries(['projects'])
// Eso marca la lista como stale, TanStack Query la refetchea sola, y la UI
// se actualiza sin que tengamos que tocar useState para nada.

type CreateProjectInput = {
  name: string;
  description?: string;
};

export function useCreateProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: async (input) => {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    // onSuccess corre solo si la mutacion completo OK.
    onSuccess: () => {
      // Invalida el cache de proyectos -> TanStack Query refetchea solo.
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
