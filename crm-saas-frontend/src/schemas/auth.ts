import { z } from "zod";

// ─── Login schema ───────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email invalido"),
  password: z
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register schema ────────────────────────────────────────────────────────
// El register pide los mismos campos que login MAS el nombre. Notar:
//   - .trim() limpia espacios al inicio/fin antes de validar.
//   - Podriamos hacer .min(2) para name, .max(100) para evitar abuse.
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre es demasiado largo"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Formato de email invalido"),
  password: z
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .max(72, "Maximo 72 caracteres"), // bcrypt limit, util saber
});
export type RegisterInput = z.infer<typeof registerSchema>;
