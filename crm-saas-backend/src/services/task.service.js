const prisma = require("../config/prisma");

const createTask = async (data) => {
    return await prisma.task.create({
        data,
    });
};

const getTasks = async () => {
    return await prisma.task.findMany({
        include: {
            project: true, // trae info del proyecto
        },
    });
};

module.exports = {
    createTask,
    getTasks,
};