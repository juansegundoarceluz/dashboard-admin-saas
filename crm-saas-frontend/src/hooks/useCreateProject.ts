import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { apiFetch } from "../lib/apiClient";
import type { Project } from "../types";
import type { CreateProjectInput } from "../schemas/project";

export function useCreateProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: async (input) => {
      const res = await apiFetch("/projects", {
        method: "POST",
        token,
        json: input,
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
