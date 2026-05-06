// ─── Config module ──────────────────────────────────────────────────────────
// Punto unico donde leemos process.env. Todo el resto del codigo importa
// de aca. Beneficios:
//   1) Si manana cambia una env var, lo cambiamos en un solo lugar.
//   2) Validamos al arrancar que las env vars criticas existan -> "fail fast".
//   3) Da autocomplete: importas { JWT_SECRET } y listo.
//
// JUNIOR: process.env.JWT_SECRET || "secret_key"  (default inseguro)
// NOSOTROS: si falta, tirar Error claro y matar el proceso al arrancar.
//           Es mejor fallar al boot que silenciosamente correr inseguro.

require("dotenv").config(); // carga .env en process.env

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}. ` +
            `Check your .env file (see .env.example).`
        );
    }
    return value;
}

module.exports = {
    PORT: process.env.PORT || 3001,
    JWT_SECRET: required("JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    DATABASE_URL: required("DATABASE_URL"),
    NODE_ENV: process.env.NODE_ENV || "development",
};
