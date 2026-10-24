const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Header tiene formato: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Defense in depth: every query downstream filters by userId. If a
        // token ever lacks one, Prisma would treat `userId: undefined` as "no
        // filter" and return everyone's data, so refuse it here.
        if (typeof decoded.userId !== "string" || decoded.userId === "") {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
