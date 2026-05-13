import type { NavItem } from "../../types";

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
    <>
      {/* 1. BACKDROP (Fondo oscuro) */}
      {/* Solo existe si 'open' es true. 'md:hidden' hace que desaparezca en tablets/PC */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      {/* 2. SIDEBAR */}
      <aside
        className={`
          /* Posicionamiento: Fijo en móvil, relativo en PC */
          fixed inset-y-0 left-0 z-50 md:relative 
          flex flex-shrink-0 flex-col overflow-hidden border-r border-line bg-sidebar transition-all duration-300 ease-in-out 
          
          /* Lógica de visibilidad */
          ${open
            ? "translate-x-0 w-64 shadow-2x" // Abierto: se ve y mide 64
            : "-translate-x-full w-64 md:translate-x-0 md:w-[68px]" // Cerrado: sale de pantalla en móvil, se achica en PC
          }
        `}
      >
        {/* Logo + nombre de empresa */}
        <div className="flex min-h-[72px] items-center gap-3 border-b border-line px-5 py-6">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-violet text-lg">
            ◈
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold leading-tight truncate">{companyName}</p>
              <p className="text-[11px] text-muted">Panel de Admin</p>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex flex-col flex-1 gap-1 p-3">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  // 3. AUTO-CERRAR: Si es móvil, cerramos el sidebar al elegir una opción
                  if (window.innerWidth < 768) onToggle();
                }}
                className={`flex w-full items-center gap-3 whitespace-nowrap rounded-[10px] px-3 py-2.5 text-left text-sm transition-colors ${isActive
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

        {/* Botón de colapso (Solo útil en PC) */}
        <button
          onClick={onToggle}
          className="mx-3 mb-4 flex items-center gap-2 rounded-[10px] border border-line bg-transparent px-3 py-2.5 text-sm text-muted hover:bg-white/5"
        >
          <span className="flex-shrink-0">{open ? "◂" : "▸"}</span>
          {open && "Colapsar"}
        </button>
      </aside>
    </>
  );
}
