const authService = require("../services/auth.service");

// ─── register ───────────────────────────────────────────────────────────────
// Patron: una respuesta por request, return temprano, errores conocidos
// se mapean a 400/401, errores inesperados a 500.

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json(user); // 201 Created — convencion REST
    } catch (error) {
        // Error conocido de Prisma: email ya registrado.
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Error desconocido: log para nosotros, mensaje generico para el cliente.
        // Nunca exponer error.message crudo: puede filtrar info interna.
        console.error("Register error:", error);
        return res.status(500).json({ error: "Error registering user" });
    }
};

// ─── login ──────────────────────────────────────────────────────────────────
// Patron: errores de credenciales devuelven 401 con mensaje generico
// ("Invalid credentials"). NO distinguimos entre "user no existe" e
// "password incorrecto" en la respuesta — eso seria un info leak: dejaria
// a un atacante enumerar emails registrados.

const login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        return res.json(data);
    } catch (error) {
        if (
            error.message === "User not found" ||
            error.message === "Invalid password"
        ) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.error("Login error:", error);
        return res.status(500).json({ error: "Error logging in" });
    }
};

module.exports = {
    register,
    login,
};
