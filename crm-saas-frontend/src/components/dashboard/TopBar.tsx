// ─── TopBar ─────────────────────────────────────────────────────────────────
// Barra superior con título, fecha y logout. El handler de logout viene de
// afuera (prop) — el TopBar no sabe ni se preocupa por cómo se desloguea
// el usuario. Esto se llama "separation of concerns".

type TopBarProps = {
  title: string;
  onLogout: () => void;
};

// Pequeña helper para formatear la fecha actual en español-AR.
// La memorizamos no — se calcula barata y solo una vez por render.
function formatToday(): string {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TopBar({ title, onLogout }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-app px-8 py-5">
      <div>
        <h1 className="m-0 text-[22px] font-bold">{title}</h1>
        <p className="m-0 mt-0.5 text-[13px] text-muted">{formatToday()}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-success shadow-[0_0_6px_var(--color-success)]" />
        <span className="text-[13px] text-muted">Sistema activo</span>

        <button
          onClick={onLogout}
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger/20"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
