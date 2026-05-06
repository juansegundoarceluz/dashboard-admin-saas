import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { env } from "../lib/env";
import type { Project } from "../types";

// ─── useCreateProject ───────────────────────────────────────────────────────
// Mutation para crear un proyecto. Patron classic:
//   - mutationFn: hace el HTTP request.
//   - onSuccess:  invalida ['projects']. TanStack Query refetchea sola.
//
// El consumidor recibe { mutate, isPending, error, reset, ... } y solo
// llama mutate({ name, description }).

type CreateProjectInput = {
  name: string;
  description?: string;
};

export function useCreateProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: async (input) => {
      const res = await fetch(`${env.API_URL}/projects`, {
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
    // Cuando la mutation termina con exito, marcamos ['projects'] como stale.
    // TanStack Query refetchea automaticamente y la UI se actualiza sola.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
