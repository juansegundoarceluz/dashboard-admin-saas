import { z } from "zod";

// ─── Create project schema ──────────────────────────────────────────────────
// description es opcional. Sin .transform() para evitar el type divergence
// que rompe RHF: cuando un schema tiene transforms, input y output difieren
// y RHF no puede tipar el form sin generics extra. Mantenerlo simple.

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(100, "Maximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .max(500, "Maximo 500 caracteres")
    .optional(),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
