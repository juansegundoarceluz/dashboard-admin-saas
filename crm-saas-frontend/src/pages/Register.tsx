import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── Register ───────────────────────────────────────────────────────────────
// Tras un registro exitoso, mostramos un mensaje de éxito y navegamos al
// login (en vez de auto-login: queremos que el usuario verifique sus
// credenciales explícitamente). El registro NO loguea, no llama al
// AuthContext — solo crea la cuenta.

const API_URL = "http://localhost:3001/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      // Navegamos al login pasando un mensaje en location.state que el
      // login puede mostrar como "registro exitoso, ingresa".
      navigate("/login", {
        state: { justRegistered: true },
      });
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
        <h2 className="mb-4 text-xl font-bold text-text">Register</h2>

        <input
          className="w-full p-2 mb-2 border border-line rounded bg-app text-text placeholder-muted focus:border-brand focus:outline-none"
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

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
          minLength={6}
          autoComplete="new-password"
        />

        {error && (
          <p className="mb-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full p-2 text-white bg-success rounded transition-colors hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creando cuenta..." : "Register"}
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
