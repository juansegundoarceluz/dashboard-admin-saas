const prisma = require("../config/prisma");

const createUser = async (data) => {
    return await prisma.user.create({
        data,
    });
};

const getUsers = async () => {
    return await prisma.user.findMany();
};

module.exports = {
    createUser,
    getUsers,
};