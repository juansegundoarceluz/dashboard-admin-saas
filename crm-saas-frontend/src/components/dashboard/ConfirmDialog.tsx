// ─── ConfirmDialog ──────────────────────────────────────────────────────────
// Modal reutilizable para confirmar acciones destructivas (borrar, archivar,
// etc). Mismo patron que el modal de CreateProjectButton:
//   - Backdrop fullscreen con onClick que dispara onCancel.
//   - stopPropagation en el card para que clicks dentro NO cierren.
//   - role="dialog" + aria-labelledby para accesibilidad basica.
//
// Es un componente "controlado": el padre decide cuando esta abierto via
// `open`, y se entera de las decisiones via `onConfirm` / `onCancel`. El
// componente no guarda estado propio. Esto hace que sea facilmente
// reutilizable: cualquier accion destructiva en cualquier parte de la app
// puede usar el mismo componente.

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Marca el boton de confirmar como destructivo (rojo). */
  destructive?: boolean;
  /** True mientras la accion confirmada esta en curso (deshabilita botones). */
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  // Tailwind no resuelve clases dinamicas via interpolacion (tree-shaking).
  // Por eso usamos ternario con strings completos en vez de `bg-${color}`.
  const confirmBtnClass = destructive
    ? "bg-danger hover:bg-danger/80"
    : "bg-brand hover:bg-brand/80";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl"
        role="dialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <h2
          id="confirm-dialog-title"
          className="mb-2 text-lg font-semibold text-text"
        >
          {title}
        </h2>
        <p id="confirm-dialog-message" className="mb-5 text-sm text-subtle">
          {message}
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded border border-line px-4 py-2 text-sm text-muted hover:bg-white/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded px-4 py-2 text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmBtnClass}`}
          >
            {isPending ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
