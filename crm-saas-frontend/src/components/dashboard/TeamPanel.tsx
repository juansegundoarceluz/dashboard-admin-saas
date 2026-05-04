import type { StaffMember } from "../../types";

// ─── TeamPanel ──────────────────────────────────────────────────────────────
// Lista del equipo. Por ahora muestra mock data; cuando agreguemos un endpoint
// /team al backend, este componente no cambia: solo cambia el origen del array.

type TeamPanelProps = {
  members: StaffMember[];
};

export default function TeamPanel({ members }: TeamPanelProps) {
  return (
    <div className="px-6 py-5 border rounded-2xl border-line bg-surface">
      <h2 className="m-0 mb-4 text-base font-semibold">Equipo</h2>

      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="flex items-center justify-center text-xs font-bold rounded-full h-9 w-9 shrink-0 bg-linear-to-br from-brand to-violet">
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="m-0 text-sm font-medium truncate">{member.name}</p>
              <p className="m-0 text-xs text-muted">{member.role}</p>
            </div>
            <span className="rounded-[10px] bg-brand/10 px-2 py-0.5 text-xs text-brand-soft">
              {member.appointments} turnos
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
