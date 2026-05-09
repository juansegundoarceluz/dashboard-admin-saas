import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { apiFetch } from "../lib/apiClient";
import type { Project } from "../types";

// useProjects ahora usa apiFetch -> 401 dispara handler global.
export function useProjects() {
  const { token } = useAuth();

  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async ({ signal }) => {
      const res = await apiFetch("/projects", { token, signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    enabled: token !== null,
  });
}
