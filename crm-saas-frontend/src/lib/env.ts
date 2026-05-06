// ─── env.ts ─────────────────────────────────────────────────────────────────
// Punto unico para leer env vars del cliente. Importamos desde aca, nunca
// directamente de import.meta.env en los componentes. Beneficios:
//   1) Tipos TypeScript en lugar de "string | undefined" en todos lados.
//   2) Validacion al boot: si falta una var critica, fail fast.
//   3) Si manana cambia el nombre, lo cambiamos aca.
//
// JUNIOR: import.meta.env.VITE_API_URL || "http://localhost:3001/api"
//         (default silencioso que rompe en produccion sin avisar)
// NOSOTROS: si falta -> Error, asi nos enteramos en el primer load.

function required(name: string): string {
  const value = import.meta.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `Missing required env var: ${name}. ` +
      `Check your .env.local file (see .env.example).`,
    );
  }
  return value;
}

export const env = {
  API_URL: required("VITE_API_URL"),
};
