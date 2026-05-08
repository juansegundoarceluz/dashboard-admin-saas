import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { env } from "../lib/env";
import type { Project } from "../types";
import type { CreateProjectInput } from "../schemas/project";

// ─── useCreateProject ───────────────────────────────────────────────────────
// CreateProjectInput viene del schema. Si manana cambian las reglas (ej.
// se agrega un campo "color"), lo cambiamos en el schema y aca se actualiza
// solo, sin tocar nada. Eso es single source of truth bien aplicado.

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
