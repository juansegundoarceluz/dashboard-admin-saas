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
//
// ─── Optimistic update ──────────────────────────────────────────────────────
// La version "naive" tiene un problema de UX: el usuario clickea "Crear",
// esperamos al server, y RECIEN ahi aparece la fila. En conexiones lentas
// se siente laggy.
//
// Optimistic update = pintamos el resultado en la UI ANTES de que el server
// confirme. Si el server falla, revertimos.
//
// Los 4 callbacks de useMutation, en orden:
//   onMutate  -> ANTES del request. Aca es donde escribimos el optimistic.
//                Devolvemos un "context" (snapshot del cache previo) para
//                poder revertir despues.
//   onError   -> el server fallo. Usamos el context para hacer rollback.
//   onSuccess -> el server confirmo. Podemos hacer cosas extra.
//   onSettled -> SIEMPRE corre al final, exito o error. Es el lugar correcto
//                para invalidate, asi nos sincronizamos con el server real
//                (el id temporal pasa a ser el id real, createdAt real, etc).

type CreateProjectInput = {
  name: string;
  description?: string;
};

// Lo que onMutate devuelve y onError recibe. Le damos un tipo explicito
// para no caer en `any` por defecto.
type MutationContext = {
  previousProjects: Project[] | undefined;
  optimisticId: string;
};

export function useCreateProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput, MutationContext>({
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

    // 1) onMutate corre antes del fetch. Aca es donde "mentimos" al cache.
    onMutate: async (input) => {
      // Cancelamos cualquier refetch en curso de ['projects']. Si no, podria
      // venir una respuesta vieja DESPUES de nuestro update y pisarlo.
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot del estado actual. Si la mutation falla, lo restauramos.
      const previousProjects = queryClient.getQueryData<Project[]>([
        "projects",
      ]);

      // Id temporal con prefijo para distinguirlo del cuid real del server.
      // Cuando onSettled invalide y vuelva a fetchear, esta fila optimista
      // sera reemplazada por la real.
      const optimisticId = `optimistic-${Date.now()}`;

      const optimisticProject: Project = {
        id: optimisticId,
        name: input.name,
        description: input.description ?? null,
        createdAt: new Date().toISOString(),
        userId: "", // no lo sabemos del lado cliente; el server lo asigna
        tasks: [],
      };

      // Escribimos el cache optimista. setQueryData es sincrono.
      queryClient.setQueryData<Project[]>(["projects"], (old = []) => [
        ...old,
        optimisticProject,
      ]);

      // Lo que devolvemos aca llega a onError/onSettled como `context`.
      return { previousProjects, optimisticId };
    },

    // 2) onError corre solo si el fetch fallo. Rollback con el snapshot.
    onError: (_err, _input, context) => {
      if (context?.previousProjects !== undefined) {
        queryClient.setQueryData(["projects"], context.previousProjects);
      }
    },

    // 3) onSettled corre SIEMPRE al final. Refetch para sincronizar con la
    //    realidad del server (el id real, createdAt real, etc). Si hubo
    //    error y ya hicimos rollback, este invalidate igual nos asegura
    //    consistencia con cualquier cambio que haya pasado en el medio.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
