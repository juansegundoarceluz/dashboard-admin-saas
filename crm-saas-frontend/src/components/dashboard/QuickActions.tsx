import type { QuickAction } from "../../types";

// ─── QuickActions ───────────────────────────────────────────────────────────
// Lista de botones de acción rápida. Cada acción puede tener un onClick
// específico, pero por ahora dispara un único callback con el label.
// Patrón: el componente NO sabe qué hacen las acciones — solo notifica al
// padre cuál fue clickeada. "Single responsibility": yo dibujo botones,
// vos decidís qué hacen.

type QuickActionsProps = {
  actions: QuickAction[];
  onAction: (label: string) => void;
};

export default function QuickActions({ actions, onAction }: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-6 py-5">
      <h2 className="m-0 mb-4 text-base font-semibold">Acciones rápidas</h2>

      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action.label)}
            className="rounded-[10px] border px-4 py-2.5 text-left text-[13px] font-medium transition-colors"
            // El color es dinámico: viene en runtime, así que va inline.
            style={{
              borderColor: `${action.color}44`,
              background: `${action.color}11`,
              color: action.color,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${action.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${action.color}11`;
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
