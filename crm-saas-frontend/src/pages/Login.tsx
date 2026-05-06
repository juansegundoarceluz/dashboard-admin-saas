import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

// ─── Login ──────────────────────────────────────────────────────────────────
// Ya no recibe `switchToRegister` por props: navegamos con <Link to="...">.
// Ya no llama a window.location.reload(): usa useAuth().login() y luego
// navigate() para ir al dashboard. La diferencia es enorme en UX y en
// mantenibilidad.

import { env } from "../lib/env";

// El tipo del state que ProtectedRoute pasa al redirigir nos sirve para
// volver al usuario a la ruta original tras el login.
type FromState = { from?: { pathname: string } };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si el usuario llegó acá redirigido desde una ruta protegida,
  // location.state.from tiene la URL original. Si no, default a /dashboard.
  const fromPath = (location.state as FromState | null)?.from?.pathname ?? "/dashboard";

  // ─── Handler ──────────────────────────────────────────────────────────────
  // Recibimos un FormEvent porque ahora usamos <form>. preventDefault()
  // evita la navegación nativa del navegador (la que recargaría la página).
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${env.API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesion");
      }

      // Actualizamos el context (que persiste el token y notifica a todos
      // los consumidores) y navegamos. Cero reloads.
      login(data.token);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-app">
      <form
        onSubmit={handleSubmit}
        className="w-80 rounded-xl bg-surface p-6 shadow-lg border border-line"
      >
        <h2 className="mb-4 text-xl font-bold text-text">Login</h2>

        <input
          className="w-full p-2 mb-2 border border-line rounded bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          className="w-full p-2 mb-4 border border-line rounded bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="mb-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full p-2 text-white bg-brand rounded transition-colors hover:bg-brand/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Ingresando..." : "Login"}
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
