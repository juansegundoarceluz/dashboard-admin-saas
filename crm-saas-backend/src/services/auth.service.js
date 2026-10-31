const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

// Strip the password hash before a user object leaves the service layer.
const toPublicUser = (user) => {
    const { password, ...publicUser } = user;
    return publicUser;
};

const register = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });

    return toPublicUser(user);
};

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,                 // viene de config/env.js
        { expiresIn: JWT_EXPIRES_IN }
    );

    return { user: toPublicUser(user), token };
};

module.exports = {
    register,
    login,
};
