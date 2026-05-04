import type { NavItem } from "../../types";

// ─── Sidebar ────────────────────────────────────────────────────────────────
// Sidebar colapsable con navegación. Es un "controlled component": el padre
// le pasa el estado (`open`, `activeId`) y los handlers (onToggle, onSelect).
// Esto se llama "lifting state up": el estado vive arriba para que el padre
// pueda coordinar varios hijos. Si el sidebar manejara su propio estado,
// otros componentes no podrían reaccionar al cambio de tab.

type SidebarProps = {
  items: NavItem[];
  activeId: string;
  open: boolean;
  companyName: string;
  onSelect: (id: string) => void;
  onToggle: () => void;
};

export default function Sidebar({
  items,
  activeId,
  open,
  companyName,
  onSelect,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={`flex flex-shrink-0 flex-col overflow-hidden border-r border-line bg-sidebar transition-[width] duration-200 ease-out ${
        open ? "w-60" : "w-[68px]"
      }`}
    >
      {/* Logo + nombre de empresa */}
      <div className="flex min-h-[72px] items-center gap-3 border-b border-line px-5 py-6">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-violet text-lg">
          ◈
        </div>
        {open && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold leading-tight">{companyName}</p>
            <p className="text-[11px] text-muted">Panel de Admin</p>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center gap-3 whitespace-nowrap rounded-[10px] px-3 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? "bg-brand/15 font-semibold text-brand-soft"
                  : "text-muted hover:bg-white/5"
              }`}
            >
              <span className="flex-shrink-0 text-base">{item.icon}</span>
              {open && item.label}
            </button>
          );
        })}
      </nav>

      {/* Botón de colapso */}
      <button
        onClick={onToggle}
        className="mx-3 mb-4 flex items-center gap-2 rounded-[10px] border border-line bg-transparent px-3 py-2.5 text-sm text-muted hover:bg-white/5"
      >
        <span className="flex-shrink-0">{open ? "◂" : "▸"}</span>
        {open && "Colapsar"}
      </button>
    </aside>
  );
}
