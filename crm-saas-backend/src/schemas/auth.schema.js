const { z } = require("zod");

// Estos schemas son los "guardianes" del backend. Cada request POST entra
// por aca antes de tocar los services. Si el body no matchea -> 400, sin
// llegar a la DB. Defense in depth.
//
// IDEAL: estos schemas serian compartidos con el frontend en una carpeta
// /shared/. Como tu backend es JS y tu frontend TS, por ahora los duplicamos
// MANTENIENDO LAS REGLAS IDENTICAS. Cuando migres el backend a TS, lo
// resolvemos con un paquete compartido.

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };
