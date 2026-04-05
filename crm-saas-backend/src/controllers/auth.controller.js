const { error } = require("node:console");
const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json(user);
    } catch (error) {
        console.log(error);

        // 👇 error de email duplicado (Prisma)
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "Email already registered",
            });
        }

        res.status(500).json({
            error: "Error registering user",
        });
    }
};

const login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }

    if(
        error.message === "User not found" ||
        error.message === "Invalid pasword"
    ){
        return res.status(401).json({
            error: "Invalid credentials",
        });
    }

    res.status(500).json({
        error: "Error loggin in",
    });
};

module.exports = {
    register,
    login,
};