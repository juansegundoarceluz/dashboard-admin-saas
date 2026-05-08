import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { env } from "../lib/env";
import { loginSchema, type LoginInput } from "../schemas/auth";

// ─── Login con React Hook Form + Zod ────────────────────────────────────────
// Comparado con la version anterior:
//   - Cero useState para email/password. RHF maneja todo internamente.
//   - Validacion declarativa: el schema dice las reglas, RHF las aplica.
//   - register("email") conecta el input al form. El "uncontrolled" de
//     RHF significa que no hay re-render por keystroke — gran ganancia
//     en forms grandes.
//   - errors.email viene del resolver Zod, ya parseado y listo para mostrar.

type FromState = { from?: { pathname: string } };

export default function Login() {
  // submitting/serverError siguen siendo useState porque son estado de UI
  // que no tiene que ver con los campos del form en si.
  const [serverError, setServerError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as FromState | null)?.from?.pathname ?? "/dashboard";

  // ─── useForm: el corazon de RHF ───────────────────────────────────────────
  // <LoginInput> = tipa register/handleSubmit/errors automaticamente.
  // resolver: zodResolver(loginSchema) = "valida con este schema antes de
  //   pasarme el onSubmit. Si no pasa, llena `errors` y NO llama onSubmit".
  // mode: "onBlur" = valida cuando el input pierde foco (mejor UX que
  //   onChange que valida en cada tecla).
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // ─── onSubmit: solo corre si la validacion paso ───────────────────────────
  // Recibimos los datos ya tipados como LoginInput (gracias a Zod + TS).
  // No tenemos que hacer e.preventDefault() — handleSubmit lo hace.
  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const res = await fetch(`${env.API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Error al iniciar sesion");
      login(body.token);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-app">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 rounded-xl bg-surface p-6 shadow-lg border border-line"
      >
        <h2 className="mb-4 text-xl font-bold text-text">Login</h2>

        {/* register("email") inyecta name, onChange, onBlur, ref. RHF
            recolecta el valor solo. Sin useState, sin onChange manual. */}
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full p-2 mb-1 border border-line rounded bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
        />
        {/* errors.email viene populado si el schema fallo. Solo lo mostramos
            si existe — RHF se encarga de cuando aparecer y desaparecer. */}
        {errors.email && (
          <p className="mb-2 text-xs text-danger" role="alert">
            {errors.email.message}
          </p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full p-2 mt-2 mb-1 border border-line rounded bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
        />
        {errors.password && (
          <p className="mb-2 text-xs text-danger" role="alert">
            {errors.password.message}
          </p>
        )}

        {/* serverError es separado: viene de la API, no de la validacion local. */}
        {serverError && (
          <p className="mt-3 mb-3 text-sm text-danger" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 mt-3 text-white bg-brand rounded transition-colors hover:bg-brand/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Ingresando..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-muted">
          No tienes cuenta?{" "}
          <Link to="/register" className="text-brand-soft hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
