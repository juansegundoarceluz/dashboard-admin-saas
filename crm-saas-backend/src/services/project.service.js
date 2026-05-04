const prisma = require("../config/prisma");

const createProject = async (data, userId) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            userId: userId,
        },
    });
};

const getProjects = async (userId) => {
    return await prisma.project.findMany({
        where: {
            userId: userId,  // 👈 solo los proyectos de este usuario
        },
        include: {
            tasks: true,
        },
    });
};
module.exports = {
    createProject,
    getProjects,
};