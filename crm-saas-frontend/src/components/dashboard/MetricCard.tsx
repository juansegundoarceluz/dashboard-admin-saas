// ─── MetricCard ─────────────────────────────────────────────────────────────
// Tarjeta de métrica. Muestra un número grande con label y subtítulo.
// El "accent" colorea la decoración de la esquina superior derecha.

type MetricCardProps = {
  label: string;
  value: string;
  sub: string;
  /** Color hex del acento; ej: "#6366F1" */
  accent: string;
};

export default function MetricCard({ label, value, sub, accent }: MetricCardProps) {
  return (
    <div className="relative flex-1 min-w-45 overflow-hidden rounded-2xl border border-line bg-surface px-7 py-6">
      {/* Decoración de esquina. Usamos style sólo para el color dinámico que
          NO podemos tipar con Tailwind sin arbitrary values en runtime. */}
      <div
        className="absolute right-0 top-0 h-20 w-20 rounded-bl-[80px] rounded-tr-2xl opacity-15"
        style={{ background: accent }}
      />
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mb-1.5 text-3xl font-bold leading-none text-text">
        {value}
      </p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
