// ─── validate middleware ────────────────────────────────────────────────────
// Higher-order function: recibe un schema, devuelve un middleware Express.
// Esto se llama "middleware factory" — un patron muy comun en Express.
// Beneficio: una sola implementacion, infinitos schemas.
//
// Como se usa:
//   router.post("/projects", auth, validate(createProjectSchema), controller);
//
// Si el body NO matchea -> 400 con la lista de errores.
// Si matchea -> reemplazamos req.body con la version PARSEADA (con .trim,
// .toLowerCase, etc aplicados) y dejamos pasar al controller.

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Convertimos los issues de Zod en un formato amigable para el cliente.
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
        return res.status(400).json({ error: "Validation failed", errors });
    }

    // Importante: usar el data parseado (que ya pasó por trim/toLowerCase/etc)
    // en vez del body original. Asi los services reciben datos limpios.
    req.body = result.data;
    next();
};

module.exports = validate;
