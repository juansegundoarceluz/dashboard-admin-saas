import { useState } from "react";
import type { Project } from "../../types";
import { useDeleteProject } from "../../hooks/useDeleteProject";
import ConfirmDialog from "./ConfirmDialog";

// ─── ProjectsTable ──────────────────────────────────────────────────────────
// Tabla de proyectos. Maneja sus 4 estados de UI:
//   - loading: estamos pidiendo datos
//   - error:   algo falló
//   - empty:   pedimos OK pero no hay datos
//   - success: hay datos, los mostramos
// "State-based rendering" es la práctica de pensar en TODOS los estados
// posibles, no solo el "happy path".
//
// Ahora también orquesta el flujo de borrado:
//   1) usuario clickea el ícono de basura -> guardamos el proyecto en estado
//      local (toDelete) y abrimos ConfirmDialog.
//   2) Cancel -> limpiamos toDelete, modal se cierra.
//   3) Confirm -> mutate(id). El hook useDeleteProject invalida ['projects']
//      en onSuccess, así que la fila desaparece sola del cache.
//
// Por qué guardamos el proyecto y no solo el id: para mostrar el nombre en
// el mensaje del modal ("Vas a borrar 'X'"). Mejor UX que un id pelado.

type ProjectsTableProps = {
  projects: Project[];
  loading: boolean;
  error: string | null;
  /** True cuando hay datos en cache pero TanStack Query está revalidando. */
  isFetching?: boolean;
};

const COLUMNS = ["Nombre", "Descripción", "Fecha", "Tareas", ""] as const;

export default function ProjectsTable({
  projects,
  loading,
  error,
  isFetching = false,
}: ProjectsTableProps) {
  // Proyecto pendiente de confirmacion. null = modal cerrado.
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const { mutate: deleteProject, isPending } = useDeleteProject();

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteProject(toDelete.id, {
      // Cerramos solo si la mutation tuvo exito. Si falla, el modal queda
      // abierto y el usuario puede ver el error / reintentar / cancelar.
      onSuccess: () => setToDelete(null),
    });
  };

  // Solo mostramos el indicador "actualizando..." cuando ya tenemos datos
  // pero estamos revalidando en background. Si no hay datos todavia, ya
  // estamos mostrando el estado loading principal.
  const showRefetchingIndicator = isFetching && !loading;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="m-0 text-base font-semibold">Proyectos</h2>
          {showRefetchingIndicator && (
            <span
              className="flex items-center gap-1.5 text-xs text-muted"
              role="status"
              aria-live="polite"
            >
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand"
                aria-hidden="true"
              />
              actualizando...
            </span>
          )}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((h, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-6 text-center text-sm text-muted"
                >
                  Cargando proyectos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-6 text-center text-sm text-danger"
                >
                  {error}
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-6 text-center text-sm text-muted"
                >
                  No hay proyectos todavía. Creá tu primer proyecto.
                </td>
              </tr>
            ) : (
              projects.map((project, i) => (
                <tr
                  key={project.id}
                  className={`transition-colors hover:bg-white/[0.02] ${
                    i < projects.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <td className="px-6 py-3.5 text-sm font-medium">
                    {project.name}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-subtle">
                    {project.description || "Sin descripción"}
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-muted">
                    {new Date(project.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-success">
                    {project.tasks.length}{" "}
                    {project.tasks.length === 1 ? "tarea" : "tareas"}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setToDelete(project)}
                      // Deshabilitamos durante el borrado para evitar dobles
                      // clicks, pero solo el de la fila que se esta borrando.
                      disabled={isPending && toDelete?.id === project.id}
                      aria-label={`Eliminar proyecto ${project.name}`}
                      title="Eliminar proyecto"
                      className="rounded p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Icono de basura inline (sin libreria). */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar proyecto"
        message={
          toDelete
            ? `¿Estás seguro de eliminar "${toDelete.name}"? Esta acción no se puede deshacer y se borrarán también todas sus tareas.`
            : ""
        }
        confirmLabel="Eliminar"
        destructive
        isPending={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
