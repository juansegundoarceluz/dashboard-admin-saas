import type { Project } from "../../types";

// ─── ProjectsTable ──────────────────────────────────────────────────────────
// Tabla de proyectos. Maneja sus 4 estados de UI:
//   - loading: estamos pidiendo datos
//   - error:   algo falló
//   - empty:   pedimos OK pero no hay datos
//   - success: hay datos, los mostramos
// "State-based rendering" es la práctica de pensar en TODOS los estados
// posibles, no solo el "happy path".

type ProjectsTableProps = {
  projects: Project[];
  loading: boolean;
  error: string | null;
};

const COLUMNS = ["Nombre", "Descripción", "Fecha", "Tareas"] as const;

export default function ProjectsTable({ projects, loading, error }: ProjectsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-6 py-5">
        <h2 className="m-0 text-base font-semibold">Proyectos</h2>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line">
            {COLUMNS.map((h) => (
              <th
                key={h}
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
              <td colSpan={COLUMNS.length} className="px-6 py-6 text-center text-sm text-muted">
                Cargando proyectos...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-6 py-6 text-center text-sm text-danger">
                {error}
              </td>
            </tr>
          ) : projects.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-6 py-6 text-center text-sm text-muted">
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
                <td className="px-6 py-3.5 text-sm font-medium">{project.name}</td>
                <td className="px-6 py-3.5 text-sm text-subtle">
                  {project.description || "Sin descripción"}
                </td>
                <td className="px-6 py-3.5 text-[13px] text-muted">
                  {new Date(project.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="px-6 py-3.5 text-sm font-semibold text-success">
                  {project.tasks.length} {project.tasks.length === 1 ? "tarea" : "tareas"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
