import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { env } from "../lib/env";
import { registerSchema, type RegisterInput } from "../schemas/auth";

// ─── Register con RHF + Zod ─────────────────────────────────────────────────
// Mismo patron que Login. El registro NO loguea al usuario; lo manda al

export default function Register() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const res = await fetch(`${env.API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Error al registrarse");
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-app">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 border shadow-lg w-80 rounded-xl bg-surface border-line"
      >
        <h2 className="mb-4 text-xl font-bold text-text">Register</h2>

        <input
          {...register("name")}
          type="text"
          placeholder="Nombre"
          autoComplete="name"
          className="w-full p-2 mb-1 border rounded border-line bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
        />
        {errors.name && (
          <p className="mb-2 text-xs text-danger" role="alert">
            {errors.name.message}
          </p>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full p-2 mt-2 mb-1 border rounded border-line bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
        />
        {errors.email && (
          <p className="mb-2 text-xs text-danger" role="alert">
            {errors.email.message}
          </p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className="w-full p-2 mt-2 mb-1 border rounded border-line bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
        />
        {errors.password && (
          <p className="mb-2 text-xs text-danger" role="alert">
            {errors.password.message}
          </p>
        )}

        {serverError && (
          <p className="mt-3 mb-3 text-sm text-danger" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 mt-3 text-white transition-colors rounded bg-success hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creando cuenta..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-muted">
          Ya tienes cuenta?{" "}
          <Link to="/login" className="text-brand-soft hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
