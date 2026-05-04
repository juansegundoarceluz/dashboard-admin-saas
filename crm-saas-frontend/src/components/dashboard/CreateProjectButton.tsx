import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateProject } from "../../hooks/useCreateProject";

// ─── CreateProjectButton ────────────────────────────────────────────────────
// Boton + modal de creacion de proyecto. Self-contained: maneja su propio
// estado (modal abierto, valores del form, error). El consumidor solo lo
// renderiza, no le pasa nada.
//
// El "modal" es un overlay simple. Patron clasico:
//   - Backdrop fullscreen con onClick para cerrar (UX amigable).
//   - stopPropagation en el card para que clicks dentro NO cierren.
//   - onSubmit en el <form> con preventDefault.

export default function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // useMutation devuelve el "trigger" (mutate / mutateAsync) y flags de estado.
  // isPending = la mutation esta en curso (TanStack Query v5; antes era isLoading).
  const { mutate, isPending, error, reset } = useCreateProject();

  const close = () => {
    setOpen(false);
    setName("");
    setDescription("");
    reset(); // limpia el error de la mutation si quedo de un intento anterior
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, description: description || undefined },
      {
        // onSuccess local: solo se ejecuta para esta llamada.
        // El onSuccess del hook (invalidate) tambien corre.
        onSuccess: () => close(),
      },
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-[10px] border border-brand/30 bg-brand/10 px-4 py-2.5 text-left text-[13px] font-medium text-brand-soft transition-colors hover:bg-brand/20"
      >
        + Nuevo proyecto
      </button>

      {open && (
        <div
          // Backdrop: click afuera cierra
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={close}
        >
          <div
            // stopPropagation: clicks dentro del card no cierran
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
            role="dialog"
            aria-labelledby="create-project-title"
          >
            <h2 id="create-project-title" className="mb-4 text-lg font-semibold text-text">
              Nuevo proyecto
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="rounded border border-line bg-app p-2 text-text placeholder-muted focus:border-brand focus:outline-none"
              />

              <textarea
                placeholder="Descripcion (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded border border-line bg-app p-2 text-text placeholder-muted focus:border-brand focus:outline-none resize-none"
              />

              {error && (
                <p className="text-sm text-danger" role="alert">
                  {error.message}
                </p>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={isPending}
                  className="rounded border border-line px-4 py-2 text-sm text-muted hover:bg-white/5 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
