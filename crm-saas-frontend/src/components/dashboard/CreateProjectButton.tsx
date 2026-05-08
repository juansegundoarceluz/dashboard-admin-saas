import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "../../hooks/useCreateProject";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "../../schemas/project";

// ─── CreateProjectButton con RHF + Zod ──────────────────────────────────────
// Mismo patron que Login/Register. El form esta dentro de un modal
// controlado (open/close) y solo se monta cuando esta abierto.
//
// reset() de useForm() limpia los valores. Lo llamamos al cerrar para que
// si el usuario abre y cierra varias veces, el form arranque limpio.

export default function CreateProjectButton() {
  const [open, setOpen] = useState(false);

  const { mutate, isPending, error: serverError, reset: resetMutation } =
    useCreateProject();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    mode: "onBlur",
  });

  const close = () => {
    setOpen(false);
    resetForm();           // limpia los inputs
    resetMutation();       // limpia el error de la mutation si quedaba
  };

  const onSubmit = (data: CreateProjectInput) => {
    mutate(data, {
      onSuccess: () => close(),
    });
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
            role="dialog"
            aria-labelledby="create-project-title"
          >
            <h2 id="create-project-title" className="mb-4 text-lg font-semibold text-text">
              Nuevo proyecto
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Nombre del proyecto"
                  autoFocus
                  className="w-full rounded border border-line bg-app p-2 text-text placeholder-muted focus:border-brand focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-danger" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  {...register("description")}
                  placeholder="Descripcion (opcional)"
                  rows={3}
                  className="w-full rounded border border-line bg-app p-2 text-text placeholder-muted focus:border-brand focus:outline-none resize-none"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-danger" role="alert">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="text-sm text-danger" role="alert">
                  {serverError.message}
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
