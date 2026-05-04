import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";

const API_URL = "http://localhost:3001/api";

// ─── useDeleteProject ───────────────────────────────────────────────────────
// Mutation para borrar un proyecto. Mismo patron que useCreateProject:
//   mutationFn -> hace el HTTP request
//   onSuccess  -> invalida ['projects'] y TanStack Query refetchea sola
//
// El backend devuelve 204 No Content en exito, asi que NO hacemos res.json()
// (rompe parseando vacio). Solo chequeamos res.ok.
//
// Tipos del useMutation: <TData, TError, TVariables>
//   TData      = void   (no devolvemos nada en exito)
//   TError     = Error
//   TVariables = string (el id del proyecto a borrar)

export function useDeleteProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (projectId) => {
      const res = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Si el server devolvio JSON con error, lo usamos. Si no, fallback.
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      // 204 No Content -> no hay body que parsear.
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
