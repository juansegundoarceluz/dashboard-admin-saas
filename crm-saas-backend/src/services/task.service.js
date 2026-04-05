const prisma = require("../config/prisma");

const createTask = async (data) => {
    return await prisma.task.create({
        data,
    });
};

const getTasks = async (userId) => {
    return await prisma.task.findMany({
        where: {
            project: {
                userId: userId,
            },
        },
        include: {
            project: true,
        },
    });
};

module.exports = {
    createTask,
    getTasks,
};